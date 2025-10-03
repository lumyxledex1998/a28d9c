let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/kk9nnq.jpg' },
      caption: '👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*\n\n𝗦𝗲𝗹𝗲𝗰𝗶𝗼𝗻𝗮 𝗨𝗻 𝗠𝗲𝘁𝗼𝗱𝗼:',
      buttons: [
        { 
          urlButton: {
            displayText: '📸 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌',
            url: 'https://www.instagram.com/xzzys26'
          }
        },
        { 
          urlButton: {
            displayText: '💎 𝐓𝐈𝐊𝐓𝐎𝐊',
            url: 'https://www.tiktok.com/@xzzys16'
          }
        },
        { 
          urlButton: {
            displayText: '📢 𝐂𝐀𝐍𝐀𝐋 𝐎𝐅𝐈𝐂𝐈𝐀𝐋',
            url: 'https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z'
          }
        },
        { 
          urlButton: {
            displayText: '👑 𝐂𝐑𝐄𝐀𝐃𝐎𝐑',
            url: 'https://wa.me/18493907272'
          }
        }
      ]
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    // Versión de respaldo simple
    const message = `
👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*

📸 𝑰𝑵𝑺𝑻𝑨𝑮𝑹𝑨𝑴: https://www.instagram.com/xzzys26
💎 𝑻𝑰𝑲𝑻𝑶𝑲: https://www.tiktok.com/@xzzys16  
📢 𝑪𝑨𝑵𝑨𝑳: https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z
👑 𝑪𝑹𝑬𝑨𝑫𝑶𝑹: https://wa.me/18493907272
    `.trim()
    await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto']

export default handler