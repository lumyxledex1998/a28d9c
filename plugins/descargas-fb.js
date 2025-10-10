import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  let waitingMsg

  try {
    if (!args[0]) return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA - Descargador Facebook*\n\n✦ *Uso correcto:*\n*${usedPrefix}fb* <url_de_facebook>\n\n✦ *Ejemplo:*\n*${usedPrefix}fb* https://fb.watch/xxxxx\n\n🌸 *Itsuki te ayudará a descargar el video...* (◕‿◕✿)`,
      m, ctxWarn)

    const url = args[0]
    if (!url.match(/facebook\.com|fb\.watch/)) return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n❌ *URL no válida*\n\n✦ Por favor envía un enlace de Facebook válido\n✦ Ejemplo: https://fb.watch/xxxxx\n\n🌸 *Itsuki está confundida...* (´･ω･\`)`,
      m, ctxErr)

    await m.react('📥')
    waitingMsg = await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n📥 *Procesando video de Facebook...*\n✦ Analizando enlace...\n✦ Preparando descarga...\n\n🌸 *Por favor espera un momento...* (◕‿◕✿)`,
      m, ctxWarn)

    const apiUrl = `https://mayapi.ooguy.com/facebook?url=${encodeURIComponent(url)}&apikey=may-f53d1d49`
    const response = await fetch(apiUrl)
    const text = await response.text()
    const data = JSON.parse(text)
    if (!response.ok) throw new Error('Error en la API')
    if (!data.status || !data.result || !data.result.url) throw new Error('No se pudo obtener el video')

    const videoUrl = data.result.url
    const videoTitle = data.result.title || 'Video de Facebook'

    const videoRes = await fetch(videoUrl)
    if (!videoRes.ok) throw new Error('Error al descargar el video')
    const videoBuffer = Buffer.from(await videoRes.arrayBuffer())

    if (waitingMsg) try { await conn.sendMessage(m.chat, { delete: waitingMsg.key }) } catch {}

    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n✅ *¡Descarga completada!*\n\n📹 *Título:* ${videoTitle}\n📦 *Calidad:* Automática\n🔗 *Fuente:* Facebook\n\n🌸 *¡Disfruta del video!* (´｡• ᵕ •｡\`) ♡`,
      m, ctxOk)

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${videoTitle}.mp4`,
      caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n╰ Creado por: LeoXzzsy (Adaptado por SoyMaycol)\n\n📹 ${videoTitle}`
    }, { quoted: m })

    await m.react('✅')

  } catch (error) {
    console.error('Error en descarga Facebook:', error)
    if (waitingMsg) try { await conn.sendMessage(m.chat, { delete: waitingMsg.key }) } catch {}
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n❌ *Error en la descarga*\n\n✦ *Detalles:* ${error.message}\n✦ *Posibles soluciones:*\n• Verifica que el enlace sea correcto\n• El video podría ser privado\n• Intenta con otro enlace\n\n🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)\n\n🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n╰ Creado por: LeoXzzsy`,
      m, ctxErr)
    await m.react('❌')
  }
}

handler.help = ['fb <url>', 'facebook <url>']
handler.tags = ['descargas']
handler.command = ['fb', 'facebook', 'fbd', 'fbdl']
handler.register = true

export default handler
