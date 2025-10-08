import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
⚙️ *Uso del comando .cmd (multi-mensaje)*

Ejemplos:
.cmd text /msg=Hola /to=573001234567
.cmd image /url=https://telegra.ph/file/test.jpg /caption=Foto bonita
.cmd text /msg=Hola /to=120363XXXXXX@g.us
.cmd text /msg=Hola /to=573001234567 image /url=https://telegra.ph/file/test.jpg /caption=Foto bonita
.cmd text /msg=Hola location /lat=6.24 /lon=-75.58 /name=Medellín
`)
  }

  // --- dividir por tipos (text, image, audio, video, etc.) ---
  const parts = text.match(/(text|image|audio|video|sticker|location|contact)(?=\s|$)/gi)
  if (!parts) return m.reply('❌ No se detectó ningún tipo de mensaje válido.')

  const toMatch = text.match(/\/to=([^\s]+)/)
  const globalTo = toMatch
    ? (toMatch[1].includes('@') ? toMatch[1] : toMatch[1] + '@s.whatsapp.net')
    : m.chat

  let results = []

  for (let type of parts) {
    const regex = new RegExp(`${type}([^]*?)(?=(text|image|audio|video|sticker|location|contact|$))`, 'i')
    const section = text.match(regex)?.[1]?.trim() || ''
    const paramsArr = section
      .split(' ')
      .filter(p => p.startsWith('/'))
      .map(p => {
        const [key, ...rest] = p.slice(1).split('=')
        return [key, rest.join('=')]
      })
    const params = Object.fromEntries(paramsArr)

    const to = params.to
      ? (params.to.includes('@s.whatsapp.net') || params.to.includes('@g.us')
          ? params.to
          : params.to + '@s.whatsapp.net')
      : globalTo

    try {
      switch (type.toLowerCase()) {
        case 'text':
          await conn.sendMessage(to, { text: params.msg || '(sin mensaje)' })
          results.push('📝 Texto enviado')
          break

        case 'image':
          await conn.sendMessage(to, { image: { url: params.url }, caption: params.caption || '' })
          results.push('🖼️ Imagen enviada')
          break

        case 'audio':
          await conn.sendMessage(to, { audio: { url: params.url }, mimetype: 'audio/mp4', ptt: params.ptt === 'true' })
          results.push('🎵 Audio enviado')
          break

        case 'video':
          await conn.sendMessage(to, { video: { url: params.url }, caption: params.caption || '' })
          results.push('🎬 Video enviado')
          break

        case 'sticker':
          await conn.sendMessage(to, { sticker: { url: params.url } })
          results.push('💠 Sticker enviado')
          break

        case 'location':
          await conn.sendMessage(to, {
            location: {
              degreesLatitude: parseFloat(params.lat) || 0,
              degreesLongitude: parseFloat(params.lon) || 0,
              name: params.name || 'Ubicación'
            }
          })
          results.push('📍 Ubicación enviada')
          break

        case 'contact':
          await conn.sendMessage(to, {
            contacts: {
              displayName: params.name || 'Contacto',
              contacts: [
                {
                  displayName: params.name || 'Sin nombre',
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${params.name || 'Sin nombre'}\nTEL;type=CELL;type=VOICE;waid=${params.num || '000'}:${params.num || '000'}\nEND:VCARD`
                }
              ]
            }
          })
          results.push('📇 Contacto enviado')
          break
      }
    } catch (err) {
      console.error(err)
      results.push(`⚠️ Error al enviar ${type}: ${err.message}`)
    }
  }

  await m.reply(`✅ *Resultados del envío:*\n${results.join('\n')}`)
}

handler.command = /^cmd$/i
export default handler
