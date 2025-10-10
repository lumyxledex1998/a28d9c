import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  let waitingMsg
  let tempFilePath = null

  try {
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
    if (!url.match(/facebook\.com|fb\.watch/)) {
      return conn.reply(m.chat,
        `🎀 *Itsuki-Nakano IA*\n\n` +
        `❌ *URL no válida*\n\n` +
        `✦ Por favor envía un enlace de Facebook válido\n` +
        `✦ Ejemplo: https://fb.watch/xxxxx\n\n` +
        `🌸 *Itsuki está confundida...* (´･ω･\`)`,
      m, ctxErr)
    }

    await m.react('📥')
    waitingMsg = await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `📥 *Procesando video de Facebook...*\n` +
      `✦ Analizando enlace...\n` +
      `✦ Preparando descarga...\n\n` +
      `🌸 *Por favor espera un momento...* (◕‿◕✿)`,
    m, ctxWarn)

    const apiUrl = `https://mayapi.ooguy.com/facebook?url=${encodeURIComponent(url)}&apikey=may-f53d1d49`
    const response = await fetch(apiUrl)
    
    if (!response.ok) throw new Error(`Error en la API: ${response.status}`)
    
    const data = await response.json()
    console.log('📦 Datos de la API:', JSON.stringify(data, null, 2))

    if (!data.status || !data.result || !data.result.url) {
      throw new Error('No se pudo obtener el video de la API')
    }

    const videoUrl = data.result.url
    const videoTitle = data.result.title || 'Video de Facebook'

    console.log('🎬 URL del video:', videoUrl)

    // Descargar localmente el video
    tempFilePath = path.join(process.cwd(), `temp_${Date.now()}.mp4`)
    const videoResponse = await fetch(videoUrl)

    if (!videoResponse.ok) throw new Error('Error al descargar el video desde la URL')

    const fileStream = fs.createWriteStream(tempFilePath)
    await new Promise((resolve, reject) => {
      videoResponse.body.pipe(fileStream)
      videoResponse.body.on('error', reject)
      fileStream.on('finish', resolve)
    })

    // Verificar que el archivo se descargó correctamente
    const stats = fs.statSync(tempFilePath)
    if (stats.size === 0) {
      throw new Error('El archivo se descargó vacío')
    }

    console.log('📁 Archivo descargado:', tempFilePath, 'Tamaño:', stats.size, 'bytes')

    if (waitingMsg) {
      try { 
        await conn.sendMessage(m.chat, { delete: waitingMsg.key }) 
      } catch (e) {
        console.log('⚠️ No se pudo eliminar mensaje de espera:', e)
      }
    }

    // Enviar mensaje de éxito
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `✅ *¡Descarga completada!*\n\n` +
      `📹 *Título:* ${videoTitle}\n` +
      `📦 *Tamaño:* ${(stats.size / (1024 * 1024)).toFixed(2)} MB\n` +
      `🔗 *Fuente:* Facebook\n\n` +
      `🌸 *Itsuki está enviando el video...* (´｡• ᵕ •｡\`) ♡`,
    m, ctxOk)

    // Enviar el video - Método 1: Usando fs.readFileSync
    const videoBuffer = fs.readFileSync(tempFilePath)
    
    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `facebook_${Date.now()}.mp4`,
      caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
              `╰ Creado por: LeoXzzsy\n\n` +
              `📹 ${videoTitle}`
    }, { quoted: m })

    await m.react('✅')

    // Eliminar el archivo temporal después de enviar
    setTimeout(() => {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath)
          console.log('🗑️ Archivo temporal eliminado:', tempFilePath)
        }
      } catch (e) {
        console.log('⚠️ Error al eliminar archivo temporal:', e)
      }
    }, 5000) // Esperar 5 segundos antes de eliminar

  } catch (error) {
    console.error('❌ Error en descarga Facebook:', error)
    
    // Eliminar archivo temporal si existe
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
        console.log('🗑️ Archivo temporal eliminado por error:', tempFilePath)
      } catch (e) {
        console.log('⚠️ Error al eliminar archivo temporal en error:', e)
      }
    }
    
    if (waitingMsg) {
      try { 
        await conn.sendMessage(m.chat, { delete: waitingMsg.key }) 
      } catch (e) {
        console.log('⚠️ No se pudo eliminar mensaje de espera en error:', e)
      }
    }

    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Error en la descarga*\n\n` +
      `✦ *Detalles:* ${error.message}\n\n` +
      `✦ *Posibles soluciones:*\n` +
      `• Verifica que el enlace sea correcto\n` +
      `• El video podría ser privado\n` +
      `• Intenta con otro enlace\n` +
      `• El video puede ser muy grande\n\n` +
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