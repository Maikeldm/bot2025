// central_worker.js
const { workerData } = require('worker_threads');
const { redisClient, redisBlockingClient } = require('./lib/redisClient.js');
const heavyTasks = require('./lib/heavyTasks.js'); // ¡EL LIBRO DE RECETAS!
const { generateWAMessageFromContent, proto } = require('baron-baileys-v2'); // Dependencias

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
    console.log(`[CHEF ${workerId}] Listo. Esperando pedidos en 'heavy_tasks_queue'...`);
    while (true) {
        try {
            // 1. Espera un pedido de Redis (bloquea el hilo)
            const job = await redisBlockingClient.blPop('heavy_tasks_queue', 0);
            const taskContext = JSON.parse(job.element);
            const command = taskContext.command;

            console.log(`[CHEF ${workerId}] Pedido: ${command} para ${taskContext.telegram_id}`);

            // 2. Busca la receta en tu "Libro"
            const taskFunction = heavyTasks[command] || heavyTasks['default'];

            // 3. Prepara la "cocina" (el conn falso y el contexto)
            const fakeConn = createFakeConn(taskContext);
            taskContext.sleep = sleep; // (Tu 'spam-call' usa 'sleep')
            taskContext.reply = fakeConn.reply; // (Tu 'atraso-new' usa 'reply')

            // 4. ¡COCINA! (Ejecuta la receta)
            await taskFunction(fakeConn, taskContext.m, taskContext);

            console.log(`[CHEF ${workerId}] Pedido ${command} completado.`);

        } catch (error) {
            console.error(`[ERROR CHEF ${workerId}] Fallo al procesar ${command}:`, error);
        }
    }
}

startWork();