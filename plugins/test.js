import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) text = 'text /msg=' // fuerza un tipo por defecto

  const parts = text.match(/(text|image|audio|video|sticker|gif|document|location|contact|buttons|list|poll|reaction|note|event|aviso)(?=\s|$)/gi)
  if (!parts) return m.reply('⚠️ No se detectó ningún tipo de mensaje, se enviará texto vacío.'), await conn.sendMessage(m.chat, { text: '' })

  const globalToMatch = text.match(/\/to=([^\s]+)/)
  const globalTo = globalToMatch
    ? (globalToMatch[1].includes('@') ? globalToMatch[1] : globalToMatch[1] + '@s.whatsapp.net')
    : m.chat

  let results = []

  for (let type of parts) {
    const regex = new RegExp(`${type}([^]*?)(?=(text|image|audio|video|sticker|gif|document|location|contact|buttons|list|poll|reaction|note|event|aviso|$))`, 'i')
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
          results.push('📝 Texto enviado (vacío o con contenido)')
          break

        case 'image':
          await conn.sendMessage(to, { image: { url: params.url || 'https://telegra.ph/file/4c2f1a6e22fbe4e3b78dc.jpg' }, caption: params.caption || '' })
          results.push('🖼️ Imagen enviada (predeterminada si no hay URL)')
          break

        case 'audio':
          await conn.sendMessage(to, { audio: { url: params.url || 'https://file-examples.com/storage/fe6a3c3f8a8eab48a35d1c2/2017/11/file_example_MP3_700KB.mp3' }, mimetype: 'audio/mp4', ptt: params.ptt === 'true' })
          results.push('🎵 Audio enviado (predeterminado si no hay URL)')
          break

        case 'video':
        case 'gif':
          await conn.sendMessage(to, { video: { url: params.url || 'https://telegra.ph/file/2c7f035bfd31b216f7c75.mp4' }, caption: params.caption || '', gifPlayback: type === 'gif' })
          results.push(type === 'gif' ? '🎞️ GIF enviado' : '🎬 Video enviado')
          break

        case 'sticker':
          await conn.sendMessage(to, { sticker: { url: params.url || 'https://i.ibb.co/3d2z9qT/sample-sticker.webp' } })
          results.push('💠 Sticker enviado (por defecto si no hay URL)')
          break

        case 'document':
          await conn.sendMessage(to, { document: { url: params.url || 'https://file-examples.com/storage/fe6a3c3f8a8eab48a35d1c2/2017/10/file-example_PDF_1MB.pdf' }, mimetype: params.mimetype || 'application/pdf', fileName: params.name || 'archivo.pdf' })
          results.push('📄 Documento enviado (por defecto)')
          break

        case 'location':
          await conn.sendMessage(to, {
            location: {
              degreesLatitude: parseFloat(params.lat) || 6.24,
              degreesLongitude: parseFloat(params.lon) || -75.58,
              name: params.name || 'Ubicación predeterminada'
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
            footer: params.footer || '',
            buttons: [
              { buttonId: '1', buttonText: { displayText: params.btn1 || 'Opción 1' } },
              { buttonId: '2', buttonText: { displayText: params.btn2 || 'Opción 2' } }
            ],
            headerType: 1
          })
          results.push('🔘 Botones enviados')
          break

        case 'list':
          await conn.sendMessage(to, {
            text: params.msg || '',
            title: params.title || 'Menú',
            footer: params.desc || 'Selecciona una opción',
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
          results.push('🚨 Aviso enviado (vacío o con texto)')
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
