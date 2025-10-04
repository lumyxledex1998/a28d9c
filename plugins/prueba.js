import yts from "yt-search"
import fetch from "node-fetch"

let handler = async (m, { conn, args, command }) => {
  if (!args.length) throw `⚠️ Ingresa el nombre de la canción o video.\n\nEjemplo:\n.${command} Rick Astley Never Gonna Give You Up`

  let search = await yts(args.join(" "))
  let video = search.videos[0] // toma el primer resultado
  if (!video) throw "❌ No encontré resultados."

  let type = command === "play" ? "mp3" : "mp4"
  let apiUrl = `https://brayanofc.vercel.app/api/savetube?url=${encodeURIComponent(video.url)}&type=${type}`

  try {
    // ⏳ Reacción de espera
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    let res = await fetch(apiUrl)
    let data = await res.json()

    if (!data?.resultado?.descarga) throw "⚠️ No se pudo obtener el archivo."

    let caption = `
🎶 *${data.resultado.título}*
📌 Formato: ${data.resultado.formato}
👀 Vistas: ${video.views}
⏳ Duración: ${video.timestamp}
    `.trim()

    // Enviar miniatura + info primero
    await conn.sendMessage(m.chat, {
      image: { url: data.resultado.miniatura },
      caption
    }, { quoted: m })

    // Luego mandar el archivo
    if (type === "mp3") {
      await conn.sendMessage(m.chat, {
        audio: { url: data.resultado.descarga },
        mimetype: "audio/mpeg",
        fileName: `${video.title}.mp3`
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: data.resultado.descarga },
        fileName: `${video.title}.mp4`
      }, { quoted: m })
    }

    // ✅ Reacción de listo
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    throw "⚠️ Error al descargar, revisa tu API."
  }
}

handler.help = ["play <canción>", "playvid <canción>"]
handler.tags = ["downloader"]
handler.command = /^play7|playvid$/i

export default handler