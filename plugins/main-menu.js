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
    let menuText = `🌸 *ITSUNI NAKANO AI* 🌸

`

    let categories = {
      'PRINCIPAL': ['main', 'info'],
      'ASISTENTES': ['bots', 'ia'],
      'JUEGOS': ['game', 'gacha'],
      'ECONOMÍA': ['economy', 'rpgnk'],
      'GRUPOS': ['group'],
      'DESCARGAS': ['downloader'],
      'MULTIMEDIA': ['sticker', 'audio', 'anime'],
      'HERRAMIENTAS': ['tools', 'search', 'advanced'],
      'EXTRAS': ['fun', 'premium', 'social', 'custom']
    }

    for (let catName in categories) {
      let catTags = categories[catName]
      let comandos = help.filter(menu => menu.tags.some(tag => catTags.includes(tag)))

      if (comandos.length) {
        menuText += `┌─「 ${catName} 」\n`
        let uniqueCommands = [...new Set(comandos.flatMap(menu => menu.help))].slice(0, 5)
        uniqueCommands.forEach(cmd => {
          menuText += `│ • ${_p}${cmd}\n`
        })
        menuText += `└───────\n\n`
      }
    }

    // Créditos finales
    menuText += `✨ *Creado por:* BrayanOFC\n🌸 *Adaptación:* Itsuki Nakano AI`

    // Reacción emoji
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Envío del menú con botones actualizados
    await conn.sendMessage(m.chat, {
      text: menuText,
      footer: '🌺 Selecciona una opción',
      title: '🌸 MENÚ PRINCIPAL 🌸',
      buttonText: 'VER OPCIONES',
      sections: [
        {
          title: '🔗 ENLACES RÁPIDOS',
          rows: [
            {
              title: '🪷 DONAR POR PAYPAL',
              description: 'Apoya el desarrollo del bot',
              rowId: `.donar`
            },
            {
              title: '🧋 UNIRSE AL CANAL', 
              description: 'Canal oficial de actualizaciones',
              rowId: `.canal`
            },
            {
              title: '📱 SEGUIR EN INSTAGRAM',
              description: 'Síguenos en redes sociales',
              rowId: `.redes`
            },
            {
              title: '👨‍💻 CONTACTAR AL CREADOR',
              description: 'Habla directamente con el desarrollador',
              rowId: `.owner`
            }
          ]
        }
      ]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `🌸 *ITSUNI NAKANO AI*\n\n${menuText}\n\n🪷 *Donar:* https://paypal.me/Erenxs01\n🧋 *Canal:* https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z` 
    }, { quoted: m })
  }
}

// Comandos para los botones
handler.donar = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '🪷 *DONAR AL PROYECTO*\n\nPuedes apoyar el desarrollo del bot mediante PayPal:\n\n*Enlace directo:* https://paypal.me/Erenxs01\n\n¡Tu apoyo es muy apreciado! 🌸',
    templateButtons: [{
      urlButton: {
        displayText: '💰 DONAR AHORA',
        url: 'https://paypal.me/Erenxs01'
      }
    }]
  }, { quoted: m })
}

handler.canal = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '🧋 *CANAL OFICIAL*\n\nÚnete a nuestro canal para recibir actualizaciones y novedades:\n\n*Enlace directo:* https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z',
    templateButtons: [{
      urlButton: {
        displayText: '📱 UNIRME AL CANAL',
        url: 'https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z'
      }
    }]
  }, { quoted: m })
}

handler.redes = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '📱 *REDES SOCIALES*\n\nSíguenos en nuestras redes para más contenido:\n\n*Instagram:* @usuario\n*Twitter:* @usuario\n\n¡Conecta con nosotros! 🌸'
  }, { quoted: m })
}

handler.owner = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '👨‍💻 *CONTACTO DEL CREADOR*\n\n*Nombre:* BrayanOFC\n*WhatsApp:* https://wa.me/1234567890\n\n📩 Puedes contactarme para:\n• Soporte técnico\n• Colaboraciones\n• Reportar errores\n• Sugerencias\n\n¡Estoy aquí para ayudarte! ✨'
  }, { quoted: m })
}

handler.help = ['menu', 'menunakano', 'help', 'menuitsuki']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

export default handler