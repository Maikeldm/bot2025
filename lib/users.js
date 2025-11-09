// lib/users.js - Refactored for Redis (CON ÍNDICE INVERSO)

const Redis = require('ioredis');
const path = require('path');
const fs = require('fs');

// --- Conexión a Redis ---
const redis = new Redis(); // Asume localhost:6379, sin contraseña

redis.on('error', (err) => console.error('[REDIS] Connection Error:', err));
redis.on('connect', () => console.log('[REDIS] Connected successfully!'));

// --- Funciones Principales (API del Módulo - Ahora usan Redis) ---

/**
 * Obtiene un usuario por su ID de Telegram desde Redis.
 * @param {string|number} telegram_id - El ID de Telegram.
 * @returns {Promise<Object>} El objeto del usuario o uno por defecto si no existe.
 */
async function getUser(telegram_id) {
    const key = `user:${telegram_id}`;
    try {
        const userData = await redis.hgetall(key);
        if (userData && Object.keys(userData).length > 0) {
            // Convertir tipos
            userData.telegram_id = parseInt(userData.telegram_id, 10);
            userData.whatsapp_number = userData.whatsapp_number === 'null' ? null : userData.whatsapp_number;
            // ... (descomenta y adapta para otros campos si los usas)
            // userData.expires = userData.expires === 'null' ? null : userData.expires;
            // userData.created_at = userData.created_at === 'null' ? null : userData.created_at;
            // userData.updated_at = userData.updated_at === 'null' ? null : userData.updated_at;
            return userData;
        } else {
            return { telegram_id: parseInt(telegram_id, 10), whatsapp_number: null };
        }
    } catch (error) {
        console.error(`[REDIS getUser] Error getting user ${telegram_id}:`, error);
        return { telegram_id: parseInt(telegram_id, 10), whatsapp_number: null }; // Fallback
    }
}

/**
 * Actualiza o crea un usuario en Redis y mantiene el índice inverso whatsapp -> telegram_id.
 * @param {string|number} telegram_id - El ID de Telegram.
 * @param {string|null} number - El número de WhatsApp (o null para limpiar).
 * @returns {Promise<boolean>} `true` si la operación fue exitosa.
 */
async function updateUserWhatsapp(telegram_id, number) {
    const key = `user:${telegram_id}`;
    const stringId = String(telegram_id); // Usar string para consistencia en Redis
    const now = new Date().toISOString();
    const cleanNumber = number ? String(number).replace(/[^0-9]/g, '') : null;

    try {
        // --- 1. Obtener el número ANTERIOR para limpiar el índice viejo ---
        const oldUserData = await redis.hgetall(key); // Usamos hgetall por si no existe aún
        const oldNumber = oldUserData?.whatsapp_number && oldUserData.whatsapp_number !== 'null' ? oldUserData.whatsapp_number : null;

        // --- 2. Preparar pipeline para actualizar todo ---
        const pipeline = redis.pipeline();

        // Datos del usuario (Hash)
        const userDataToSet = {
            telegram_id: stringId,
            whatsapp_number: cleanNumber === null ? 'null' : cleanNumber,
            updated_at: now
        };
        pipeline.hmset(key, userDataToSet);
        pipeline.hsetnx(key, 'created_at', now); // Solo si no existe

        // Actualizar Set 'whatsapp_users'
        if (cleanNumber) {
            pipeline.sadd('whatsapp_users', stringId);
        } else {
            pipeline.srem('whatsapp_users', stringId);
        }

        // --- 3. Actualizar ÍNDICE INVERSO ---
        // Si había un número viejo, borrar su índice
        if (oldNumber && oldNumber !== cleanNumber) { // Evita borrar si el número no cambió
            pipeline.del(`whatsapp:${oldNumber}`);
            console.log(`[REDIS Index] Deleting old index for ${oldNumber}`);
        }
        // Si hay un número nuevo (y diferente al viejo), crear su índice
        if (cleanNumber && cleanNumber !== oldNumber) {
            pipeline.set(`whatsapp:${cleanNumber}`, stringId);
            console.log(`[REDIS Index] Setting new index for ${cleanNumber} -> ${stringId}`);
        }
        // --- Fin Actualizar Índice ---

        await pipeline.exec(); // Ejecutar todo
        console.log(`[REDIS updateUserWhatsapp] User ${telegram_id} updated with number ${cleanNumber}.`);
        return true;
    } catch (error) {
        console.error(`[REDIS updateUserWhatsapp] Error updating user ${telegram_id}:`, error);
        return false;
    }
}

/**
 * Limpia el número de WhatsApp de un usuario y actualiza índices.
 * @param {string|number} telegram_id - El ID de Telegram.
 * @returns {Promise<boolean>} `true` si se modificó el campo.
 */
async function clearUserWhatsapp(telegram_id) {
    const key = `user:${telegram_id}`;
    const stringId = String(telegram_id);
    try {
        // --- 1. Obtener el número ACTUAL para limpiar su índice ---
        const currentNumber = await redis.hget(key, 'whatsapp_number');

        // --- 2. Preparar pipeline ---
        const pipeline = redis.pipeline();
        // Limpiar número en el Hash
        pipeline.hset(key, 'whatsapp_number', 'null');
        // Quitar del Set 'whatsapp_users'
        pipeline.srem('whatsapp_users', stringId);
        // Quitar del Índice Inverso (si existía número)
        if (currentNumber && currentNumber !== 'null') {
            pipeline.del(`whatsapp:${currentNumber}`);
            console.log(`[REDIS Index] Deleting index for ${currentNumber} (clearing)`);
        }

        const results = await pipeline.exec();
        console.log(`[REDIS clearUserWhatsapp] Cleared number for ${telegram_id}.`);
        // Verificar si HSET tuvo éxito
        return results[0][1] > -1; // [0] = primer comando (hset), [1] = resultado
    } catch (error) {
        console.error(`[REDIS clearUserWhatsapp] Error clearing whatsapp for ${telegram_id}:`, error);
        return false;
    }
}

/**
 * Elimina un usuario por completo y actualiza índices.
 * @param {string|number} telegram_id - El ID de Telegram.
 * @returns {Promise<boolean>} `true` si el usuario fue encontrado y eliminado.
 */
async function deleteUser(telegram_id) {
    const key = `user:${telegram_id}`;
    const stringId = String(telegram_id);
    try {
        // --- 1. Obtener el número ACTUAL para limpiar su índice ---
        const currentNumber = await redis.hget(key, 'whatsapp_number');

        // --- 2. Preparar pipeline ---
        const pipeline = redis.pipeline();
        // Eliminar Hash del usuario
        pipeline.del(key);
        // Quitar del Set 'whatsapp_users'
        pipeline.srem('whatsapp_users', stringId);
        // Quitar del Índice Inverso (si existía número)
        if (currentNumber && currentNumber !== 'null') {
            pipeline.del(`whatsapp:${currentNumber}`);
            console.log(`[REDIS Index] Deleting index for ${currentNumber} (deleting user)`);
        }

        const results = await pipeline.exec();
        console.log(`[REDIS deleteUser] Deleted user ${telegram_id}.`);
        // Verificar si DEL (primer comando) tuvo éxito
        return results[0][1] === 1; // 1 = key existía y fue borrada
    } catch (error) {
        console.error(`[REDIS deleteUser] Error deleting user ${telegram_id}:`, error);
        return false;
    }
}

/**
 * Busca a un usuario por su número de WhatsApp usando el índice inverso.
 * @param {string} whatsappNumber - El número de WhatsApp.
 * @returns {Promise<Object|null>} El objeto del usuario o `null`.
 */
async function findUserByWhatsapp(whatsappNumber) {
    const cleanNumber = String(whatsappNumber).replace(/[^0-9]/g, '');
    const indexKey = `whatsapp:${cleanNumber}`;
    try {
        // Busca el ID de telegram en el índice
        const telegramId = await redis.get(indexKey);
        if (telegramId) {
            // Si lo encuentra, busca al usuario completo
            return await getUser(telegramId);
        } else {
            console.log(`[REDIS findUserByWhatsapp] No index found for ${cleanNumber}`);
            return null; // No se encontró índice
        }
    } catch (error) {
        console.error(`[REDIS findUserByWhatsapp] Error finding user by whatsapp ${cleanNumber}:`, error);
        return null;
    }
}

/**
 * Comprueba si la sesión de WhatsApp existe (verifica creds.json).
 * @param {string|number} telegram_id - El ID de Telegram.
 * @returns {Promise<boolean>} `true` si la sesión existe.
 */
async function isWhatsappConnected(telegram_id) {
    const user = await getUser(telegram_id); // Obtiene user de Redis
    if (!user || !user.whatsapp_number) {
        return false;
    }
    const credsPath = path.join(__dirname, '..', 'lib', 'pairing', String(telegram_id), user.whatsapp_number, 'creds.json');
    return fs.existsSync(credsPath); // Chequea archivo
}

/**
 * Verifica si la suscripción está activa (requiere campo 'expires').
 * @param {Object} user - El objeto del usuario.
 * @returns {boolean} `true` si está activa.
 */
function isActive(user) {
    // Necesitas asegurarte de que guardas 'expires' en updateUserPremium (o similar)
    // y que getUser lo recupera. Asumiendo que es un ISO String.
    if (!user || !user.expires || user.expires === 'null') {
        return false;
    }
    try {
        return new Date(user.expires) > new Date();
    } catch (e) {
        console.error("[REDIS isActive] Error parsing date:", user.expires, e);
        return false;
    }
}

/**
 * Obtiene todos los usuarios con WhatsApp activo usando el Set 'whatsapp_users'.
 * @returns {Promise<Array<Object>>} Lista de usuarios.
 */
async function getAllUsersWithWhatsapp() {
    try {
        const userIds = await redis.smembers('whatsapp_users');
        if (!userIds || userIds.length === 0) return [];

        const pipeline = redis.pipeline();
        userIds.forEach(id => pipeline.hgetall(`user:${id}`));
        const results = await pipeline.exec();

        const users = results
            .map(result => result[1])
            .filter(userData => userData && Object.keys(userData).length > 0)
            .map(userData => { // Convertir tipos
                userData.telegram_id = parseInt(userData.telegram_id, 10);
                userData.whatsapp_number = userData.whatsapp_number === 'null' ? null : userData.whatsapp_number;
                // ... convertir otros campos si los usas ...
                return userData;
            });
        return users;
    } catch (error) {
        console.error(`[REDIS getAllUsersWithWhatsapp] Error:`, error);
        return [];
    }
}

// --- Exportar Funciones ---
module.exports = {
    getUser,
    updateUserWhatsapp,
    clearUserWhatsapp,
    deleteUser,
    findUserByWhatsapp,
    isWhatsappConnected,
    isActive,
    getAllUsersWithWhatsapp,
    redis // Opcional: exportar cliente Redis
};
