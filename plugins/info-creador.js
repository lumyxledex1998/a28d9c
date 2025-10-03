let handler = async (m, { conn }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    // Información del creador
    const creatorInfo = {
      name: '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡',
      botName: '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸',
      version: '𝗕𝗲𝘁𝗮',
      social: {
        whatsapp: 'https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA',
        instagram: 'https://www.instagram.com/xzzys26',
        tiktok: 'https://www.tiktok.com/@xzzys16'
      },
      contact: 'https://wa.me/18493907272'
    }

    const infoMessage = `
╭━━━〔 🧑‍💻 *INFORMACIÓN DEL CREADOR* 〕━━━⬣
┃ 
┃ 🤖 *Nombre del Bot:* 
┃    ${creatorInfo.botName}
┃ 
┃ 👑 *Creador:* 
┃    ${creatorInfo.name}
┃ 
┃ 🪷 *Versión:* 
┃    ${creatorInfo.version}
┃ 
┃ 💬 *Contacto Directo:* 
┃    ${creatorInfo.contact}
┃ 
┃ 🌟 *Redes Sociales:*
┃    📷 Instagram | 🎵 TikTok
┃    💬 Grupo WhatsApp
┃ 
┃ 💡 *¿Necesitas ayuda?*
┃    Usa el comando !reporte
┃    para reportar errores
┃ 
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
    `.trim()

    // Enviar mensaje con botones
    await conn.sendMessage(m.chat, {
      text: infoMessage,
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: '📷 Instagram',
            url: creatorInfo.social.instagram
          }
        },
        {
          index: 2,
          urlButton: {
            displayText: '🎵 TikTok',
            url: creatorInfo.social.tiktok
          }
        },
        {
          index: 3,
          urlButton: {
            displayText: '💬 Grupo WhatsApp',
            url: creatorInfo.social.whatsapp
          }
        }
      ],
      ...global.rcanalden2
    }, { quoted: m })

    // También enviar contacto como respaldo
    await conn.sendContact(m.chat, [
      {
        displayName: creatorInfo.name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${creatorInfo.name}\nORG:Desarrollador de ${creatorInfo.botName};\nTEL;type=CELL;type=VOICE;waid=18493907272:+18493907272\nEND:VCARD`
      }
    ], m, { ...global.rcanalden2 })

    // Log en consola
    console.log(`📱 INFO CREADOR SOLICITADO:
👤 Usuario: ${m.sender}
🕒 Hora: ${new Date().toLocaleString()}
    `)

  } catch (error) {
    console.error('❌ Error en info creador:', error)
    
    // Mensaje de respaldo sin botones
    await conn.reply(m.chat, 
      `🧑‍💻 *INFORMACIÓN DEL CREADOR*\n\n` +
      `🤖 *Bot:* 🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎-𝐀𝐈 🌸\n` +
      `👑 *Creador:* 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡\n` +
      `🪷 *Versión:* 𝗕𝗲𝘁𝗮\n` +
      `💬 *Contacto:* https://wa.me/18493907272\n\n` +
      `📱 *Redes:*\n` +
      `📷 Instagram: https://www.instagram.com/xzzys26\n` +
      `🎵 TikTok: https://www.tiktok.com/@xzzys16\n` +
      `💬 Canal: https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z`,
      m, ctxOk
    )
  }
}

handler.help = ['owner', 'creador', 'creator', 'desarrollador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'creator', 'desarrollador', 'contacto']

export default handler