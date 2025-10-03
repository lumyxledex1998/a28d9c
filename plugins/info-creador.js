let handler = async (m, { conn }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    // Enviar mensaje con botones
    await conn.sendMessage(m.chat, {
      text: '🧑‍💻 *INFORMACIÓN DEL CREADOR*\n\nSelecciona una opción:',
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: '📷 Instagram',
            url: 'https://www.instagram.com/xzzys26'
          }
        },
        {
          index: 2,
          urlButton: {
            displayText: '🎵 TikTok',
            url: 'https://www.tiktok.com/@xzzys16'
          }
        },
        {
          index: 3,
          urlButton: {
            displayText: '💬 Grupo WhatsApp',
            url: 'https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA'
          }
        },
        {
          index: 4,
          urlButton: {
            displayText: '📢 Canal WhatsApp',
            url: 'https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z'
          }
        },
        {
          index: 5,
          quickReplyButton: {
            displayText: '📞 Contacto Directo',
            id: '!contacto'
          }
        },
        {
          index: 6,
          quickReplyButton: {
            displayText: '🤖 Info del Bot',
            id: '!bot'
          }
        }
      ],
      ...global.rcanalden2
    }, { quoted: m })

    // También enviar contacto
    await conn.sendContact(m.chat, [
      {
        displayName: '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡\nORG:Desarrollador de 🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸;\nTEL;type=CELL;type=VOICE;waid=18493907272:+18493907272\nEND:VCARD`
      }
    ], m, { ...global.rcanalden2 })

    // Log en consola
    console.log(`📱 INFO CREADOR SOLICITADO: ${m.sender}`)

  } catch (error) {
    console.error('❌ Error en info creador:', error)
    
    // Mensaje de respaldo simple
    await conn.reply(m.chat, 
      `🧑‍💻 *CONTACTO DEL CREADOR*\n\n` +
      `👑 *Creador:* 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡\n` +
      `📞 *WhatsApp:* https://wa.me/18493907272\n` +
      `📷 *Instagram:* https://www.instagram.com/xzzys26\n` +
      `🎵 *TikTok:* https://www.tiktok.com/@xzzys16\n` +
      `💬 *Grupo:* https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA\n` +
      `📢 *Canal:* https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z`,
      m, ctxOk
    )
  }
}

handler.help = ['owner', 'creador', 'creator', 'desarrollador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'creator', 'desarrollador', 'contacto']

export default handler