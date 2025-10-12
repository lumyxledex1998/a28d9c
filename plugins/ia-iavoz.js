import fetch from 'node-fetch'
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('[💖] Escribe algo para hablar con IA.')

  const url = `https://api-adonix.ultraplus.click/ai/iavoz?apikey=${global.apikey}&q=${encodeURIComponent(text)}&voice=Esperanza`

  try {
   
    await conn.sendPresenceUpdate('recording', m.chat)

   
    const res = await fetch(url)
    if (!res.ok) throw new Error('Error al generar el audio.')

    const audioBuffer = await res.arrayBuffer()

    
    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

    
    await conn.sendPresenceUpdate('available', m.chat)

  } catch (e) {
    console.error(e)
    await conn.sendPresenceUpdate('available', m.chat)
    m.reply('> 👾 Ocurrió un error al generar la voz.')
  }
}

handler.help = ['iavoz']
handler.tags = ['ia']
handler.command = ['iavoz']

export default handler