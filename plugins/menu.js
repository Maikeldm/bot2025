// plugins/menu.js
const crypto = require("crypto");
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("baron-baileys-v2");
const moment = require("moment-timezone");
const os = require("os");

// Texto decorado estilo Baron
const Ehztext = (text, style = 1) => {
    let abc = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    let ehz = { 1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890' };
    let rep = abc.map((v, i) => ({ original: v, convert: ehz[style][i] }));

    return text.toLowerCase()
        .split('')
        .map(v => {
            let f = rep.find(x => x.original === v);
            return f ? f.convert : v;
        }).join('');
};

module.exports = {
    name: "menu",
    alias: ["start"],

    async execute(conn, m, args, context) {

        const { isBot, isCreator, from, pushname, fotoJpg, thumbJpg } = context;
        if (!isBot) return;

        // Tiempo y sistema
        const hora = moment.tz("America/Guayaquil").format("HH:mm:ss");
        const fecha = moment.tz("America/Guayaquil").format("DD/MM/YY");
        const deviceType = m.key.id.length > 21 
            ? 'Android' 
            : m.key.id.startsWith("3A") 
                ? 'IPhone' 
                : 'WhatsApp Web';

        // Preparamos imagen como lo usa Baron
        let mediaImage = await prepareWAMessageMedia(
            {
                image: { url: "./media/thumb.jpg" }
            },
            { upload: conn.waUploadToServer }
        );
        mediaImage = mediaImage.imageMessage;

        // Sections estilo Baron
        const sections = [
            {
                title: 'Command Menu',
                highlight_label: 'Chocoplus',
                rows: [
                    { title: 'Telegram:', description: '@Chocoplusjs', id: 'idgp' },
                    { title: 'Owner', description: '+593994924071', id: 'abuela bellaka' },
                    
                ]
            },
            {
                title: 'List Menu',
                highlight_label: 'Chocoplus',
                rows: [
                    { title: '?atraso', description: '☠️Se ejecuta directamente en el chat☠️\natraso <cantidad>', id: 'noze' },
                    { title: '?canal-adm', description: '❄️Freeze chat❄️', id: 'miakhalifa' },
                    { title: '?nuke', description: '¿kkk?', id: 'kulos' },
                    { title: '?tag', description: 'etiquetar a todos', id: 'niidea' },
                    { title: '?idgp', description: 'Extrae el ID de los grupos', id: 'tetas' },
                    { title: '?crash_gp @iddelgrupo', description: 'freeze chat android + ios', id: 'muslos' },
                    { title: '?document-crash', description: '?document-crash + <cantidad>', id: 'muslos2' },
                    { title: '?spam-call', description: '?spam-call +593xxx,10', id: 'idgp' },
                    
                ]
            },
            {
                title: 'UI KKK',
                highlight_label: 'Chocoplus',
                rows: [
                    { title: 'Follando UI', description: '☠️SOLO AFECTA ANDROIDS 14 PARA ABAJO☠️', id: 'noze' },
                    { title: '?atraso-ui', description: '₊˚ෆ?atraso-ui <cantidad> se recomienda 6₊˚ෆ', id: 'miakhalifa' },
                    { title: '?ui-image', description: 'ui-image <cantidad> este es invisible', id: 'kulos' },
                ]
            },
            {
                title: 'ᐢ..ᐢDESCARGASᐢ..ᐢ',
                highlight_label: 'Chocoplus',
                rows: [
                    { title: 'Ya se agregaran mas cosas', description: 'null', id: 'noze' },
                    { title: '?tt', description: 'tt + link de tiktok', id: 'miakhalifa' },
                    { title: '?play', description: 'play + nombre de la cancion', id: 'kulos' },
                ]
            },
        ];

        const listMessage = { 
            title: 'kkkk travazap', 
            sections 
        };

        const caption = Ehztext("Chococryspi") + "\n" +
            `> Hola, *${pushname}*!\n` + 
            `> Sistiema *${deviceType}*\n` +
            `> Fecha actual: *${fecha}*\n` +
            `> Verison: *3.0.0*\n` +
            `> Libreria: *Baron-Baileys-v2*\n` +
            `> Hora Actual: *${hora}*\n` ;

        const json = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: crypto.randomBytes(32)
                    },

                    buttonsMessage: {
                        contentText: caption,
                        text: "By Baron",
                        footerText: Ehztext("© Chocoplus-Bot"),
                        imageMessage: mediaImage,
                        buttons: [
                            {
                                buttonId: "listmenu",
                                buttonText: { displayText: "List Menu" },
                                type: "RESPONSE",
                                nativeFlowInfo: {
                                    name: "single_select",
                                    paramsJson: JSON.stringify(listMessage)
                                }
                            },
                        ],
                        headerType: 4,
                        header: "imageMessage"
                    }
                }
            }
        };

        // Convertimos y enviamos como hizo Baron
        const protoMsg = generateWAMessageFromContent(from, proto.Message.fromObject(json), {
            userJid: from
        });

        await conn.relayMessage(from, protoMsg.message, { messageId: protoMsg.key.id });
    }
};
