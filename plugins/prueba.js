import yts from "yt-search"
import fetch from "node-fetch"

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) throw `⚠️ Ingresa el nombre de la canción.\n\nEjemplo:\n.${command} Bad Bunny Un Verano Sin Ti`

  let search = await yts(args.join(" "))
  let video = search.videos[0]
  if (!video) throw "❌ No encontré resultados."

  let type = command === "play" ? "mp3" : "mp4"
  let apiUrl = `https://brayanofc.vercel.app/api/savetube?url=${encodeURIComponent(video.url)}&type=${type}`

  try {
    let res = await fetch(apiUrl)
    let data = await res.json()

    if (!data?.result?.url) throw "⚠️ No se pudo obtener el archivo."

    let caption = `🎶 *${video.title}*\n📌 Duración: ${video.timestamp}\n👀 Vistas: ${video.views}`

    if (type === "mp3") {
      await conn.sendMessage(m.chat, {
        audio: { url: data.result.url },
        mimetype: "audio/mpeg",
        fileName: `${video.title}.mp3`,
        caption
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: data.result.url },
        fileName: `${video.title}.mp4`,
        caption
      }, { quoted: m })
    }
  } catch (e) {
    console.error(e)
    throw "⚠️ Error al descargar, revisa si tu API está respondiendo."
  }
}

handler.help = ["play <canción>", "playvid <canción>"]
handler.tags = ["downloader"]
handler.command = /^play7|playvid$/i

export default handler