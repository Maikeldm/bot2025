// lib/heavyTaskWorker.js
const { parentPort } = require('worker_threads');
const heavyTasks = require('./heavyTasks.js'); // Importa las funciones pesadas
const {
    generateWAMessageFromContent,
            getAggregateVotesInPollMessage,
            downloadContentFromMessage,
            prepareWAMessageMedia,
            useMultiFileAuthState,
            generateMessageID,
            generateIOSMessageID,
            generateWAMessage,
            makeInMemoryStore,
            DisconnectReason,
            areJidsSameUser,
            getContentType,
            decryptPollVote,
            relayMessage,
            jidDecode,
            Browsers,
            getDevice,
            proto,
} = require('baron-baileys-v2'); 
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

parentPort.on('message', async (task) => {
  const { command, m } = task; 
const context = task;       
    
    const taskFunction = heavyTasks[command];

    if (!taskFunction) {
        parentPort.postMessage({ 
            type: 'task_error', 
            error: `Comando pesado '${command}' no encontrado en heavyTasks.js` 
        });
        return;
    }

    try {
        // --- Callbacks para que el hilo envíe mensajes ---

        // 1. Para mensajes de texto simples
        const reply = (text) => {
            parentPort.postMessage({
                type: 'send_message',
                payload: {
                    jid: m.chat,
                    content: { text: text, mentions: [m.sender] },
                    options: { quoted: m }
                }
            });
        };

        // 2. Para mensajes de contenido complejo (media, botones, etc.)
        const sendMessage = (jid, content, options = {}) => {
            parentPort.postMessage({
                type: 'send_message',
                payload: { jid, content, options }
            });
        };
        
        // 3. Para mensajes que requieren 'relay' (protocolo)
        const relayMessage = (jid, messageProto, options = {}) => {
             parentPort.postMessage({
                type: 'relay_message',
                payload: { jid, messageProto, options }
            });
        };
       const offerCall = (jid) => {
            parentPort.postMessage({
                type: 'offer_call',
                payload: { jid }
            });
        };
        // Construimos el 'conn' simulado y el 'm' para las tareas
        const fakeConn = {
            sendMessage,
            offerCall,
            relayMessage,
            generateWAMessageFromContent, // Pasa la función real
            proto // Pasa el proto real
        };

        // Ejecuta la tarea pesada
        await taskFunction(fakeConn, m, context);

        // Informa que terminó
        parentPort.postMessage({ type: 'task_complete', command: command });

    } catch (error) {
        console.error(error); // Log local del hilo
        parentPort.postMessage({ type: 'task_error', error: error.message || String(error) });
    }
});