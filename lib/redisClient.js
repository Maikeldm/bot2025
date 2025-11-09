// lib/redisClient.js
const { createClient } = require('redis');

// Cliente 1: Para comandos normales (PUSH, PUBLISH)
const redisClient = createClient();

// Cliente 2: Duplicado para comandos de BLOQUEO (BLPOP)
// Redis no permite que un cliente que está "esperando" (blpop)
// haga otros comandos. Por eso duplicamos la conexión.
const redisBlockingClient = redisClient.duplicate();

// Cliente 3: Duplicado para el "Oído" (SUBSCRIBE)
// (Igual, un cliente suscrito no puede hacer otros comandos)
const redisSubscriber = redisClient.duplicate();

// Manejo de errores (básico)
redisClient.on('error', (err) => console.error('[REDIS CLIENT ERR]', err));
redisBlockingClient.on('error', (err) => console.error('[REDIS BLOCKING ERR]', err));
redisSubscriber.on('error', (err) => console.error('[REDIS SUB ERR]', err));

async function connectRedis() {
    try {
        await redisClient.connect();
        await redisBlockingClient.connect();
        await redisSubscriber.connect();
        console.log('[REDIS] Clientes conectados exitosamente!');
    } catch (e) {
        console.error('[REDIS] Fallo fatal al conectar.', e);
        process.exit(1); // Si Redis no conecta, paramos todo.
    }
}

module.exports = {
    connectRedis,
    redisClient,
    redisBlockingClient,
    redisSubscriber
};