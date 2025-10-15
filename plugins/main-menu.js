//Creador del menu: BrayanOFC y adaptado para Itsuki Nakano IA 

import fetch from 'node-fetch'

const botname = global.botname || '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸'
const creador = '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡'
const version = '4.3.1'
const web = 'https://xzys-ultra.vercel.app'  

let tags = {
  'serbot': '❤️‍🩹 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦',
  'info': '🌸 𝗜𝗡𝗙𝗢𝗦',
  'main': '📜 𝗠𝗘𝗡𝗨',
  'nable': '🔮 𝗠𝗢𝗗𝗢 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗢',
  'cmd': '📝 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
  'advanced': '🌟 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦',
  'game': '🎮 𝗝𝗨𝗘𝗚𝗢𝗦',
  'economy': '✨ 𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔',
  'gacha': '🧧 𝗚𝗔𝗖𝗛𝗔',
  'rpgnk': '⚔️ 𝗥𝗣𝗚-𝗡𝗞',
  'group': '📚 𝗚𝗥𝗨𝗣𝗢𝗦',
  'downloader': '📥 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦',
  'sticker': '🍧 𝗦𝗧𝗜𝗖𝗞𝗘𝗥',
  'audio': '🫧 𝗔𝗨𝗗𝗜𝗢',
  'search': '🔎 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔',
  'tools': '🧰 𝗛𝗘𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦',
  'fun': '💃 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡',
  'ia': '🤖 𝗜𝗔',
  'anime': '🪭 𝗔𝗡𝗜𝗠𝗘',
  'premium': '💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠',
  'social': '📸 𝗥𝗘𝗗𝗘𝗦',
  'custom': '📕 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}

    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId] || { exp: 0, level: 1, premium: false }

    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    // Fake contact para transparencia
    global.fkontak = {
      key: {
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        contactMessage: {
          displayName: creador,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${creador};;;\nFN:${creador}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Móvil\nEND:VCARD`
        }
      }
    }

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let uptime = clockString(process.uptime() * 1000)
    let name = conn.getName(m.sender) || 'Usuario'

    // Crear las secciones del menú list
    let sections = []
    
    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      let rows = comandos.map(menu => menu.help.map(cmd => ({
        title: `${_p}${cmd}`,
        description: `${menu.limit ? '💋 Límite' : ''}${menu.premium ? ' 🙈 Premium' : ''}`,
        id: `${_p}${cmd}`
      }))).flat()

      sections.push({
        title: tags[tag],
        rows: rows
      })
    }

    // Texto del header
    let headerText = `*𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈*
⎯ ༊ ㅤ✧ㅤ *${name}* ㅤ✧ ㅤ༊
⎯ ୨ ✦ *ᥙ⍴𝗍іmᥱ* : ${uptime}
⎯ ୨ ✦ *⍴rᥱmіᥙm* : ${totalPremium}
⎯ ୨ ✦ *᥎ᥱrsі᥆ᥒ* : ${version}

˚₊· ͟͟͞➳❥ *Selecciona una categoría*`

    // Enviar el list message
    let listMessage = {
      text: headerText,
      footer: `⎯ ✦ ⴜ⍺𝖽ᧉ 𝖻ɥ : *${creador}* ✦`,
      title: '⊹ ࣪ ˖🌸 𝐌𝐄𝐍𝐔 𝐈𝐓𝐒𝐔𝐊𝐈 🌸⊹ ࣪ ˖',
      buttonText: "✨ 𝗩𝗘𝗥 𝗠𝗘𝗡𝗨 ✨",
      sections: sections
    }

    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Enviar con imagen
    await conn.sendMessage(m.chat, listMessage, {
      quoted: fkontak,
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: 'By ' + creador,
          thumbnailUrl: 'https://qu.ax/GJBXU.jpg',
          sourceUrl: web,
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: false
        }
      }
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ Error en el menú:\n${e}` }, { quoted: m })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']
export default handler

function clockString(ms) {
  let d = Math.floor(ms / 86400000) 
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  let texto = []
  if (d > 0) texto.push(`${d}d`)
  if (h > 0) texto.push(`${h}h`)
  if (m > 0) texto.push(`${m}m`)
  if (s > 0) texto.push(`${s}s`)
  return texto.length ? texto.join(' ') : '0s'
}