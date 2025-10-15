//Creador del menu: BrayanOFC y adaptado para Itsuki Nakano IA
//Rediseñado por: Itsuki-Kawaii-Decorator v1.0

import fetch from 'node-fetch'

const botname = global.botname || '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸'
const creador = '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡'
const version = '`4.3.1 Versión Oficial`'
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
  'tools': '🧰 𝗛𝗘𝗥𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦',
  'fun': '💃 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡',
  'ia': '🤖 𝗜𝗔',
  'anime': '🪭 𝗔𝗡𝗜𝗠𝗘',
  'premium': '💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠',
  'social': '📸 𝗥𝗘𝗗𝗘𝗦',
  'custom': '📕 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟'
}

// ====== Listas de decoraciones (más de 40 elementos combinados) ======
const TOP_DECORS = [
  '🌸', '✦', '🍥', '☆彡', '𖦹', '💮', '🧋', '💌', '🌷', '🍡',
  '🏮', '⛩️', '桜', '御', '夢', '狐', '神', '✿', '♡', '💫'
]

const MID_PHRASES = [
  '「Itsuki te saluda con onigiris」', '¡Hora de brillar! ✨',
  'Cargando energía kawaii...', '¡A por aventuras! 🏮',
  'Itsuki dice: ¡no te rindas! 🍙', 'Modo: かわいい (kawaii)',
  'Suenan tambores de festival 🎏', 'Con amor y onigiri ♡',
  'フワフワ夢見る (sueños suaves)', 'Sabor: Onigiri premium'
]

const SIDE_DECORS = [
  '✧', '✿', '❀', '✪', '❖', '⚡', '🌟', '🩵', '🧸', '🫧',
  '🍬', '🍭', '🥟', '🫐', '🎀', '🪄', '🧧', '🎐', '🕊️', '📯'
]

const SEPARATORS = [
  '╭━━━〔', '╭─❀﹏❀─╮', '✦━━〔', '★彡━━〔', '⌬━━〔',
  '🌸彡━━〔', '⭑━━━━〔', '🪷━━〔', '🍥━━〔', '🧋━━〔'
]

const FOOTERS = [
  '╰━━━━━━━━━━━━━━━━━━━━━━⬣', '╰───✦･ﾟ:*:･ﾟ✧───╯', '╰☆彡━━━━━━★╯',
  '╰❀✿❀✿❀✿❀╯', '╰･ﾟ✧*:･ﾟ✧･ﾟ╯'
]

// ====== Helpers ======
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pickN(arr, n) {
  let out = []
  for (let i = 0; i < n; i++) out.push(rand(arr))
  return out
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}

    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId] || { exp: 0, level: 1, premium: false }

    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let date = new Date()
    let time = date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })

    let uptime = clockString(process.uptime() * 1000)

    // Detectar automáticamente si es bot oficial o sub-bot
    const botJid = conn.user?.jid || ''
    const officialBotNumber = '18292605400@s.whatsapp.net' // REEMPLAZA CON EL NÚMERO DEL BOT OFICIAL

    let name = conn.getName ? conn.getName(m.sender) : 'Usuario'
    let taguser = '@' + m.sender.split('@')[0]

    const isOfficialBot = botJid === officialBotNumber
    const botType = isOfficialBot
      ? '🎀 𝗕𝗼𝘁 𝗢𝗳𝗶𝗰𝗶𝗮𝗹: 𝗜𝘁𝘀𝘂𝗸𝗶 𝗡𝗮𝗸𝗮𝗻𝗼 𝗢𝗳𝗶𝗰𝗶𝗮𝗹 🌟'
      : '🌱 𝗦𝘂𝗯-𝗕𝗼𝘁: 𝗜𝘁𝘀𝘂𝗸𝗶 𝗦𝘁𝘆𝗹𝗲 (No Oficial) 🌟'

    // ==== Construcción dinámica del header con decoraciones aleatorias ====
    const topLeft = rand(TOP_DECORS)
    const topRight = rand(TOP_DECORS)
    const topPhrase = rand(MID_PHRASES)
    const openingLine = `『 ${topLeft} Opening: Itsuki Nakano System ${version} ${topRight} 』`

    let menuText = ''
    menuText += `${rand(SEPARATORS)} ${botname} ${rand(SEPARATORS)}\n`
    menuText += `${topLeft.repeat(2)} ${openingLine} ${topRight.repeat(2)}\n`
    menuText += `${rand(SIDE_DECORS)} ${topPhrase} ${rand(SIDE_DECORS)}\n\n`

    menuText += `╭━━━〔 🌸 *ITSUKI NAKANO-AI MENU* 🌸 〕━━━⬣\n`
    menuText += `┃ ${rand(SIDE_DECORS)} *Hola* ${taguser} ✨\n`
    menuText += `┃ ${rand(SIDE_DECORS)} *Creador*: *${creador}*\n`
    menuText += `┃ ${rand(SIDE_DECORS)} ${botType}\n`
    menuText += `┃ ${rand(SIDE_DECORS)} ⏳️ *Uptime*: *${uptime}*\n`
    menuText += `┃ ${rand(SIDE_DECORS)} 💎 *Premium*: *${totalPremium}*\n`
    menuText += `┃ ${rand(SIDE_DECORS)} 🪷 *Versión*: *${version}*\n`
    menuText += `┃ ${rand(SIDE_DECORS)} 💻 *Web Oficial*: *${web}*\n`
    menuText += `┃ ${rand(SIDE_DECORS)} 🔰 *Baileys-Sistem*: *xzy-Baileys*\n`
    menuText += `${rand(FOOTERS)}\n\n`

    // ==== Por cada tag, usar separadores aleatorios y frases Itsuki en el header de sección ====
    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      const sep = rand(SEPARATORS)
      const side = rand(SIDE_DECORS)
      const fluff = rand(MID_PHRASES)

      menuText += `${sep} ${tags[tag]} ${sep}\n`
      menuText += `┃ ${side} ${fluff}\n`

      menuText += comandos.map(menu =>
        menu.help.map(cmd =>
          `┃ ${rand(SIDE_DECORS)} ${_p}${cmd}${menu.limit ? ' 💋' : ''}${menu.premium ? ' 🙈' : ''}`
        ).join('\n')
      ).join('\n') + '\n'

      menuText += `${rand(FOOTERS)}\n\n`
    }

    // ==== Pie decorativo extra con símbolos japoneses y frases Itsuki ====
    const footerDecs = pickN([...TOP_DECORS, ...SIDE_DECORS, ...['桜', '御', '夢', '狐', '神', '⛩️']], 6).join(' ')
    menuText += `✦･ﾟ:*:･ﾟ✧ ${footerDecs} ✧*:･ﾟ:*:･ﾟ✦\n`
    menuText += `🍙 Itsuki: "Si sigues usando el menú, ¡habrá onigiris!" 🍙\n`
    menuText += `╭─❀﹏❀─╮ 𝙈𝙞𝙣𝙞 𝙊𝙥𝙚𝙣𝙞𝙣𝙜: ${time} ╭─❀﹏❀─╮\n`
    menuText += `╰───✦･ﾟ:*:･ﾟ✧───╯\n`

    // Reacción bonita antes de enviar
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Video/gif de presentación (se usa el buffer como antes)
    let vidBuffer
    try {
      vidBuffer = await (await fetch('https://files.catbox.moe/j6hx6k.mp4')).buffer()
    } catch (err) {
      // Si falla el fetch, enviamos solo texto (evitamos romper todo)
      vidBuffer = null
    }

    const msgPayload = {
      caption: menuText,
      contextInfo: {
        mentionedJid: [userId],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: typeof idchannel !== 'undefined' ? idchannel : null,
          serverMessageId: 100,
          newsletterName: typeof namechannel !== 'undefined' ? namechannel : null
        }
      }
    }

    if (vidBuffer) {
      await conn.sendMessage(
        m.chat,
        {
          video: vidBuffer,
          gifPlayback: true,
          ...msgPayload
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(m.chat, { text: menuText, ...msgPayload }, { quoted: m })
    }

  } catch (e) {
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
  if (d > 0) texto.push(`${d} ${d == 1 ? 'día' : 'días'}`)
  if (h > 0) texto.push(`${h} ${h == 1 ? 'hora' : 'horas'}`)
  if (m > 0) texto.push(`${m} ${m == 1 ? 'minuto' : 'minutos'}`)
  if (s > 0) texto.push(`${s} ${s == 1 ? 'segundo' : 'segundos'}`)
  return texto.length ? texto.join(', ') : '0 segundos'
}