import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async (m, { conn, command, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  // Verificar si hay imagen, video o sticker para convertir
  if (!m.quoted && !(m.message?.imageMessage || m.message?.videoMessage)) {
    return conn.reply(m.chat, `
🍙🎨 *Itsuki Nakano - Creador de Stickers* ✨

🌟 ¡Como tutora creativa, puedo ayudarte a crear stickers!

📝 *Formas de usar:*
• Responde a una imagen con !s
• Responde a un video con !s 
• Responde a un sticker con !s
• Envía una imagen/video con !s

💡 *Ejemplos:*
• Responde a una foto con !s
• Envía un video corto con !s
• Responde a un sticker con !s

🎯 *Formatos soportados:*
🖼️ Imágenes (JPG, PNG, GIF)
🎥 Videos (MP4, cortos)
📏 Stickers (convertir formato)

🍱 ¡Dale vida a tus conversaciones! 🎨✨
    `.trim(), m, ctxWarn)
  }

  try {
    await conn.reply(m.chat, '🍙🎨 *Creando tu sticker...* ⏳✨', m, ctxOk)
    
    let media
    let packname = 'Itsuki Nakano'
    let author = 'Tutora Virtual'
    
    // Obtener el medio (imagen, video o sticker citado)
    if (m.quoted) {
      if (m.quoted.mtype === 'imageMessage') {
        media = await m.quoted.download()
      } else if (m.quoted.mtype === 'videoMessage') {
        media = await m.quoted.download()
      } else if (m.quoted.mtype === 'stickerMessage') {
        media = await m.quoted.download()
      } else {
        return conn.reply(m.chat, '❌ *Formato no soportado*\nSolo imágenes, videos y stickers.', m, ctxErr)
      }
    } else if (m.message?.imageMessage) {
      media = await conn.downloadMediaMessage(m)
    } else if (m.message?.videoMessage) {
      media = await conn.downloadMediaMessage(m)
    } else {
      return conn.reply(m.chat, '❌ *No se encontró medio válido*', m, ctxErr)
    }

    if (!media) {
      return conn.reply(m.chat, '❌ *Error al descargar el medio*', m, ctxErr)
    }

    // Configuración del sticker
    const stickerOptions = {
      pack: packname,
      author: author,
      type: StickerTypes.FULL,
      categories: ['🤩', '🎉'],
      id: '12345',
      quality: 50,
      background: 'transparent'
    }

    // Crear el sticker
    const sticker = new Sticker(media, stickerOptions)
    const stickerBuffer = await sticker.toBuffer()

    // Enviar el sticker
    await conn.sendMessage(m.chat, {
      sticker: stickerBuffer
    }, { quoted: m })

    // Mensaje de confirmación
    await conn.reply(m.chat, 
      `🍙✅ *¡Sticker creado con éxito!* 🎨✨\n\n` +
      `🏷️ *Pack:* ${packname}\n` +
      `✍️ *Autor:* ${author}\n\n` +
      `📖 *"¡Tu sticker está listo para usar!"* 🍱🎉`,
      m, ctxOk
    )

  } catch (error) {
    console.error('Error creando sticker:', error)
    await conn.reply(m.chat, 
      `❌ *Error al crear el sticker*\n\n` +
      `🍙 *"¡Lo siento! No pude crear tu sticker."*\n\n` +
      `🔧 *Error:* ${error.message}\n\n` +
      `📖 *¡Intenta con otra imagen o video!* 🍱✨`,
      m, ctxErr
    )
  }
}

handler.help = ['sticker', 's', 'stiker']
handler.tags = ['tools']
handler.command = ['sticker', 's', 'stiker', 'stick']

export default handler