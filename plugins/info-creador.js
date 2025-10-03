let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      text: '👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*',
      templateButtons: [
        {
          urlButton: {
            displayText: '📷 Instagram',
            url: 'https://www.instagram.com/xzzys26'
          }
        },
        {
          urlButton: {
            displayText: '🎵 TikTok', 
            url: 'https://www.tiktok.com/@xzzys16'
          }
        },
        {
          urlButton: {
            displayText: '💬 Grupo WA',
            url: 'https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA'
          }
        },
        {
          urlButton: {
            displayText: '📢 Canal WA',
            url: 'https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z'
          }
        }
      ]
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    m.reply('📞 Contacto: https://wa.me/18493907272')
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info'] 
handler.command = ['owner', 'creador', 'contacto']

export default handler