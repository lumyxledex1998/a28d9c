import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
⚙️ *Uso del comando .cmd*

Ejemplos:
.cmd text /msg=Hola /to=573001234567
.cmd image /url=https://telegra.ph/file/test.jpg /to=573001234567
.cmd audio /url=https://telegra.ph/file/test.mp3 /to=573001234567
.cmd video /url=https://telegra.ph/file/test.mp4 /to=573001234567
.cmd sticker /url=https://telegra.ph/file/test.webp /to=573001234567
.cmd location /lat=6.244 /lon=-75.581 /name=Medellin /to=573001234567
.cmd contact /name=Andres /num=573001234567 /to=573009876543

📍 También puedes usar grupos:
.cmd text /msg=Hola grupo! /to=Mi grupo
.cmd text /msg=Hola /to=12036302xxxx@g.us
`)
  }

  const [type, ...paramsArr] = text.trim().split(' ')
  const params = Object.fromEntries(
    paramsArr
      .filter(p => p.startsWith('/'))
      .map(p => {
        const [key, ...rest] = p.slice(1).split('=')
        return [key, rest.join('=')]
      })
  )

  let to

  // Detectar si es número, grupo o nombre de grupo
  if (params.to) {
    if (params.to.includes('@g.us')) {
      to = params.to // ID de grupo
    } else if (/^\d+$/.test(params.to)) {
      to = `${params.to}@s.whatsapp.net`
    } else {
      // Buscar grupo por nombre
      let chats = Object.values(conn.chats).filter(c => c.id.endsWith('@g.us'))
      let group = chats.find(g => (g.subject || '').toLowerCase().includes(params.to.toLowerCase()))
      to = group ? group.id : m.chat
    }
  } else {
    to = m.chat // si no se indica, usa el chat actual
  }

  try {
    switch (type) {
      case 'text':
        if (!params.msg) return m.reply('⚠️ Falta el parámetro /msg=')
        await conn.sendMessage(to, { text: params.msg })
        break

      case 'image':
        if (!params.url) return m.reply('⚠️ Falta /url=')
        await conn.sendMessage(to, { image: { url: params.url }, caption: params.caption || '' })
        break

      case 'audio':
        if (!params.url) return m.reply('⚠️ Falta /url=')
        await conn.sendMessage(to, { audio: { url: params.url }, mimetype: 'audio/mp4', ptt: params.ptt === 'true' })
        break

      case 'video':
        if (!params.url) return m.reply('⚠️ Falta /url=')
        await conn.sendMessage(to, { video: { url: params.url }, caption: params.caption || '' })
        break

      case 'sticker':
        if (!params.url) return m.reply('⚠️ Falta /url=')
        await conn.sendMessage(to, { sticker: { url: params.url } })
        break

      case 'location':
        if (!params.lat || !params.lon) return m.reply('⚠️ Faltan /lat= y /lon=')
        await conn.sendMessage(to, {
          location: {
            degreesLatitude: parseFloat(params.lat),
            degreesLongitude: parseFloat(params.lon),
            name: params.name || 'Ubicación'
          }
        })
        break

      case 'contact':
        if (!params.name || !params.num) return m.reply('⚠️ Faltan /name= y /num=')
        await conn.sendMessage(to, {
          contacts: {
            displayName: params.name,
            contacts: [{
              displayName: params.name,
              vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${params.name}\nTEL;type=CELL;type=VOICE;waid=${params.num}:${params.num}\nEND:VCARD`
            }]
          }
        })
        break

      default:
        return m.reply('❌ Tipo de mensaje no reconocido.\nUsa .cmd text, .cmd image, .cmd audio, etc.')
    }

    await m.reply(`✅ *Mensaje ${type} enviado correctamente a* ${to.includes('@g.us') ? 'grupo' : to.split('@')[0]}`)
  } catch (err) {
    console.error(err)
    await m.reply('❌ Error al ejecutar el comando.\n' + err.message)
  }
}

handler.command = /^cmd$/i
export default handler
