// plugins/tag.js (CORREGIDO OTRA VEZ)

const { downloadContentFromMessage } = require('baron-baileys-v2');

module.exports = {
    name: 'tag',
    alias: [],
    async execute(conn, m, args, context) {
        // --- 1. Extraemos variables ---
        const {
            reply,
            isGroup,
            participants,
            text, // El texto después de ?tag
            isBot // <--- ¡Usamos esta!
        } = context;

        // --- 2. ¡¡FIX!! Permiso SOLO para el bot ---
        if (!isBot) return reply('Este comando solo puede ser usado por el bot.'); // <-- ¡CORREGIDO!
        if (!isGroup) return reply('Este comando solo funciona en grupos.');

        // --- 3. Obtener JIDs ---
        if (!participants) return reply('No pude obtener la lista de participantes.');
        const participantJids = participants.map(p => p.id);

        // --- 4. Preparar mensaje ---
        let options = { mentions: participantJids };
        let messageContent = {};
        let useDefaultText = true;
        let quotedForSending = null; // Para citar el mensaje original

        // --- 5. Revisar mensaje citado ---
        if (m.quoted) {
            const quotedMsg = m.quoted;
            const quotedMtype = Object.keys(quotedMsg.message)[0];
            quotedForSending = quotedMsg; // Siempre citamos el original para contexto

            try {
                if (quotedMtype === 'stickerMessage') {
                    console.log("[DEBUG Tag Plugin] Detectado sticker citado. Descargando..."); // Log para depurar
                    const stickerBuffer = await downloadContentFromMessage(quotedMsg.message.stickerMessage, 'sticker');
                    if (!stickerBuffer) throw new Error("Buffer de sticker vacío"); // Verificar descarga
                    console.log("[DEBUG Tag Plugin] Sticker descargado. Preparando mensaje.");
                    messageContent = { sticker: stickerBuffer };
                    useDefaultText = false;
                } else if (quotedMtype === 'imageMessage') {
                    console.log("[DEBUG Tag Plugin] Detectada imagen citada. Descargando...");
                    const imageBuffer = await downloadContentFromMessage(quotedMsg.message.imageMessage, 'image');
                    if (!imageBuffer) throw new Error("Buffer de imagen vacío");
                    // Prioridad caption: 1° Texto del comando, 2° Caption original
                    const caption = text || quotedMsg.message.imageMessage.caption || '';
                    console.log("[DEBUG Tag Plugin] Imagen descargada. Preparando mensaje con caption:", caption);
                    messageContent = { image: imageBuffer, caption: caption };
                    useDefaultText = false;
                } else if (quotedMtype === 'videoMessage') {
                    console.log("[DEBUG Tag Plugin] Detectado video citado. Descargando...");
                    const videoBuffer = await downloadContentFromMessage(quotedMsg.message.videoMessage, 'video');
                    if (!videoBuffer) throw new Error("Buffer de video vacío");
                    const caption = text || quotedMsg.message.videoMessage.caption || '';
                    console.log("[DEBUG Tag Plugin] Video descargado. Preparando mensaje con caption:", caption);
                    messageContent = { video: videoBuffer, caption: caption };
                    useDefaultText = false;
                } else if (quotedMtype === 'audioMessage') {
                    console.log("[DEBUG Tag Plugin] Detectado audio citado. Descargando...");
                    const audioBuffer = await downloadContentFromMessage(quotedMsg.message.audioMessage, 'audio');
                    if (!audioBuffer) throw new Error("Buffer de audio vacío");
                    console.log("[DEBUG Tag Plugin] Audio descargado. Preparando mensaje.");
                    messageContent = {
                        audio: audioBuffer,
                        ptt: quotedMsg.message.audioMessage.ptt,
                        mimetype: 'audio/mpeg'
                    };
                    useDefaultText = false;
                } else if (quotedMsg.text) {
                     // Si se cita texto, lo ignoramos si el bot también escribió texto,
                     // para priorizar el reenvío de media si aplica.
                     // Solo usamos el texto citado si NO hay texto en el comando actual Y no es media.
                    if (!text) {
                         messageContent = { text: quotedMsg.text };
                         useDefaultText = false;
                         quotedForSending = null; // No citar si solo reenviamos texto
                    }
                     console.log("[DEBUG Tag Plugin] Detectado texto citado.");
                } else {
                     console.log("[DEBUG Tag Plugin] Tipo de mensaje citado no soportado:", quotedMtype);
                     // Si el tipo citado no es soportado, intentará usar el texto del comando o el default
                }
            } catch (e) {
                console.error("[ERROR Tag Plugin] Error descargando/procesando media citada:", e);
                // No enviamos 'reply' aquí para que intente enviar el texto del comando si existe
                // return reply("❌ Error al procesar el mensaje citado.");
            }
        }

        // --- 6. Usar texto del comando si no se procesó una cita (o si falló la descarga) ---
        if (useDefaultText && text) {
            console.log("[DEBUG Tag Plugin] Usando texto del comando:", text);
            messageContent = { text };
            useDefaultText = false;
        }

        // --- 7. Usar texto default si no hubo NADA ---
        if (useDefaultText) {
            console.log("[DEBUG Tag Plugin] Usando texto por defecto.");
            messageContent = { text: '👻' };
        }

        // --- 8. Enviar mensaje final ---
        // Asegurarse de que messageContent tenga algo
        if (Object.keys(messageContent).length === 0) {
             console.error("[ERROR Tag Plugin] messageContent está vacío antes de enviar.");
             return reply("❌ Error interno: No se pudo preparar el mensaje para enviar.");
        }

        try {
             console.log("[DEBUG Tag Plugin] Enviando mensaje final:", Object.keys(messageContent));
            await conn.sendMessage(m.chat, {
                ...messageContent,
                mentions: participantJids
            }, { quoted: quotedForSending });
        } catch (e) {
            console.error("[ERROR Tag Plugin] Error enviando mensaje con tag:", e);
            reply("❌ Error al enviar el mensaje con las etiquetas.");
        }
    }
};
