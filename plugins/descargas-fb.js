import fetch from 'node-fetch'

/**
 * 🎀 CREADO POR: LeoXzzsy
 * 🌸 ADAPTADO PARA: Itsuki-Nakano IA
 * 📚 VERSIÓN: 3.4.0 Beta
 * 🏷️ DESCARGADOR FACEBOOK
 */

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  let waitingMsg

  try {
    // Verificar si se proporcionó URL
    if (!args[0]) {
      return conn.reply(m.chat, 
        `🎀 *Itsuki-Nakano IA - Descargador Facebook*\n\n` +
        `✦ *Uso correcto:*\n` +
        `*${usedPrefix}fb* <url_de_facebook>\n\n` +
        `✦ *Ejemplo:*\n` +
        `*${usedPrefix}fb* https://fb.watch/xxxxx\n\n` +
        `🌸 *Itsuki te ayudará a descargar el video...* (◕‿◕✿)`,
      m, ctxWarn)
    }

    const url = args[0]

    // Verificar que sea una URL de Facebook válida
    if (!url.match(/facebook\.com|fb\.watch/)) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA*\n\n` +
        `❌ *URL no válida*\n\n` +
        `✦ Por favor envía un enlace de Facebook válido\n` +
        `✦ Ejemplo: https://fb.watch/xxxxx\n\n` +
        `🌸 *Itsuki está confundida...* (´･ω･\`)`,
      m, ctxErr)
    }

    // Reaccionar y enviar mensaje de espera
    await m.react('📥')
    waitingMsg = await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `📥 *Procesando video de Facebook...*\n` +
      `✦ Analizando enlace...\n` +
      `✦ Preparando descarga...\n\n` +
      `🌸 *Por favor espera un momento...* (◕‿◕✿)`,
    m, ctxWarn)

    // Una sola API confiable
    const apiUrl = `https://api.erdwpe.com/api/download/fb?url=${encodeURIComponent(url)}`

    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Error en la API')

    const data = await response.json()

    if (!data.status || !data.result) {
      throw new Error('No se pudo obtener el video')
    }

    const videoUrl = data.result.hd || data.result.sd
    if (!videoUrl) throw new Error('URL de video no disponible')

    const videoTitle = data.result.title || 'Video de Facebook'
    const videoQuality = data.result.hd ? 'HD' : 'SD'

    // Eliminar mensaje de espera
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }

    // Enviar mensaje de éxito
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `✅ *¡Descarga completada!*\n\n` +
      `📹 *Título:* ${videoTitle}\n` +
      `📦 *Calidad:* ${videoQuality}\n` +
      `🔗 *Fuente:* Facebook\n\n` +
      `🌸 *Itsuki está enviando el video...* (´｡• ᵕ •｡\`) ♡`,
    m, ctxOk)

    // Enviar el video como VIDEO (no como archivo)
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
              `╰ Creado por: LeoXzzsy\n\n` +
              `📹 ${videoTitle}\n` +
              `⭐ Calidad: ${videoQuality}`,
      mentions: [m.sender]
    }, { quoted: m })

    await m.react('✅')

  } catch (error) {
    console.error('Error en descarga Facebook:', error)

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
      `• El video podría ser privado\n` +
      `• Intenta con otro enlace\n\n` +
      `🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)\n\n` +
      `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
      `╰ Creado por: LeoXzzsy`,
    m, ctxErr)

    await m.react('❌')
  }
}

handler.help = ['fb <url>', 'facebook <url>']
handler.tags = ['descargas']
handler.command = ['fb', 'facebook', 'fbd', 'fbdl']
handler.register = true

export default handler