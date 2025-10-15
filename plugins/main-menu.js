// Menu lista Itsuki Nakano - Estilo Exclusivo
import fetch from 'node-fetch'

const botname = global.botname || '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸'
const creador = '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡'
const version = '4.3.1'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let name = conn.getName(m.sender) || '꯱υׁׅ݊ꪀɑׁׅᨵׁׅׅᨵׁׅׅƙׁׅɑׁׅꩇׁׅ֪݊ ꪱׁׁׁׅׅׅ'
    let uptime = clockString(process.uptime() * 1000)
    
    // Secciones del menú con decoración exclusiva
    let sections = [
      {
        title: '♡₊˚ 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢𝗡 𝗬 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 ♡₊˚',
        rows: [
          { title: '📜 𝗠𝗘𝗡𝗨 𝗣𝗥𝗜𝗡𝗖𝗜𝗣𝗔𝗟', description: 'Ver todos los comandos', rowId: `${_p}menu` },
          { title: '👑 𝗗𝗘𝗦𝗔𝗥𝗥𝗢𝗟𝗟𝗔𝗗𝗢𝗥', description: 'Información del creador', rowId: `${_p}developer` },
          { title: '📊 𝗘𝗦𝗧𝗔𝗗𝗢', description: 'Estado del sistema', rowId: `${_p}status` },
          { title: '🚨 𝗥𝗘𝗣𝗢𝗥𝗧𝗘', description: 'Reportar problemas', rowId: `${_p}report` }
        ]
      },
      {
        title: '♡₊˚ 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦 𝗬 𝗦𝗘𝗦𝗜𝗢𝗡𝗘𝗦 ♡₊˚',
        rows: [
          { title: '🤖 𝗦𝗘𝗥 𝗕𝗢𝗧', description: 'Activar modo sub-bot', rowId: `${_p}serbot` },
          { title: '🔄 𝗖𝗢𝗗𝗜𝗚𝗢', description: 'Obtener código sesión', rowId: `${_p}code` },
          { title: '❌ 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗥', description: 'Eliminar sub-bot', rowId: `${_p}deletebot` },
          { title: '⏹️ 𝗣𝗔𝗥𝗔𝗥', description: 'Detener sesión', rowId: `${_p}stop` }
        ]
      },
      {
        title: '♡₊˚ 𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔 𝗬 𝗥𝗣𝗚 ♡₊˚',
        rows: [
          { title: '💰 𝗕𝗔𝗟𝗔𝗡𝗖𝗘', description: 'Ver tu dinero', rowId: `${_p}bal` },
          { title: '⚔️ 𝗔𝗩𝗘𝗡𝗧𝗨𝗥𝗔', description: 'Ir de aventura', rowId: `${_p}adventure` },
          { title: '💼 𝗧𝗥𝗔𝗕𝗔𝗝𝗔𝗥', description: 'Trabajar por dinero', rowId: `${_p}work` },
          { title: '🎁 𝗗𝗜𝗔𝗥𝗜𝗢', description: 'Reclamar daily', rowId: `${_p}daily` }
        ]
      },
      {
        title: '♡₊˚ 𝗛𝗘𝗥𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦 𝗨𝗧𝗜𝗟𝗘𝗦 ♡₊˚',
        rows: [
          { title: '🔊 𝗧𝗧𝗦', description: 'Texto a voz', rowId: `${_p}tts` },
          { title: '🔗 𝗔𝗖𝗢𝗥𝗧𝗔𝗥', description: 'Acortar enlaces', rowId: `${_p}acortar` },
          { title: '🧮 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗗𝗢𝗥𝗔', description: 'Hacer cálculos', rowId: `${_p}calc` },
          { title: '📱 𝗖𝗢𝗡𝗦𝗘𝗝𝗢', description: 'Consejo del día', rowId: `${_p}consejo` }
        ]
      },
      {
        title: '♡₊˚ 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔𝗦 𝗬 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 ♡₊˚',
        rows: [
          { title: '🖼️ 𝗜𝗠𝗔𝗚𝗘𝗡', description: 'Buscar imágenes', rowId: `${_p}imagen` },
          { title: '📥 𝗬𝗢𝗨𝗧𝗨𝗕𝗘', description: 'Descargar videos', rowId: `${_p}play` },
          { title: '🎵 𝗬𝗧𝗠𝗣𝟯', description: 'Audio de YouTube', rowId: `${_p}ytmp3` },
          { title: '📹 𝗧𝗜𝗞𝗧𝗢𝗞', description: 'Descargar TikTok', rowId: `${_p}tiktok` }
        ]
      },
      {
        title: '♡₊˚ 𝗠𝗨𝗟𝗧𝗜𝗠𝗘𝗗𝗜𝗔 𝗬 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥𝗘𝗦 ♡₊˚',
        rows: [
          { title: '🖼️ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥', description: 'Crear stickers', rowId: `${_p}sticker` },
          { title: '🎵 𝗔 𝗠𝗣𝟯', description: 'Convertir a audio', rowId: `${_p}tomp3` },
          { title: '🔄 𝗔 𝗜𝗠𝗚', description: 'Sticker a imagen', rowId: `${_p}toimg` },
          { title: '🎞️ 𝗔 𝗩𝗜𝗗𝗘𝗢', description: 'Convertir a video', rowId: `${_p}tomp4` }
        ]
      },
      {
        title: '♡₊˚ 𝗘𝗙𝗘𝗖𝗧𝗢𝗦 𝗗𝗘 𝗔𝗨𝗗𝗜𝗢 ♡₊˚',
        rows: [
          { title: '🎵 𝗕𝗔𝗦𝗦', description: 'Efecto bass', rowId: `${_p}bass` },
          { title: '🌀 𝗡𝗜𝗚𝗛𝗧𝗖𝗢𝗥𝗘', description: 'Efecto nightcore', rowId: `${_p}nightcore` },
          { title: '🐢 𝗦𝗟𝗢𝗪', description: 'Cámara lenta', rowId: `${_p}slow` },
          { title: '⚡ 𝗙𝗔𝗦𝗧', description: 'Velocidad rápida', rowId: `${_p}fast` }
        ]
      },
      {
        title: '♡₊˚ 𝗝𝗨𝗘𝗚𝗢𝗦 𝗬 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡 ♡₊˚',
        rows: [
          { title: '🎰 𝗧𝗥𝗔𝗚𝗔𝗠𝗢𝗡𝗘𝗗𝗔𝗦', description: 'Jugar slot', rowId: `${_p}slot` },
          { title: '❓ 𝗩𝗘𝗥𝗗𝗔𝗗', description: 'Verdad o reto', rowId: `${_p}verdad` },
          { title: '🎯 𝗥𝗘𝗧𝗢', description: 'Desafíos', rowId: `${_p}reto` },
          { title: '🏆 𝗧𝗢𝗣', description: 'Ranking global', rowId: `${_p}top` }
        ]
      },
      {
        title: '♡₊˚ 𝗚𝗥𝗨𝗣𝗢𝗦 𝗬 𝗠𝗢𝗗𝗘𝗥𝗔𝗖𝗜𝗢𝗡 ♡₊˚',
        rows: [
          { title: '👥 𝗔𝗚𝗥𝗘𝗚𝗔𝗥', description: 'Añadir usuario', rowId: `${_p}add` },
          { title: '🚫 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗥', description: 'Eliminar usuario', rowId: `${_p}kick` },
          { title: '🏷️ 𝗠𝗘𝗡𝗖𝗜𝗢𝗡𝗔𝗥', description: 'Mencionar todos', rowId: `${_p}hidetag` },
          { title: '⚙️ 𝗖𝗢𝗡𝗙𝗜𝗚', description: 'Configurar grupo', rowId: `${_p}setname` }
        ]
      },
      {
        title: '♡₊˚ 𝗜𝗔 𝗬 𝗔𝗡𝗜𝗠𝗘 ♡₊˚',
        rows: [
          { title: '🤖 𝗖𝗛𝗔𝗧𝗚𝗣𝗧', description: 'Chat con IA', rowId: `${_p}chatgpt` },
          { title: '🎎 𝗔𝗡𝗜𝗠𝗘', description: 'Buscar anime', rowId: `${_p}anime` },
          { title: '🌸 𝗜𝗧𝗦𝗨𝗞𝗜', description: 'Hablar con Itsuki', rowId: `${_p}itsuki` },
          { title: '💝 𝗣𝗜𝗥𝗢𝗣𝗢', description: 'Frases románticas', rowId: `${_p}piropo` }
        ]
      }
    ]

    // Texto principal con decoración única
    let text = `
⛩️┊𝗜𝗧𝗦𝗨𝗞𝗜 𝗡𝗔𝗞𝗔𝗡𝗢 𝗔𝗜
╭───────✦───────╮
│ ୨⎯ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 : ${name}
│ ୨⎯ 𝗧𝗜𝗘𝗠𝗣𝗢 : ${uptime}
│ ୨⎯ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 : ${version}
╰───────✦───────╯

♡₊˚ 𝗦𝗲𝗹𝗲𝗰𝗰𝗶𝗼𝗻𝗮 𝘂𝗻𝗮 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮 𝗱𝗲𝗹 𝗺𝗲𝗻𝘂 ♡₊˚
`

    // Enviar reacción
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Enviar mensaje con lista interactiva
    let listMessage = {
      text: text,
      footer: `♡₊˚ 𝗖𝗿𝗲𝗮𝗱𝗼 𝗽𝗼𝗿: ${creador} ♡₊˚`,
      title: '⛩️ 𝗠𝗘𝗡𝗨 𝗜𝗧𝗦𝗨𝗞𝗜 𝗡𝗔𝗞𝗔𝗡𝗢',
      buttonText: "🎀 𝗩𝗘𝗥 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗔𝗦",
      sections: sections
    }

    // Enviar el list message
    await conn.sendMessage(m.chat, listMessage, {
      quoted: {
        key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: { 
          conversation: '🌸 Itsuki Nakano AI - Menú activado' 
        }
      }
    })

  } catch (e) {
    console.error(e)
    // Fallback en caso de error
    let fallbackText = `
⛩️ 𝗜𝗧𝗦𝗨𝗞𝗜 𝗡𝗔𝗞𝗔𝗡𝗢 𝗔𝗜

Hola *${conn.getName(m.sender)}*! 🌸

⏰ Uptime: ${clockString(process.uptime() * 1000)}
🏷️ Versión: ${version}

𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮𝘀 𝗱𝗶𝘀𝗽𝗼𝗻𝗶𝗯𝗹𝗲𝘀:

• ${_p}menu - Menú principal
• ${_p}menujuegos - Juegos y diversión
• ${_p}menudescargas - Descargas
• ${_p}herramientas - Herramientas útiles
• ${_p}grupomenu - Gestión de grupos
• ${_p}ia - Comandos de IA

👑 Creador: ${creador}
    `
    await conn.sendMessage(m.chat, { text: fallbackText }, { quoted: m })
  }
}

handler.help = ['menu', 'menuitsuki', 'help']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

function clockString(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [d > 0 ? d + 'd' : '', h > 0 ? h + 'h' : '', m > 0 ? m + 'm' : '', s > 0 ? s + 's' : ''].filter(Boolean).join(' ') || '0s'
}

export default handler