import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix }) => {
  // Definir valores por defecto si las variables globales no existen
  const ctxErr = global.rcanalx || { key: { participant: '0@s.whatsapp.net' }, message: { conversation: 'Error' } }
  const ctxWarn = global.rcanalw || { key: { participant: '0@s.whatsapp.net' }, message: { conversation: 'Advertencia' } }
  const ctxOk = global.rcanalr || { key: { participant: '0@s.whatsapp.net' }, message: { conversation: 'Éxito' } }

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 Itsuki Nakano - Descargar Multimedia 🎵🎥✨

📝 Forma de uso:
• ${usedPrefix}play <nombre de la canción>

💡 Ejemplos:
• ${usedPrefix}play unravel Tokyo ghoul
• ${usedPrefix}play crossing field

🎯 Formato disponible:
🎵 Audio MP3 (alta calidad)

🍱 ¡Encuentra y descarga tu música favorita! 🎶
`.trim(), m)
  }

  try {
    await conn.reply(m.chat, '🎵 Buscando audio...', m)

    const search = await yts(text)  
    if (!search.videos.length) throw new Error('No encontré resultados para tu búsqueda.')  

    const video = search.videos[0]  
    const { title, url, thumbnail } = video  

    let thumbBuffer = null  
    if (thumbnail) {  
      try {  
        const resp = await fetch(thumbnail)
        thumbBuffer = await resp.buffer()
      } catch (err) {  
        console.log('No se pudo obtener la miniatura:', err.message)  
      }  
    }  

    const fuentes = [  
      { api: 'ZenzzXD', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res?.download_url },  
      { api: 'ZenzzXD v2', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3v2?url=${encodeURIComponent(url)}`, extractor: res => res?.download_url },  
      { api: 'Vreden', endpoint: `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res?.result?.download?.url },  
      { api: 'Delirius', endpoint: `https://api.delirius.my.id/download/ymp3?url=${encodeURIComponent(url)}`, extractor: res => res?.data?.download?.url },  
      { api: 'StarVoid', endpoint: `https://api.starvoidclub.xyz/download/youtube?url=${encodeURIComponent(url)}`, extractor: res => res?.audio }  
    ]  

    let audioUrl, apiUsada, exito = false  

    for (let fuente of fuentes) {  
      try {  
        console.log(`Probando API: ${fuente.api}`)
        const response = await fetch(fuente.endpoint)  
        if (!response.ok) {
          console.log(`API ${fuente.api} no respondió OK: ${response.status}`)
          continue
        }  
        const data = await response.json()  
        const link = fuente.extractor(data)  
        if (link && typeof link === 'string' && link.startsWith('http')) {  
          audioUrl = link  
          apiUsada = fuente.api  
          exito = true  
          console.log(`✅ API exitosa: ${fuente.api}`)
          break  
        }  
      } catch (err) {  
        console.log(`⚠️ Error con ${fuente.api}:`, err.message)  
      }  
    }  

    if (!exito) {  
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })  
      return conn.reply(m.chat, '🥲 No se pudo descargar el audio desde ninguna API.', m)  
    }  

    console.log(`Enviando audio desde: ${audioUrl}`)
    
    await conn.sendMessage(  
      m.chat,  
      {  
        audio: { url: audioUrl },  
        mimetype: 'audio/mpeg',  
        ptt: false,
        fileName: `${title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: `API: ${apiUsada}`,
            thumbnail: thumbBuffer,
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true
          }
        }
      },  
      { quoted: m }  
    )  

    await conn.reply(m.chat, `✅ Descarga completa 🍙\n🎵 ${title}`, m)

  } catch (e) {
    console.error('❌ Error en play:', e)
    await conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.help = ['play <nombre de la canción>']
handler.tags = ['downloader']
handler.command = ['play', 'music']

export default handler