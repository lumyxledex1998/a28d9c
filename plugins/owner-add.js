let handler = async (m, { conn, text, isBotAdmin, isAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
  if (!isAdmin) return conn.reply(m.chat, '⚠️ Necesitas ser administrador.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '⚠️ Necesito ser administradora.', m, ctxErr)

  if (!text) {
    return conn.reply(m.chat, `
📝 **Uso del comando:**

• !add <número>
• !add @usuario
• !add (respondiendo a un mensaje)

💡 **Ejemplos:**
• !add 51987654321
• !add @usuario
• !add 51999999999,51888888888

🎯 **Funciones:**
✅ Agregar por número (sin contacto)
✅ Agregar mencionando usuario
✅ Agregar respondiendo a mensaje
✅ Múltiples números separados por coma
    `.trim(), m, ctxWarn)
  }

  try {
    // Obtener enlace del grupo
    let groupCode = await conn.groupInviteCode(m.chat)
    let inviteLink = `https://chat.whatsapp.com/${groupCode}`
    let groupName = (await conn.groupMetadata(m.chat)).subject || 'el grupo'

    let numbers = []
    
    // Caso 1: Si hay menciones en el mensaje
    if (m.mentionedJid && m.mentionedJid.length > 0) {
      numbers = m.mentionedJid
    }
    // Caso 2: Si es responder a un mensaje
    else if (m.quoted) {
      numbers = [m.quoted.sender]
    }
    // Caso 3: Si es texto con números
    else if (text) {
      numbers = text.split(',').map(num => {
        let number = num.trim().replace(/[^0-9]/g, '')
        
        // Formatear número correctamente
        if (number.startsWith('0')) number = number.substring(1)
        if (!number.startsWith('51') && number.length === 9) number = '51' + number
        if (number.length === 8) number = '51' + number
        
        return number.includes('@s.whatsapp.net') ? number : number + '@s.whatsapp.net'
      }).filter(num => {
        let cleanNum = num.replace('@s.whatsapp.net', '')
        return cleanNum.length >= 10 && cleanNum.length <= 15
      })
    }

    if (numbers.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron números válidos.', m, ctxErr)
    }

    await conn.reply(m.chat, `📱 Intentando agregar ${numbers.length} persona(s)...`, m, ctxOk)

    let addedCount = 0
    let failedCount = 0
    let results = []

    // Procesar cada número/usuario
    for (let number of numbers) {
      try {
        console.log('Procesando:', number)
        
        // Verificar si el número existe en WhatsApp
        const contact = await conn.onWhatsApp(number)
        
        if (contact && contact.length > 0 && contact[0].exists) {
          // Intentar agregar directamente al grupo
          try {
            await conn.groupParticipantsUpdate(m.chat, [number], 'add')
            addedCount++
            
            // Obtener nombre del usuario
            let userName = 'Usuario'
            try {
              const userInfo = await conn.fetchStatus(number).catch(() => null)
              if (userInfo && userInfo.status) userName = userInfo.status
            } catch {}
            
            results.push(`✅ ${number.split('@')[0]} (${userName})`)
            console.log('Usuario agregado exitosamente')
            
          } catch (addError) {
            console.log('Error al agregar:', addError)
            failedCount++
            
            // Proporcionar el enlace como alternativa
            results.push(`❌ ${number.split('@')[0]} (Envía el enlace manualmente)`)
          }

        } else {
          console.log('Número no existe en WhatsApp')
          failedCount++
          results.push(`❌ ${number.split('@')[0]} (No tiene WhatsApp)`)
        }

        // Esperar entre procesamientos para evitar límites
        await new Promise(resolve => setTimeout(resolve, 1500))

      } catch (error) {
        console.log('Error general:', error)
        failedCount++
        results.push(`❌ ${number.split('@')[0]} (Error)`)
      }
    }

    // Mostrar resultados
    let resultMessage = `📊 **Resultado de Invitaciones**\n\n`
    resultMessage += `✅ **Agregados exitosamente:** ${addedCount}\n`
    resultMessage += `❌ **No se pudieron agregar:** ${failedCount}\n\n`

    // Mostrar detalles de los resultados
    if (results.length > 0) {
      resultMessage += `📋 **Detalles:**\n${results.join('\n')}\n\n`
    }

    // Si hay fallos, mostrar el enlace para invitar manualmente
    if (failedCount > 0) {
      resultMessage += `🔗 **Enlace para invitar manualmente:**\n${inviteLink}\n\n`
      resultMessage += `💡 **Puedes:**\n`
      resultMessage += `• Compartir este enlace con las personas\n`
      resultMessage += `• Ellas pueden unirse haciendo clic en el enlace\n`
      resultMessage += `• No necesitan tenerte en sus contactos`
    }

    if (addedCount > 0) {
      resultMessage += `🎉 **¡Invitaciones procesadas!**`
    } else {
      resultMessage += `📝 **Usa el enlace para invitar manualmente**`
    }

    await conn.reply(m.chat, resultMessage, m, ctxOk)

  } catch (error) {
    console.error('Error general en add:', error)
    
    // Obtener enlace como respaldo
    let inviteLink = 'Error obteniendo enlace'
    try {
      const code = await conn.groupInviteCode(m.chat)
      inviteLink = `https://chat.whatsapp.com/${code}`
    } catch {}
    
    await conn.reply(m.chat, 
      `❌ **Error al procesar**\n\n` +
      `🔗 **Usa este enlace para invitar manualmente:**\n${inviteLink}\n\n` +
      `💡 **El enlace funciona incluso si no tienes a la persona en contactos**`,
      m, ctxErr
    )
  }
}

handler.help = ['add <número|@usuario|responder>']
handler.tags = ['group']
handler.command = ['add', 'invitar', 'invite', 'agregar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler