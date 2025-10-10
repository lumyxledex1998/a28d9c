import fetch from 'node-fetch'

/**
 * 🎀 CREADO POR: LeoXzzsy
 * 🌸 ADAPTADO PARA: Itsuki-Nakano IA
 * 📚 VERSIÓN: 3.4.0 (Beta)
 * 🏷️ DESCARGADOR PINTEREST
 */

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    // Verificar URL
    if (!args[0]) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA - Descargador Pinterest*\n\n` +
        `✦ *Uso correcto:*\n` +
        `*${usedPrefix + command}* <url_de_pinterest>\n\n` +
        `✦ *Ejemplo:*\n` +
        `*${usedPrefix + command}* https://pin.it/xxxxx\n\n` +
        `🌸 *Itsuki te ayudará a descargar tus pins UwU* (◕‿◕✿)`,
      m, ctxWarn)
    }

    const url = args[0]

    // Verificar enlace válido
    if (!url.match(/pinterest|pin\.it/)) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA*\n\n` +
        `❌ *URL no válida*\n\n` +
        `✦ Envía un enlace de Pinterest válido\n` +
        `• https://pin.it/xxxxx\n` +
        `• https://pinterest.com/pin/xxxxx\n\n` +
        `🌸 *Itsuki se ha confundido...* (´･ω･\`)`,
      m, ctxErr)
    }

    // Mensaje de espera - NO se borrará
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `📌 *Procesando enlace de Pinterest...*\n` +
      `✦ Analizando contenido...\n` +
      `✦ Extrayendo medios...\n\n` +
      `🌸 *Itsuki está buscando tu pin...* 📥`,
      m, ctxWarn
    )

    // 🧠 Nueva API Insana
    const apiUrl = `https://mayapi.ooguy.com/pinterest?url=${encodeURIComponent(url)}&apikey=may-f53d1d49`
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Error al conectar con MayAPI')

    const data = await response.json()
    if (!data.status || !data.result?.url) throw new Error('No se pudo obtener el contenido del pin')

    const { id, title, url: mediaUrl } = data.result
    const { username, requests_made_today, limit } = data.user || {}

    // Detectar si es imagen o video (solo imagen por ahora)
    const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.includes('video')

    // Enviar resultado - NO se borra el mensaje anterior
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `✅ *¡Pin encontrado con éxito!*\n\n` +
      `🆔 *ID:* ${id}\n` +
      `🖋️ *Título:* ${title}\n` +
      `🔗 *Fuente:* Pinterest\n` +
      (username ? `👤 *Usuario API:* ${username}\n📊 *Usos hoy:* ${requests_made_today}/${limit}\n\n` : '\n') +
      `🌸 *Descargando tu pin...* (´｡• ᵕ •｡\`)`,
      m, ctxOk
    )

    if (isVideo) {
      await conn.sendFile(m.chat, mediaUrl, 'pinterest_video.mp4',
        `🎀 *Itsuki-Nakano IA v3.5.0 (MayAPI)*\n` +
        `╰ Creado por: LeoXzzsy 👑\n\n` +
        `📹 *Video de Pinterest*\n` +
        `⭐ *Título:* ${title}`,
        m
      )
    } else {
      await conn.sendFile(m.chat, mediaUrl, 'pinterest_image.jpg',
        `🎀 *Itsuki-Nakano IA v3.5.0 (MayAPI)*\n` +
        `╰ Creado por: LeoXzzsy 👑\n\n` +
        `🖼️ *Imagen de Pinterest*\n` +
        `⭐ *Título:* ${title}`,
        m
      )
    }

    await m.react('✅')

  } catch (error) {
    console.error('Error en Pinterest (MayAPI):', error)

    await m.react('❌')
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Error al descargar desde MayAPI*\n\n` +
      `✦ *Detalles:* ${error.message}\n\n` +
      `🌸 *Intenta con otro enlace o más tarde...* (´；ω；\`)\n\n` +
      `🎀 *Itsuki-Nakano IA v3.5.0*`,
      m, ctxErr
    )
  }
}

handler.help = ['pinterest <url>', 'pin <url>', 'pindl <url>']
handler.tags = ['downloader']
handler.command = ['pinterest', 'pin', 'pindl', 'pinteres']
handler.register = true

export default handler