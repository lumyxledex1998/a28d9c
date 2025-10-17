// * * * Creador del código: BrayanOFC
// * * * Adaptación: Itsuki Nakano AI
// * * * Base: Sunaookami Shiroko (S.D.D) Ltc.

import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}
    let user = global.db.data.users[m.sender] || { exp: 0, level: 1, premium: false }

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : plugin.help ? [plugin.help] : [],
        tags: Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : [],
      }))

    // 🌸 Decoración intacta
    let menuText = `> Ꮺׄ ㅤდㅤ   *ꪱׁׁׁׅׅׅtׁׅׅ꯱υׁׅƙׁׅꪱׁׁׁׅׅׅ* ㅤ 𖹭𑩙
> ୨ㅤ   ֵ      *݊ꪀɑׁׅƙׁׅɑׁׅ݊ꪀᨵׁׅׅ* ㅤ ׄㅤ  ✰

`

    let categories = {
      '*PRINCIPAL*': ['main', 'info'],
      '*ASISTENTES*': ['bots', 'ia'],
      '*JUEGOS*': ['game', 'gacha'],
      '*ECONOMÍA*': ['economy', 'rpgnk'],
      '*GRUPOS*': ['group'],
      '*DESCARGAS*': ['downloader'],
      '*MULTIMEDIA*': ['sticker', 'audio', 'anime'],
      '*HERRAMIENTAS*': ['tools', 'search', 'advanced'],
      '*EXTRAS*': ['fun', 'premium', 'social', 'custom']
    }

    for (let catName in categories) {
      let catTags = categories[catName]
      let comandos = help.filter(menu => menu.tags.some(tag => catTags.includes(tag)))

      if (comandos.length) {
        menuText += `꒰⌢ ʚ˚₊‧  ❍  ꒱꒱ :: ${catName} ıllı\n`
        let uniqueCommands = [...new Set(comandos.flatMap(menu => menu.help))]
        uniqueCommands.forEach(cmd => {
          menuText += `> ੭੭ ﹙ ᰔᩚ ᪶ ﹚:: \`\`\`${_p}${cmd}\`\`\`\n`
        })
        menuText += `> 。°。°。°。°。°。°。°。°。°。°。°\n\n`
      }
    }

    // Créditos finales
    menuText += `‐ ダ ძᥱsіg᥏ᥱძ ᑲᥡ  :  *ׅׅ꯱hׁׁׅׅ֮֮ꪱׁׁׁׅׅׅꭈׁׅᨵׁׅׅƙׁׅᨵׁׅׅ ժׁׅ݊ꫀׁׁׅܻׅ݊᥎ׁׅׅ꯱* ギ
‐ ダ mᥲძᥱ ᑲᥡ  :  *ᥣׁׅ֪ꫀׁׅܻ݊ᨵׁׅׅ ᥊ׁׅzׁׅ֬zׁׅׅ֬꯱ᨮׁׅ֮* ギ`

    // Reacción emoji
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Imagen del menú
    let menuUrl = 'https://files.catbox.moe/b10cv6.jpg'

    // 🌷 Envío del menú con botones actualizados y funcionales
    await conn.sendMessage(
      m.chat,
      {
        image: { url: menuUrl },
        caption: menuText,
        footer: '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎 - 𝐀𝐈 🌸',
        buttons: [
          {
            buttonId: `${_p}allmenu`,
            buttonText: { displayText: '📖 MENÚ COMPLETO' },
            type: 1
          },
          {
            buttonId: `${_p}owner`,
            buttonText: { displayText: '👑 CREADOR' },
            type: 1
          },
          {
            buttonId: `${_p}donar`,
            buttonText: { displayText: '💰 DONAR' },
            type: 1
          },
          {
            buttonId: `${_p}grupos`,
            buttonText: { displayText: '👥 GRUPOS' },
            type: 1
          }
        ],
        headerType: 4
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `❌ Error en el menú: ${e.message}\n\n⚠️ Intentando método alternativo...` 
    }, { quoted: m })
    
    // Método alternativo si falla el principal
    try {
      await conn.sendFile(m.chat, menuUrl, 'menu.jpg', menuText, m)
    } catch (e2) {
      await conn.sendMessage(m.chat, { 
        text: `📖 *MENÚ ITSUKI NAKANO AI*\n\n${menuText}\n\n🌸 *Bot activo y funcionando*` 
      }, { quoted: m })
    }
  }
}

handler.help = ['menu', 'menunakano', 'help', 'menuitsuki']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

export default handler