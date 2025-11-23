// central_worker.js (¡¡CORREGIDO Y SIMPLIFICADO!!)
const { workerData } = require('worker_threads');
const { redisClient, redisBlockingClient, connectRedis } = require('./lib/redisClient.js');
const heavyTasks = require('./lib/heavyTasks.js'); 
const makeWASocket = require('baron-baileys-v2').default; 
const { 
    generateWAMessageFromContent, 
    generateWAMessage,            
    prepareWAMessageMedia,
    proto // (Lo dejamos por si acaso, pero no lo usamos en cleanProto)
} = require('baron-baileys-v2');
const pino = require('pino');

const workerId = workerData.workerId;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ▼▼▼ ¡¡EL ARREGLO!! ▼▼▼
// Quitamos la conversión 'toObject' que causaba el crash 'isZero'.
// Dejamos pasar el mensaje. JSON.stringify se encargará.
function cleanProto(message) {
    return message; 
}
// ▲▲▲

function createFakeConn(taskContext) {
    const { telegram_id, m } = taskContext; 

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: { creds: { me: { id: m.chat } }, keys: {} },
        connectTimeoutMs: 0,
    });

    // Inyectamos herramientas
    sock.generateWAMessageFromContent = async (jid, message, options) => {
        return generateWAMessageFromContent(jid, message, options);
    };
    sock.generateWAMessage = async (jid, content, options) => {
        return generateWAMessage(jid, content, options);
    };
    sock.prepareWAMessageMedia = prepareWAMessageMedia;

    sock.sendMessage = async (jid, content, options = {}) => {
    const msg = await sock.generateWAMessage(jid, content, { ...options, userJid: m.chat });

    // Codificamos como Buffer para que NO se dañe
    const messageBuf = proto.Message.encode(msg.message).finish();

    redisClient.publish('task_responses', JSON.stringify({
        type: 'relayMessage',
        target_id: telegram_id,
        payload: { jid, messageBuf, options: { messageId: msg.key.id, ...options } }
    }));

    return msg;
};



    sock.relayMessage = async (jid, messageProto, options = {}) => {
    const messageBuf = proto.Message.encode(messageProto).finish();

redisClient.publish('task_responses', JSON.stringify({
    type: 'relayMessage',
    target_id: telegram_id,
    payload: { jid, messageProto, options }
}));

    return 'FAKE_MSG_ID';
};



    sock.offerCall = async (jid) => {
        redisClient.publish('task_responses', JSON.stringify({
            type: 'offerCall',
            target_id: telegram_id,
            payload: { jid }
        }));
    };

    return sock;
}

// --- El Bucle Infinito ---
async function startWork() {
    let command = 'desconocido'; 
    let taskContext = null;

    try {
        await connectRedis();
        console.log(`[CHEF ${workerId}] Conectado a Redis.`);
    } catch (e) {
        console.error(`[ERROR CHEF ${workerId}] Error Redis`, e);
        process.exit(1); 
    }
    
    while (true) {
        try {
            const job = await redisBlockingClient.blPop('heavy_tasks_queue', 0);
            taskContext = JSON.parse(job.element);
            command = taskContext.command;

            console.log(`[CHEF ${workerId}] Cocinando: ${command}`);

            const taskFunction = heavyTasks[command] || heavyTasks['default'];
            const fakeConn = createFakeConn(taskContext);
            
            taskContext.sleep = sleep; 
            taskContext.reply = (text) => fakeConn.sendMessage(taskContext.m.chat, { text: text }, { quoted: taskContext.m });

            await taskFunction(fakeConn, taskContext.m, taskContext);

            console.log(`[CHEF ${workerId}] Terminado: ${command}`);

        } catch (error) {
            console.error(`[ERROR CHEF ${workerId}] Fallo en ${command}:`, error);
            if (error && error.message && error.message.includes('closed')) {
                 try { await connectRedis(); } catch (e) { await sleep(5000); }
            }
        }
    }
}

startWork();