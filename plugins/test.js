import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
⚙️ *Uso del comando .cmd (multi-mensaje extendido con lista funcional)*

Ejemplos:
.cmd list /title=Menú principal /desc=Selecciona una opción /button=Ver opciones /list1=Perfil /list2=Ayuda /list3=Soporte
.cmd event /msg=Reunión en 10 min /time=10m
.cmd text /msg=Hola mundo
`)
  }

  const parts = text.match(/(text|image|audio|video|sticker|document|location|contact|button|list|poll|event)(?=\s|$)/gi)
  if (!parts) return m.reply('❌ No se detectó ningún tipo de mensaje válido.')

  const globalToMatch = text.match(/\/to=([^\s]+)/)
  const globalTo = globalToMatch
    ? (globalToMatch[1].includes('@') ? globalToMatch[1] : globalToMatch[1] + '@s.whatsapp.net')
    : m.chat

  let results = []

  for (let type of parts) {
    const regex = new RegExp(`${type}([^]*?)(?=(text|image|audio|video|sticker|document|location|contact|button|list|poll|event|$))`, 'i')
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

        case 'list': {
          // ✅ nuevo formato de lista (interactivo)
          const rows = []
          for (let i = 1; i <= 10; i++) {
            if (params[`list${i}`]) {
              rows.push({
                header: `Opción ${i}`,
                title: params[`list${i}`],
                id: `list_option_${i}`
              })
            }
          }

          if (rows.length === 0) {
            rows.push({ header: 'Sin opciones', title: 'Vacío', id: 'empty' })
          }

          const listMessage = {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: { text: params.desc || 'Selecciona una opción del menú' },
                  footer: { text: '📋 Lista generada automáticamente' },
                  header: {
                    title: params.title || 'Menú principal',
                    hasMediaAttachment: false
                  },
                  nativeFlowMessage: {
                    buttons: [
                      {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                          title: params.button || 'Ver opciones',
                          sections: [{ title: 'Opciones disponibles', rows }]
                        })
                      }
                    ]
                  }
                }
              }
            }
          }

          await conn.relayMessage(to, listMessage, {})
          results.push('📑 Lista interactiva enviada')
          break
        }

        case 'event': {
          const msg = params.msg || 'Evento sin mensaje'
          let delay = 0

          if (params.time) {
            const match = params.time.match(/(\d+)([smhd])/)
            if (match) {
              const value = parseInt(match[1])
              const unit = match[2]
              const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
              delay = value * (multipliers[unit] || 0)
            }
          }

          if (delay > 0) {
            setTimeout(async () => {
              await conn.sendMessage(to, { text: `⏰ *Evento:* ${msg}` })
            }, delay)
            results.push(`🕒 Evento programado en ${params.time}`)
          } else {
            await conn.sendMessage(to, { text: `⏰ *Evento inmediato:* ${msg}` })
            results.push('🕒 Evento enviado ahora')
          }
          break
        }

        default:
          await conn.sendMessage(to, { text: params.msg || '' })
          results.push(`📤 ${type} enviado (modo genérico)`)
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
