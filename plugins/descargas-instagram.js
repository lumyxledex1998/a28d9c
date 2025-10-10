import fetch from 'node-fetch'

/**
 * 🎀 CREADO POR: LeoXzzsy
 * 🌸 ADAPTADO PARA: Itsuki-Nakano IA
 * 📚 VERSIÓN: 3.4.0 Beta
 * 🏷️ DESCARGADOR INSTAGRAM
 */

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    if (!args[0]) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA - Descargador Instagram*\n\n` +
        `✦ *Uso correcto:*\n` +
        `*${usedPrefix}ig* <url_de_instagram>\n\n` +
        `✦ *Ejemplo:*\n` +
        `*${usedPrefix}ig* https://www.instagram.com/p/xxxxx\n\n` +
        `🌸 *Itsuki te ayudará a descargar el contenido...* (◕‿◕✿)`,
      m, ctxWarn)
    }

    const url = args[0]
    if (!url.match(/instagram\.com/)) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA*\n\n` +
        `❌ *URL no válida*\n\n` +
        `✦ Por favor envía un enlace de Instagram válido\n` +
        `✦ Ejemplo: https://www.instagram.com/p/xxxxx\n\n` +
        `🌸 *Itsuki está confundida...* (´･ω･\`)`,
      m, ctxErr)
    }

    await m.react('📥')
    
    // Mensaje de espera
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `📥 *Procesando contenido de Instagram...*\n` +
      `✦ Analizando enlace...\n` +
      `✦ Preparando descarga...\n\n` +
      `🌸 *Por favor espera un momento...* (◕‿◕✿)`,
    m, ctxWarn)

    // API para Instagram
    const apiUrl = `https://mayapi.ooguy.com/instagram?url=${encodeURIComponent(url)}&apikey=may-f53d1d49`
    console.log('🔗 Solicitando a API:', apiUrl)

    const response = await fetch(apiUrl, {
      timeout: 30000
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('📦 Respuesta de API:', data)

    // Verificar diferentes estructuras de respuesta
    if (!data.status) {
      throw new Error('La API no respondió correctamente')
    }

    let mediaUrl, mediaTitle, mediaType

    // Buscar en diferentes estructuras posibles para Instagram
    if (data.result && data.result.url) {
      mediaUrl = data.result.url
      mediaTitle = data.result.title || 'Contenido de Instagram'
      mediaType = data.result.type || 'video'
    } else if (data.url) {
      mediaUrl = data.url
      mediaTitle = data.title || 'Contenido de Instagram'
      mediaType = data.type || 'video'
    } else if (data.data && data.data.url) {
      mediaUrl = data.data.url
      mediaTitle = data.data.title || 'Contenido de Instagram'
      mediaType = data.data.type || 'video'
    } else {
      throw new Error('No se encontró contenido en la respuesta')
    }

    console.log('🎬 URL del contenido encontrada:', mediaUrl)
    console.log('📝 Título:', mediaTitle)
    console.log('📊 Tipo:', mediaType)

    // Determinar si es video o imagen
    const isVideo = mediaType === 'video' || mediaUrl.includes('.mp4') || mediaUrl.includes('video')

    if (isVideo) {
      // Enviar video
      await conn.sendMessage(m.chat, {
        video: { url: mediaUrl },
        caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
                `╰ Creado por: LeoXzzsy\n\n` +
                `📹 ${mediaTitle}\n` +
                `⭐ Descargado desde Instagram`
      }, { quoted: m })
    } else {
      // Enviar imagen
      await conn.sendMessage(m.chat, {
        image: { url: mediaUrl },
        caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
                `╰ Creado por: LeoXzzsy\n\n` +
                `🖼️ ${mediaTitle}\n` +
                `⭐ Descargado desde Instagram`
      }, { quoted: m })
    }

    await m.react('✅')

  } catch (error) {
    console.error('❌ Error en descarga Instagram:', error)

    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Error en la descarga*\n\n` +
      `✦ *Detalles:* ${error.message}\n\n` +
      `✦ *Posibles soluciones:*\n` +
      `• Verifica que el enlace sea correcto\n` +
      `• El contenido podría ser privado\n` +
      `• Intenta con otro enlace\n` +
      `• La publicación podría tener restricciones\n\n` +
      `🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)\n\n` +
      `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
      `╰ Creado por: LeoXzzsy`,
    m, ctxErr)

    await m.react('❌')
  }
}

handler.help = ['ig <url>', 'instagram <url>']
handler.tags = ['descargas']
handler.command = ['ig', 'instagram', 'igdl']
handler.register = true

export default handler