//Creador del menu: BrayanOFC y adaptado para Itsuki Nakano IA 

import fetch from 'node-fetch'

const botname = global.botname || '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸'
const creador = '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡'
const version = '4.3.1'
const web = 'https://xzys-ultra.vercel.app'  

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
    }))

    let uptime = clockString(process.uptime() * 1000)

    const botJid = conn.user.jid
    const officialBotNumber = '50578440363@s.whatsapp.net'
    const isOfficialBot = botJid === officialBotNumber

    
    let menuText = `┏━━ ⸙ ✨ *ITSUKI NAKANO AI* ✨ ⸙
┃ 👤 Usuario: @${userId.split('@')[0]}
┃ ⏰ Activo: ${uptime}
┃ 💎 Premium: ${totalPremium}
┃ 📌 V${version}
┗━━━━━━━━━━━━━━━━━━━⬣

`

    
    let categories = {
      '⚙️ *PRINCIPAL*': ['main', 'info'],
      '🤖 *BOTS & IA*': ['bots', 'ia'],
      '🎮 *JUEGOS & RPG*': ['game', 'rpgnk', 'gacha'],
      '💰 *ECONOMÍA*': ['economy'],
      '👥 *GRUPOS*': ['group'],
      '📥 *DESCARGAS*': ['downloader'],
      '🎨 *MULTIMEDIA*': ['sticker', 'audio', 'anime'],
      '🔧 *HERRAMIENTAS*': ['tools', 'search', 'advanced'],
      '✨ *EXTRAS*': ['fun', 'premium', 'social', 'custom']
    }

    for (let catName in categories) {
      let catTags = categories[catName]
      let comandos = help.filter(menu => menu.tags.some(tag => catTags.includes(tag)))
      
      if (comandos.length) {
        menuText += `${catName}\n`
        let uniqueCommands = [...new Set(comandos.flatMap(menu => menu.help))]
        uniqueCommands.slice(0, 8).forEach(cmd => {
          menuText += `  ◦ ${_p}${cmd}\n`
        })
        menuText += `\n`
      }
    }

    menuText += `┏━━━━━━━━━━━━━━━━━━━⬣
┃ 💻 ${web}
┃ 👑 By: ${creador}
┗━━━━━━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    
    let imgUrl = 'https://files.catbox.moe/b10cv6.jpg' // Cambia por tu imagen
    
    await conn.sendMessage(
      m.chat,
      {
        image: { url: imgUrl },
        caption: menuText,
        mentions: [userId]
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ Error: ${e.message}` }, { quoted: m })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}