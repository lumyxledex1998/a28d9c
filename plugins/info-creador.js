let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      text: '👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*\n\nSelecciona una opción:',
      buttons: [
        { buttonId: '!instagram', buttonText: { displayText: '📷 Instagram' }, type: 1 },
        { buttonId: '!tiktok', buttonText: { displayText: '🎵 TikTok' }, type: 1 },
        { buttonId: '!grupo', buttonText: { displayText: '💬 Grupo' }, type: 1 },
        { buttonId: '!contacto', buttonText: { displayText: '📞 Contacto' }, type: 1 }
      ]
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    // Versión de respaldo simple
    const message = `
👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*

📷 Instagram: instagram.com/xzzys26
🎵 TikTok: tiktok.com/@xzzys16  
💬 Grupo: chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA
📞 Contacto: wa.me/18493907272
    `.trim()
    await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  }
}

// Handlers para los botones
handler.before = async (m) => {
  if (m.isBaileys || !m.message?.buttonsResponseMessage) return
  
  const selectedButton = m.message.buttonsResponseMessage.selectedDisplayText
  const sender = m.sender
  
  switch(selectedButton) {
    case '📷 Instagram':
      await m.reply('📷 *Instagram:* https://www.instagram.com/xzzys26')
      break
    case '🎵 TikTok':
      await m.reply('🎵 *TikTok:* https://www.tiktok.com/@xzzys16')
      break
    case '💬 Grupo':
      await m.reply('💬 *Grupo WhatsApp:* https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA')
      break
    case '📞 Contacto':
      await m.reply('📞 *Contacto Directo:* https://wa.me/18493907272')
      break
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto']

export default handler