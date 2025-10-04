import yts from "yt-search"
import fetch from "node-fetch"

let handler = async (m, { conn, args, command }) => {
  if (!args.length) throw `⚠️ Ingresa el nombre de la canción o video.\n\nEjemplo:\n.${command} Linkin Park In The End`

  let search = await yts(args.join(" "))
  let video = search.videos[0] // primer resultado

  if (!video) throw "❌ No encontré resultados."

  let type = command === "play" ? "mp3" : "mp4"
  let apiUrl = `https://brayanofc.vercel.app/api/savetube?url=${encodeURIComponent(video.url)}&type=${type}`

  try {
    let res = await fetch(apiUrl)
    let data = await res.json()

    if (!data.result?.url) throw "❌ No se pudo obtener el archivo."

    let caption = `🎶 *${video.title}*\n\n📌 *Duración:* ${video.timestamp}\n👀 *Vistas:* ${video.views}\n📤 *Descargado por:* BrayanOFC`

    if (type === "mp3") {
      await conn.sendMessage(m.chat, {
        audio: { url: data.result.url },
        mimetype: "audio/mpeg",
        ptt: false,
        caption
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: data.result.url },
        caption
      }, { quoted: m })
    }

  } catch (err) {
    console.error(err)
    throw "⚠️ Error al descargar, intenta de nuevo."
  }
}

handler.help = ["play <canción>", "playvid <canción>"]
handler.tags = ["downloader"]
handler.command = /^play7|playvid$/i

export default handler