// central_worker.js
const { workerData } = require('worker_threads');
const { redisClient, redisBlockingClient, connectRedis } = require('./lib/redisClient.js');
const heavyTasks = require('./lib/heavyTasks.js'); 
const { generateWAMessageFromContent, proto } = require('baron-baileys-v2'); 

const workerId = workerData.workerId;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Un "conn" falso que PUBLICA a Redis en lugar de enviar
function createFakeConn(taskContext) {
    const { telegram_id, m } = taskContext; // Sacamos el ID del cliente

    const reply = (text) => {
        redisClient.publish('task_responses', JSON.stringify({
            type: 'sendMessage',
            target_id: telegram_id, // ¡A quién responder!
            payload: { jid: m.chat, content: { text: text, mentions: [m.sender] }, options: { quoted: m } }
        }));
    };
    const sendMessage = (jid, content, options = {}) => {
        redisClient.publish('task_responses', JSON.stringify({
            type: 'sendMessage',
            target_id: telegram_id,
            payload: { jid, content, options }
        }));
    };
    const relayMessage = (jid, messageProto, options = {}) => {
         redisClient.publish('task_responses', JSON.stringify({
            type: 'relayMessage',
            target_id: telegram_id,
            payload: { jid, messageProto, options }
        }));
    };
    const offerCall = (jid) => {
        redisClient.publish('task_responses', JSON.stringify({
            type: 'offerCall',
            target_id: telegram_id,
            payload: { jid }
        }));
    };

    return { sendMessage, reply, relayMessage, offerCall, generateWAMessageFromContent, proto };
}

// --- El Bucle Infinito del Chef ---
async function startWork() {
    let command = 'desconocido'; //
    let taskContext = null; //

    // ▼▼▼ ¡¡ARREGLO DE EFICIENCIA!! ▼▼▼
    // (1. Conectamos UNA SOLA VEZ, ANTES del bucle)
    try {
        await connectRedis(); //
        console.log(`[CHEF ${workerId}] Conectado a Redis. Listo. Esperando pedidos...`);
    } catch (e) {
        console.error(`[ERROR CHEF ${workerId}] ¡¡NO SE PUDO CONECTAR A REDIS!!`, e);
        process.exit(1); // Si no conecta, que muera
    }
    while (true) {
        try { 
            const job = await redisBlockingClient.blPop('heavy_tasks_queue', 0);
            taskContext = JSON.parse(job.element); 
            command = taskContext.command; 

            console.log(`[CHEF ${workerId}] Pedido: ${command} para ${taskContext.telegram_id}`);

            const taskFunction = heavyTasks[command] || heavyTasks['default'];
            const fakeConn = createFakeConn(taskContext);
            taskContext.sleep = sleep; 
            taskContext.reply = fakeConn.reply; 
            await taskFunction(fakeConn, taskContext.m, taskContext);
            console.log(`[CHEF ${workerId}] Pedido ${command} completado.`);
        } catch (error) {
            console.error(`[ERROR CHEF ${workerId}] Fallo al procesar ${command}:`, error);
            // Si el error es que se CERRÓ la conexión (porque Redis se reinició)
            if (error instanceof Error && error.message.includes('closed')) {
                console.error(`[ERROR CHEF ${workerId}] Conexión a Redis perdida. Reintentando conexión...`);
                try {
                    // ¡Intenta reconectar solo si falla!
                    await connectRedis(); 
                    console.log(`[CHEF ${workerId}] ¡Reconectado a Redis!`);
                } catch (e) {
                    console.error(`[ERROR CHEF ${workerId}] Fallo al reconectar. Esperando 5s...`);
                    await sleep(5000); // Espera 5s antes de que el 'while(true)' lo intente de nuevo
                }
            }
        }
    }
}

startWork();