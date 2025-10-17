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
    let menuText = `> Ꮺׄ ㅤდㅤ   *ꪱׁׁׁׅׅׅtׁׅׅ꯱υׁׅƙׁׅꪱׁׁׁׅׅׅ* ㅤ 𖹭𑩙
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
    menuText += `‐ ダ ძᥱsіg᥏ᥱძ ᑲᥡ  :  *ׅׅ꯱hׁׁׅׅ֮֮ꪱׁׁׁׅׅׅꭈׁׅᨵׁׅׅƙׁׅᨵׁׅׅ ժׁׅ݊ꫀׁׁׅܻׅ݊᥎ׁׅׅ꯱* ギ
‐ ダ mᥲძᥱ ᑲᥡ  :  *ᥣׁׅ֪ꫀׁׅܻ݊ᨵׁׅׅ ᥊ׁׅzׁׅ֬zׁׅׅ֬꯱ᨮׁׅ֮* ギ`

    // Reacción emoji
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Imagen del menú
    let menuUrl = 'https://files.catbox.moe/b10cv6.jpg'

    // 🌷 Lista con formato alternativo
    let rows = [
      { title: '🧋 Canal Oficial', description: 'Únete a nuestro canal', rowId: '.canal' },
      { title: '🪷 Donar', description: 'Apoya el desarrollo', rowId: '.donar' },
      { title: 'ℹ️ Información', description: 'Info del bot', rowId: '.info' },
      { title: '👥 Grupo', description: 'Únete a la comunidad', rowId: '.grupo' },
      { title: '💬 Soporte', description: 'Obtén ayuda', rowId: '.soporte' }
    ]

    await conn.sendList(
      m.chat,
      menuText,
      '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎 - 𝐀𝐈 🌸',
      '🔽 Ver Opciones',
      rows,
      m
    )

  } catch (e) {
    console.error(e)
    // Fallback con imagen
    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/b10cv6.jpg' },
      caption: menuText + `\n\n🌸 *OPCIONES DISPONIBLES*\n\n🧋 .canal - Canal oficial\n🪷 .donar - Apoyar al bot\nℹ️ .info - Información\n👥 .grupo - Comunidad\n💬 .soporte - Ayuda`,
      footer: '🌸 Escribe el comando para acceder'
    }, { quoted: m })
  }
}

handler.help = ['menu', 'menunakano', 'help', 'menuitsuki']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

export default handler