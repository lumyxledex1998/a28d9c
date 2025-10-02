let handler = async (m, { conn, text, isBotAdmin, isAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) return conn.reply(m.chat, '🍙 ❌ Este comando solo funciona en grupos.', m, ctxErr)
  if (!isAdmin) return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '🍱 🚫 Necesito ser administradora.', m, ctxErr)

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 Itsuki Nakano - Invitar al Grupo

📝 *Uso:* !add <número>

💡 *Ejemplos:*
• !add 51987654321
• !add 51999999999,51888888888

🎯 *Agrega personas directamente al grupo*
    `.trim(), m, ctxWarn)
  }

  try {
    // Obtener enlace del grupo
    let groupCode = await conn.groupInviteCode(m.chat)
    let inviteLink = `https://chat.whatsapp.com/${groupCode}`
    let groupName = (await conn.groupMetadata(m.chat)).subject || 'el grupo'

    // Procesar múltiples números
    let numbers = text.split(',').map(num => {
      let number = num.trim().replace(/[^0-9]/g, '')

      // Formatear número
      if (number.startsWith('0')) number = '51' + number.substring(1)
      if (!number.startsWith('51') && number.length === 9) number = '51' + number
      if (number.length === 10 && number.startsWith('51')) number = '51' + number.substring(2)

      return number + '@s.whatsapp.net'
    }).filter(num => num.length > 5)

    if (numbers.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron números válidos.', m, ctxErr)
    }

    await conn.reply(m.chat, `🍙📱 Procesando ${numbers.length} número(s)... 👥`, m, ctxOk)

    let addedCount = 0
    let invitedCount = 0
    let failedCount = 0
    let results = []

    // Procesar cada número
    for (let number of numbers) {
      try {
        // Verificar si el número existe en WhatsApp
        const contact = await conn.onWhatsApp(number)
        if (contact && contact.length > 0 && contact[0].exists) {
          
          // INTENTO 1: Agregar directamente al grupo
          try {
            await conn.groupParticipantsUpdate(m.chat, [number], 'add')
            addedCount++
            results.push(`✅ ${number.split('@')[0]} (Agregado al grupo)`)
            
          } catch (addError) {
            // INTENTO 2: Enviar invitación al privado
            try {
              await conn.sendMessage(number, {
                text: `🍙📚 *Invitación de Itsuki Nakano*\n\n¡Hola! Has sido invitado/a a unirte al grupo:\n\n*${groupName}*\n\n🔗 ${inviteLink}\n\n*Invitado por:* @${m.sender.split('@')[0]}`,
                mentions: [m.sender]
              })
              invitedCount++
              results.push(`📨 ${number.split('@')[0]} (Invitación enviada)`)
              
            } catch (inviteError) {
              failedCount++
              results.push(`❌ ${number.split('@')[0]} (No se pudo invitar)`)
            }
          }
          
        } else {
          failedCount++
          results.push(`❌ ${number.split('@')[0]} (No en WhatsApp)`)
        }

        // Esperar un poco entre procesamientos para evitar spam
        await new Promise(resolve => setTimeout(resolve, 1500))

      } catch (error) {
        failedCount++
        results.push(`❌ ${number.split('@')[0]} (Error: ${error.message})`)
        console.log('Error procesando:', error)
      }
    }

    // Mostrar resultados
    let resultMessage = `🍙📊 *Resultado de Invitaciones*\n\n`

    if (addedCount > 0) {
      resultMessage += `✅ *Agregados al grupo:* ${addedCount}\n`
    }
    if (invitedCount > 0) {
      resultMessage += `📨 *Invitaciones enviadas:* ${invitedCount}\n`
    }
    if (failedCount > 0) {
      resultMessage += `❌ *Fallidos:* ${failedCount}\n`
    }

    resultMessage += `\n🔗 *Enlace del grupo:*\n${inviteLink}\n\n`

    // Mostrar detalles si hay pocos números
    if (numbers.length <= 5) {
      resultMessage += `📋 *Detalles:*\n${results.join('\n')}\n\n`
    }

    if (addedCount > 0 || invitedCount > 0) {
      resultMessage += `🎯 *"¡Invitaciones procesadas exitosamente!"* 🍙`
    } else {
      resultMessage += `📝 *"Usa el enlace para invitar manualmente"* 🍙`
    }

    await conn.reply(m.chat, resultMessage, m, ctxOk)

    // Si no se pudo agregar/invitar a nadie, mostrar QR
    if (addedCount === 0 && invitedCount === 0) {
      try {
        const qrCode = await conn.generateInviteQR(m.chat)
        if (qrCode && qrCode.qr) {
          await conn.sendMessage(m.chat, {
            image: { url: qrCode.qr },
            caption: `📱 *Código QR para unirse al grupo*`
          }, { quoted: m })
        }
      } catch (qrError) {
        console.log('Error generando QR:', qrError)
      }
    }

  } catch (error) {
    console.error('Error en add:', error)
    await conn.reply(m.chat, 
      `❌ *Error*\n\n` +
      `No se pudieron procesar las invitaciones.\n` +
      `Intenta con el enlace manual: ${await conn.groupInviteCode(m.chat).then(code => `https://chat.whatsapp.com/${code}`)}`,
      m, ctxErr
    )
  }
}

handler.help = ['add <número>']
handler.tags = ['group']
handler.command = ['add', 'invitar', 'invite']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler