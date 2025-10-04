import yts from "yt-search"
import fetch from "node-fetch"

let handler = async (m, { conn, args, command }) => {
  if (!args.length) throw `⚠️ Ingresa el nombre de la canción o video.\n\nEjemplo:\n.${command} Rick Astley Never Gonna Give You Up`

  let search = await yts(args.join(" "))
  let video = search.videos[0]
  if (!video) throw "❌ No encontré resultados."

  let type = command === "play" ? "mp3" : "mp4"
  let apiUrl = `https://brayanofc.vercel.app/api/savetube?url=${encodeURIComponent(video.url)}&type=${type}`

  try {
    // Reacción de espera ⏳
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    let res = await fetch(apiUrl)
    let data = await res.json()

    // 🔍 log para depuración
    console.log("DEBUG API:", data)

    // soporte para `resultado` o `result`
    let info = data.resultado || data.result
    if (!info?.descarga && !info?.url) throw "⚠️ No se pudo obtener el archivo."

    let downloadUrl = info.descarga || info.url
    let title = info.título || info.title || video.title
    let format = info.formato || info.format || type
    let thumb = info.miniatura || info.thumbnail || video.thumbnail

    let caption = `
🎶 *${title}*
📌 Formato: ${format}
👀 Vistas: ${video.views}
⏳ Duración: ${video.timestamp}
    `.trim()

    // Enviar miniatura + info primero
    await conn.sendMessage(m.chat, {
      image: { url: thumb },
      caption
    }, { quoted: m })

    // Luego mandar el archivo
    if (type === "mp3") {
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        fileName: `${title}.mp4`
      }, { quoted: m })
    }

    // ✅ reacción de listo
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error("❌ Error:", e)
    throw "⚠️ Error al descargar. Mira la consola para detalles."
  }
}

handler.help = ["play7 <canción>", "playvid <canción>"]
handler.tags = ["downloader"]
handler.command = /^play7|playvid$/i

export default handler