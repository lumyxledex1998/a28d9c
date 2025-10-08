import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
⚙️ *Uso del comando .cmd (multi-mensaje)*

Ejemplos:
.cmd text /msg=Hola /to=573001234567
.cmd image /url=https://telegra.ph/file/test.jpg /caption=Foto bonita
.cmd audio /url=https://samplelib.com/lib/preview/mp3/sample-3s.mp3 /ptt=false
.cmd video /url=https://samplelib.com/lib/preview/mp4/sample-5s.mp4 /caption=Video cool
.cmd sticker /url=https://telegra.ph/file/test.webp
.cmd location /lat=6.24 /lon=-75.58 /name=Medellín
.cmd contact /name=Camilo /num=573001234567
.cmd document /url=https://example.com/test.pdf /filename=test.pdf
.cmd button /msg=Elige una opción /button1=Sí /button2=No
.cmd list /title=Opciones /desc=Selecciona /button=Ver /list1=Opción 1 /list2=Opción 2
.cmd poll /question=¿Te gusta Gura? /option1=Sí /option2=No
`)
  }

  const parts = text.match(/(text|image|audio|video|sticker|document|location|contact|button|list|poll)(?=\s|$)/gi)
  if (!parts) return m.reply('❌ No se detectó ningún tipo de mensaje válido.')

  const globalToMatch = text.match(/\/to=([^\s]+)/)
  const globalTo = globalToMatch
    ? (globalToMatch[1].includes('@') ? globalToMatch[1] : globalToMatch[1] + '@s.whatsapp.net')
    : m.chat

  let results = []

  for (let type of parts) {
    const regex = new RegExp(`${type}([^]*?)(?=(text|image|audio|video|sticker|document|location|contact|button|list|poll|$))`, 'i')
    const section = text.match(regex)?.[1]?.trim() || ''
    const paramsArr = section.split(' ').filter(p => p.startsWith('/')).map(p => {
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

        case 'document':
          await conn.sendMessage(to, { document: { url: params.url || 'https://example.com/dot.txt' }, fileName: params.filename || 'archivo.txt', mimetype: 'application/octet-stream' })
          results.push('📄 Documento enviado')
          break

        case 'location':
          await conn.sendMessage(to, {
            location: {
              degreesLatitude: parseFloat(params.lat) || 0,
              degreesLongitude: parseFloat(params.lon) || 0,
              name: params.name || 'Ubicación desconocida'
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

        case 'button':
          await conn.sendMessage(to, {
            text: params.msg || '',
            buttons: [
              { buttonId: 'id1', buttonText: { displayText: params.button1 || 'Opción 1' }, type: 1 },
              { buttonId: 'id2', buttonText: { displayText: params.button2 || 'Opción 2' }, type: 1 }
            ],
            headerType: 1
          })
          results.push('🔘 Botones enviados')
          break

        case 'list':
          await conn.sendMessage(to, {
            text: params.desc || 'Selecciona una opción',
            footer: '📋 Lista generada por .cmd',
            title: params.title || 'Menú',
            buttonText: params.button || 'Ver opciones',
            sections: [
              {
                title: 'Opciones',
                rows: [
                  { title: params.list1 || 'Opción 1' },
                  { title: params.list2 || 'Opción 2' },
                ]
              }
            ]
          })
          results.push('📑 Lista enviada')
          break

        case 'poll':
          await conn.sendMessage(to, {
            poll: {
              name: params.question || 'Encuesta',
              values: [params.option1 || 'Opción 1', params.option2 || 'Opción 2'],
              selectableCount: 1
            }
          })
          results.push('📊 Encuesta enviada')
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
