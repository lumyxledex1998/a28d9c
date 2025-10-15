//Creador del menu: BrayanOFC y adaptado para Itsuki Nakano IA 

import fetch from 'node-fetch'

const botname = global.botname || '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸'
const creador = '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡'
const version = '`4.3.1 Versión Oficial`'
const web = 'https://xzys-ultra.vercel.app'  

// 🎲 Separadores aleatorios
const separators = [
  "╭━━━━━━━━━━━━━━━━━━━━╮", "╰━━━━━━━━━━━━━━━━━━━━╯",
  "━━━━━━━━━━━━━━━━━━━━━━", "──────────────────────",
  "◆━━━━━━━━━━━━━━━━━━◆", "▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭", 
  "✦━━━━━━━━━━━━━━✦", "┈┈┈┈┈┈┈┈┈┈┈",
  "◈━━━━━━━━━━━━━━◈"
]

let tags = {
  'serbot': 'SUB-BOTS',
  'info': 'INFO',
  'main': 'MENÚ',
  'nable': 'MODO AVANZADO',
  'cmd': 'COMANDOS',
  'advanced': 'FUNCIONES',
  'game': 'JUEGOS',
  'economy': 'ECONOMÍA',
  'gacha': 'GACHA',
  'rpgnk': 'RPG-NK',
  'group': 'GRUPOS',
  'downloader': 'DESCARGAS',
  'sticker': 'STICKER',
  'audio': 'AUDIO',
  'search': 'BÚSQUEDA',
  'tools': 'HERRAMIENTAS',
  'fun': 'DIVERSIÓN',
  'ia': 'IA',
  'anime': 'ANIME',
  'premium': 'PREMIUM',
  'social': 'REDES',
  'custom': 'PERSONAL'
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

    const botJid = conn.user.jid
    const officialBotNumber = '18292605400@s.whatsapp.net'

    let name = conn.getName(m.sender) || 'Usuario'
    let taguser = '@' + m.sender.split('@')[0]
    
    const isOfficialBot = botJid === officialBotNumber
    const botType = isOfficialBot ? 'Bot Oficial: Itsuki Nakano 🌟' : 'Sub-Bot en ejecución 🌿'

    // 🎲 Encabezado random
    let sepHeadTop = separators[Math.floor(Math.random() * separators.length)]
    let sepHeadBottom = separators[Math.floor(Math.random() * separators.length)]

    let menuText = `
${sepHeadTop}
👋 Hola ${taguser}
Creador: ${creador}
${botType}
Uptime: ${uptime}
Premium activos: ${totalPremium}
Versión: ${version}
Web Oficial: ${web}
Baileys-Sistem: xzy-Baileys
${sepHeadBottom}
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      // 🎲 Separadores aleatorios por sección
      let sepTop = separators[Math.floor(Math.random() * separators.length)]
      let sepBottom = separators[Math.floor(Math.random() * separators.length)]

      menuText += `
${sepTop}
 ${tags[tag]}
${comandos.map(menu => menu.help.map(cmd =>
  ` • ${_p}${cmd}${menu.limit ? ' (Límite)' : ''}${menu.premium ? ' (Premium)' : ''}`
).join('\n')).join('\n')}
${sepBottom}
`
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    let vidBuffer = await (await fetch('https://files.catbox.moe/j6hx6k.mp4')).buffer()
    await conn.sendMessage(
      m.chat,
      {
        video: vidBuffer,
        gifPlayback: true,
        caption: menuText,
        contextInfo: {
          mentionedJid: [userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: idchannel, 
            serverMessageId: 100, 
            newsletterName: namechannel 
          }
        }
      },
      { quoted: m }
    )

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