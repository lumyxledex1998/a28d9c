// * * * Creador del código: BrayanOFC
// * * * Adaptación: Itsuki Nakano AI
// * * * Base: Sunaookami Shiroko (S.D.D) Ltc.

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : plugin.help ? [plugin.help] : [],
        tags: Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : [],
      }))

    // 🌸 Decoración intacta
    let menuText = `> Ꮺׄ ㅤდㅤ   *ɪᴛsᴜᴋɪ* ㅤ 𖹭𑩙
> ୨ㅤ   ֵ      *݊ɴᴀᴋᴀɴᴏV2* ㅤ ׄㅤ  ꨄ︎

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
        menuText += `꒰⌢ ʚ˚₊‧  ✎  ꒱꒱ 🌱 ${catName} ıllı\n`
        let uniqueCommands = [...new Set(comandos.flatMap(menu => menu.help))]
        uniqueCommands.forEach(cmd => {
          menuText += `> ੭੭ ﹙ ✎ ﹚🌱 \`\`\`${_p}${cmd}\`\`\`\n`
        })
        menuText += `> 。°。°。°。°。°。°。°。°。°。°。°\n\n`
      }
    }

    // Créditos finales
    menuText += `‐ ダ ძᥱsіg᥏ᥱძ ᑲᥡ sʜɪʀᴏᴋᴏ ᴅᴇᴠs ✨
‐ ダ mᥲძᥱ ᑲᥡ ʟᴇᴏ xᴢᴢsʏ ᴏғᴄ 👑`

    // Reacción emoji
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Imagen del menú
    let menuUrl = 'https://files.catbox.moe/b10cv6.jpg'

    // 🌷 Botones con quickReply que envían los links automáticamente
    let buttons = [
      { 
        buttonId: `canal_${Date.now()}`, 
        buttonText: { displayText: '🧋 Canal Oficial' }, 
        type: 1 
      },
      { 
        buttonId: `donar_${Date.now()}`, 
        buttonText: { displayText: '🪷 Donar' }, 
        type: 1 
      }
    ]

    let buttonMessage = {
      image: { url: menuUrl },
      caption: menuText,
      footer: '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎 - 𝐀𝐈 🌸',
      buttons: buttons,
      headerType: 4
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `❌ Error en el menú: ${e.message}` 
    }, { quoted: m })
  }
}

handler.help = ['menu', 'menunakano', 'help', 'menuitsuki']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

// 🌷 Handler para detectar los botones presionados
handler.before = async function (m, { conn }) {
  if (!m.message) return
  
  const buttonResponse = m.message.buttonsResponseMessage?.selectedButtonId
  
  if (buttonResponse && buttonResponse.startsWith('canal_')) {
    await conn.sendMessage(m.chat, {
      text: `🧋 *CANAL OFICIAL*

👉 https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z

> ¡Únete ahora! 🌸`
    }, { quoted: m })
    return true
  }
  
  if (buttonResponse && buttonResponse.startsWith('donar_')) {
    await conn.sendMessage(m.chat, {
      text: `🪷 *DONACIONES*

👉 https://paypal.me/Erenxs01

> ¡Gracias por tu apoyo! 💖`
    }, { quoted: m })
    return true
  }
}

export default handler