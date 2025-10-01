import axios from "axios"

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply(`🌟 Ingresa un link de YouTube\n\n📌 Ejemplo: .ytmp3 https://youtu.be/xxxxx`)

  const urlVideo = args[0].trim()
  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const apiUrl = (`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${encodeURIComponent(url)}`);

    const response = await axios.get(apiUrl, {
      params: { url: urlVideo, apikey },
      timeout: 30000
    })

    const data = response.data || {}
    console.log("Respuesta completa del API:", JSON.stringify(data, null, 2))

    const downloadUrl =
      data.result?.download_url ??
      data.download_url ??
      data.url ??
      data.result?.url ??
      data.result?.link ??
      data.result?.audio ??
      null

    if (!downloadUrl) {
      return m.reply("❌ No se pudo obtener el audio de la respuesta.")
    }

    const fileResp = await axios.get(downloadUrl, { responseType: "arraybuffer", timeout: 60000 })
    const buffer = Buffer.from(fileResp.data)

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: "audio/mpeg",
      fileName: `audio.mp3`
    }, { quoted: m })

  } catch (e) {
    console.error("Error en ytmp3 handler:", e.response?.data ?? e.message ?? e)
    m.reply("❌ Error al descargar el audio. Intenta con otro link.")
  }
}

handler.command = /^ytmp3$/i
handler.help = ["ytmp3 <link>"]
handler.tags = ["descargas"]

export default handler