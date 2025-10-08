import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  // Si no hay texto, mostrar menú completo de ejemplos
  if (!text) {
    return m.reply(`
⚙️ *Comando .cmd (multi-mensaje)*

Usos posibles:

📝 Texto:
.cmd text /msg=Hola /to=573001234567

🖼️ Imagen:
.cmd image /url=https://telegra.ph/file/test.jpg /caption=Foto

🎵 Audio:
.cmd audio /url=https://telegra.ph/file/test.mp3 /ptt=true

🎬 Video:
.cmd video /url=https://telegra.ph/file/test.mp4 /caption=Video cool

💠 Sticker:
.cmd sticker /url=https://telegra.ph/file/test.webp

📄 Documento:
.cmd document /to=573001234567

📍 Ubicación:
.cmd location /lat=6.24 /lon=-75.58 /name=Medellín

📇 Contacto:
.cmd contact /name=Andrés /num=573001234567

🔘 Botones:
.cmd buttons /text=¿Te gusta Senku? /btn1=Sí /btn2=No

📋 Lista:
.cmd list /title=Opciones /btn1=Ver menú /btn2=Ayuda

📊 Encuesta:
.cmd poll /title=¿Qué prefieres? /opt1=Fútbol /opt2=Baloncesto /opt3=Ajedrez

🎙️ Nota de voz:
.cmd note /url=https://telegra.ph/file/test.mp3

📅 Evento:
.cmd event /name=Entrenamiento /time=8:00AM /place=Cancha

🚨 Aviso:
.cmd aviso /msg=El servidor se reiniciará pronto

💬 Reacción:
.cmd reaction /emoji=🔥

Ejemplo combinado:
.cmd text /msg=Hola image /url=https://telegra.ph/file/test.jpg
`)
  }

  // --- detectar tipos ---
  const parts = text.match(/(text|image|audio|video|sticker|document|location|contact|buttons|list|poll|reaction|note|event|aviso)(?=\s|$)/gi)
  if (!parts) return m.reply('⚠️ No se detectó ningún tipo de mensaje válido.')

  const toMatch = text.match(/\/to=([^\s]+)/)
  const globalTo = toMatch
    ? (toMatch[1].includes('@') ? toMatch[1] : `${toMatch[1]}@s.whatsapp.net`)
    : m.chat

  let results = []

  for (let type of parts) {
    const regex = new RegExp(`${type}([^]*?)(?=(text|image|audio|video|sticker|document|location|contact|buttons|list|poll|reaction|note|event|aviso|$))`, 'i')
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
          await conn.sendMessage(to, { text: params.msg || '' })
          results.push('📝 Texto enviado')
          break

        case 'image':
          await conn.sendMessage(to, { image: { url: params.url || 'https://telegra.ph/file/4c2f1a6e22fbe4e3b78dc.jpg' }, caption: params.caption || '' })
          results.push('🖼️ Imagen enviada')
          break

        case 'audio':
          await conn.sendMessage(to, { audio: { url: params.url || 'https://file-examples.com/storage/fe6a3c3f8a8eab48a35d1c2/2017/11/file_example_MP3_700KB.mp3' }, mimetype: 'audio/mp4', ptt: params.ptt === 'true' })
          results.push('🎵 Audio enviado')
          break

        case 'video':
          await conn.sendMessage(to, { video: { url: params.url || 'https://telegra.ph/file/2c7f035bfd31b216f7c75.mp4' }, caption: params.caption || '' })
          results.push('🎬 Video enviado')
          break

        case 'sticker':
          await conn.sendMessage(to, { sticker: { url: params.url || 'https://i.ibb.co/3d2z9qT/sample-sticker.webp' } })
          results.push('💠 Sticker enviado')
          break

        case 'document':
          const path = './temp_doc.txt'
          fs.writeFileSync(path, '.')
          await conn.sendMessage(to, { document: { url: path }, mimetype: 'text/plain', fileName: 'documento.txt' })
          fs.unlinkSync(path)
          results.push('📄 Documento generado y enviado (.txt con punto)')
          break

        case 'location':
          await conn.sendMessage(to, {
            location: {
              degreesLatitude: parseFloat(params.lat) || 6.24,
              degreesLongitude: parseFloat(params.lon) || -75.58,
              name: params.name || 'Ubicación genérica'
            }
          })
          results.push('📍 Ubicación enviada')
          break

        case 'contact':
          await conn.sendMessage(to, {
            contacts: {
              displayName: params.name || 'Contacto genérico',
              contacts: [
                {
                  displayName: params.name || 'Sin nombre',
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${params.name || 'Sin nombre'}\nTEL;type=CELL;type=VOICE;waid=${params.num || '573000000000'}:${params.num || '573000000000'}\nEND:VCARD`
                }
              ]
            }
          })
          results.push('📇 Contacto enviado')
          break

        case 'buttons':
          await conn.sendMessage(to, {
            text: params.text || '',
            footer: params.footer || 'Senku Bot ⚙️',
            buttons: [
              { buttonId: 'yes', buttonText: { displayText: params.btn1 || 'Sí' }, type: 1 },
              { buttonId: 'no', buttonText: { displayText: params.btn2 || 'No' }, type: 1 }
            ],
            headerType: 1
          })
          results.push('🔘 Botones enviados')
          break

        case 'list':
          await conn.sendMessage(to, {
            text: params.msg || '',
            title: params.title || 'Menú Senku',
            footer: params.desc || 'Selecciona una opción:',
            buttonText: 'Abrir',
            sections: [
              {
                title: params.title || 'Opciones',
                rows: [
                  { title: params.btn1 || 'Opción 1', rowId: '1' },
                  { title: params.btn2 || 'Opción 2', rowId: '2' }
                ]
              }
            ]
          })
          results.push('📋 Lista enviada')
          break

        case 'poll':
          await conn.sendMessage(to, {
            poll: {
              name: params.title || 'Encuesta sin título',
              values: [params.opt1, params.opt2, params.opt3].filter(Boolean)
            }
          })
          results.push('📊 Encuesta enviada')
          break

        case 'reaction':
          await conn.sendMessage(to, { react: { text: params.emoji || '👍', key: m.key } })
          results.push('💬 Reacción enviada')
          break

        case 'note':
          await conn.sendMessage(to, { audio: { url: params.url || 'https://file-examples.com/storage/fe6a3c3f8a8eab48a35d1c2/2017/11/file_example_MP3_700KB.mp3' }, mimetype: 'audio/ogg; codecs=opus', ptt: true })
          results.push('🎙️ Nota de voz enviada')
          break

        case 'event':
          await conn.sendMessage(to, { text: `📅 *Evento:* ${params.name || 'Sin nombre'}\n🕒 ${params.time || 'Sin hora'}\n📍 ${params.place || 'Lugar no especificado'}` })
          results.push('📅 Evento enviado')
          break

        case 'aviso':
          await conn.sendMessage(to, { text: `🚨 *Aviso importante:*\n${params.msg || ''}` })
          results.push('🚨 Aviso enviado')
          break
      }
    } catch (err) {
      console.error(err)
      results.push(`⚠️ Error en ${type}: ${err.message}`)
    }
  }

  await m.reply(`✅ *Resultados del envío:*\n${results.join('\n')}`)
}

handler.command = /^cmd$/i
export default handler
