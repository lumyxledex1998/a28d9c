import fetch from 'node-fetch'

/**
 * 🎀 CREADO POR: LeoXzzsy
 * 🌸 ADAPTADO PARA: Itsuki-Nakano IA
 * 📚 VERSIÓN: 3.4.0 Beta
 * 🏷️ DESCARGADOR PINTEREST
 */

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    // Verificar si se proporcionó URL
    if (!args[0]) {
      return conn.reply(m.chat, 
        `🎀 *Itsuki-Nakano IA - Descargador Pinterest*\n\n` +
        `✦ *Uso correcto:*\n` +
        `*${usedPrefix}pinterest* <url_de_pinterest>\n\n` +
        `✦ *Ejemplo:*\n` +
        `*${usedPrefix}pinterest* https://pin.it/xxxxx\n\n` +
        `🌸 *Itsuki te ayudará a descargar imágenes/videos...* (◕‿◕✿)`,
      m, ctxWarn)
    }

    const url = args[0]
    
    // Verificar que sea una URL de Pinterest válida
    if (!url.match(/pinterest|pin\.it/)) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA*\n\n` +
        `❌ *URL no válida*\n\n` +
        `✦ Por favor envía un enlace de Pinterest válido\n` +
        `✦ Ejemplos:\n` +
        `• https://pin.it/xxxxx\n` +
        `• https://pinterest.com/pin/xxxxx\n\n` +
        `🌸 *Itsuki está confundida...* (´･ω･\`)`,
      m, ctxErr)
    }

    // Reaccionar y enviar mensaje de espera
    await m.react('📌')
    let waitingMsg = await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `📌 *Procesando contenido de Pinterest...*\n` +
      `✦ Analizando enlace...\n` +
      `✦ Extrayendo medios...\n\n` +
      `🌸 *Itsuki está buscando tus pins...* 📥`,
      m, ctxWarn
    )

    // API para Pinterest
    const apiUrl = `https://api.erdwpe.com/api/download/pinterest?url=${encodeURIComponent(url)}`
    
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Error en la API de Pinterest')

    const data = await response.json()
    
    if (!data.status || !data.result) {
      throw new Error('No se pudo obtener el contenido')
    }

    const mediaUrls = data.result
    let mediaCount = 0

    // Contar medios disponibles
    if (mediaUrls.image) mediaCount++
    if (mediaUrls.image_hd) mediaCount++
    if (mediaUrls.video) mediaCount++

    if (mediaCount === 0) {
      throw new Error('No se encontraron medios descargables')
    }

    // Eliminar mensaje de espera
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }

    // Enviar mensaje de éxito
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `✅ *¡Contenido encontrado!*\n\n` +
      `📌 *Medios disponibles:* ${mediaCount}\n` +
      `🔗 *Fuente:* Pinterest\n\n` +
      `🌸 *Itsuki está enviando tus medios...* (´｡• ᵕ •｡\`)`,
      m, ctxOk
    )

    // Enviar medios disponibles
    if (mediaUrls.video) {
      await conn.sendFile(m.chat, mediaUrls.video, 'pinterest_video.mp4', 
        `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
        `╰ Creado por: LeoXzzsy\n\n` +
        `📹 *Video de Pinterest*\n` +
        `⭐ Calidad: HD`,
        m
      )
    }

    if (mediaUrls.image_hd) {
      await conn.sendFile(m.chat, mediaUrls.image_hd, 'pinterest_hd.jpg', 
        `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
        `╰ Creado por: LeoXzzsy\n\n` +
        `🖼️ *Imagen HD de Pinterest*`,
        m
      )
    } else if (mediaUrls.image) {
      await conn.sendFile(m.chat, mediaUrls.image, 'pinterest.jpg', 
        `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
        `╰ Creado por: LeoXzzsy\n\n` +
        `🖼️ *Imagen de Pinterest*`,
        m
      )
    }

    await m.react('✅')

  } catch (error) {
    console.error('Error en descarga Pinterest:', error)
    
    // Eliminar mensaje de espera si existe
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }

    // Mensaje de error estilo Itsuki
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Error en la descarga*\n\n` +
      `✦ *Detalles:* ${error.message}\n\n` +
      `✦ *Posibles soluciones:*\n` +
      `• Verifica que el enlace sea correcto\n` +
      `• El pin podría ser privado\n` +
      `• Intenta con otro enlace de Pinterest\n\n` +
      `🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)\n\n` +
      `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
      `╰ Creado por: LeoXzzsy`,
      m, ctxErr
    )
    
    await m.react('❌')
  }
}

// Versión alternativa para imágenes específicas
let handler2 = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    if (!args[0]) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA - Pinterest DL*\n\n` +
        `✦ *Formas de usar:*\n` +
        `*${usedPrefix}pinterest* <url>\n` +
        `*${usedPrefix}pin* <url>\n` +
        `*${usedPrefix}pindl* <url>\n\n` +
        `✦ *Ejemplos válidos:*\n` +
        `• https://pin.it/xxxxx\n` +
        `• https://pinterest.com/pin/xxxxx\n` +
        `• https://www.pinterest.com/pin/xxxxx\n\n` +
        `🌸 *Itsuki puede descargar imágenes y videos...* 📌`,
        m, ctxWarn
      )
    }

    const url = args[0]
    await m.react('🔍')

    let waitingMsg = await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `🔍 *Buscando en Pinterest...*\n` +
      `✦ Verificando enlace...\n` +
      `✦ Extrayendo contenido...\n\n` +
      `📚 *Itsuki está revisando los pins...* 📥`,
      m, ctxWarn
    )

    // API alternativa
    const apiUrl = `https://api.tokyo-line.tech/api/download/pinterest?url=${encodeURIComponent(url)}`
    
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Error en la API')

    const data = await response.json()
    
    if (!data.media || !data.media.url) {
      throw new Error('No se pudo obtener el contenido')
    }

    const mediaUrl = data.media.url
    const mediaType = data.media.type || 'image'
    const mediaTitle = data.title || 'Contenido de Pinterest'

    // Eliminar mensaje de espera
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }

    // Enviar según el tipo de medio
    if (mediaType === 'video') {
      await conn.sendFile(m.chat, mediaUrl, 'pinterest_video.mp4',
        `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
        `╰ Creado por: LeoXzzsy\n\n` +
        `📹 ${mediaTitle}\n` +
        `🔗 Fuente: Pinterest`,
        m
      )
    } else {
      await conn.sendFile(m.chat, mediaUrl, 'pinterest_image.jpg',
        `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
        `╰ Creado por: LeoXzzsy\n\n` +
        `🖼️ ${mediaTitle}\n` +
        `🔗 Fuente: Pinterest`,
        m
      )
    }

    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `✅ *¡Descarga completada!*\n\n` +
      `📌 *Tipo:* ${mediaType === 'video' ? 'Video' : 'Imagen'}\n` +
      `📝 *Título:* ${mediaTitle}\n\n` +
      `🌸 *¡Disfruta del contenido!* (◕‿◕✿)`,
      m, ctxOk
    )

    await m.react('✅')

  } catch (error) {
    console.error('Error en Pinterest DL:', error)
    
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }

    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Error al descargar de Pinterest*\n\n` +
      `✦ ${error.message}\n\n` +
      `🌸 *Itsuki sugiere intentar con otro enlace...* (´･ω･\`)`,
      m, ctxErr
    )
    
    await m.react('❌')
  }
}

handler.help = ['pinterest <url>', 'pin <url>']
handler.tags = ['downloader']
handler.command = ['pinterest', 'pin', 'pindl', 'pinteres']
handler.register = true

export default handler