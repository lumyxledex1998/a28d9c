let handler = async (m, { conn, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  if (!m.quoted && !(m.message?.imageMessage || m.message?.videoMessage)) {
    return conn.reply(m.chat, `
🍙🎨 *Itsuki Nakano - Creador de Stickers*

📝 *Cómo usar:*
• Responde a una imagen con !s
• Responde a un video con !s
• Envía imagen/video con !s

🎯 *Formatos:* 🖼️ Imágenes 🎥 Videos
    `.trim(), m, ctxWarn)
  }

  try {
    await conn.reply(m.chat, '🍙🎨 *Creando sticker...* ⏳', m, ctxOk)
    
    let media
    let isVideo = false
    
    // Obtener el medio
    if (m.quoted) {
      if (m.quoted.mtype === 'imageMessage') {
        media = await m.quoted.download()
      } else if (m.quoted.mtype === 'videoMessage') {
        media = await m.quoted.download()
        isVideo = true
      } else if (m.quoted.mtype === 'stickerMessage') {
        // Convertir sticker a imagen
        media = await m.quoted.download()
      } else {
        return conn.reply(m.chat, '❌ Formato no soportado', m, ctxErr)
      }
    } else if (m.message?.imageMessage) {
      media = await conn.downloadMediaMessage(m)
    } else if (m.message?.videoMessage) {
      media = await conn.downloadMediaMessage(m)
      isVideo = true
    }

    if (!media) return conn.reply(m.chat, '❌ Error al descargar', m, ctxErr)

    // Usar el método nativo de Baileys para crear sticker
    await conn.sendMessage(m.chat, {
      sticker: media,
      isVideo: isVideo
    }, { quoted: m })

    await conn.reply(m.chat, '🍙✅ *¡Sticker creado!* 🎨', m, ctxOk)

  } catch (error) {
    console.error('Error sticker:', error)
    await conn.reply(m.chat, '❌ Error al crear sticker', m, ctxErr)
  }
}

handler.help = ['sticker', 's']
handler.tags = ['tools']
handler.command = ['sticker', 's', 'stiker']

export default handler