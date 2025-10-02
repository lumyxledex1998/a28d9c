let handler = async (m, { conn, text, participants, isBotAdmin, isAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) return conn.reply(m.chat, '🍙 ❌ Este comando solo funciona en grupos.', m, ctxErr)
  if (!isAdmin) return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '🍱 🚫 Necesito ser administradora para invitar.', m, ctxErr)

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 **Itsuki Nakano - Sistema de Invitaciones** 👥✨

🌟 ¡Como tutora organizada, puedo ayudarte a invitar personas al grupo!

📝 **Formas de uso:**
• !add 521234567890
• !add @tag (debe ser contacto)
• !add 521234567890,521234567891,521234567892

💡 **Ejemplos:**
• !add 51987654321
• !add 51999999999,51888888888,51777777777

🎯 **Características:**
✅ Invita múltiples números a la vez
📱 Genera enlace de invitación automático
👥 Notifica en el grupo
🍙 Estilo Itsuki educativo

🍱 ¡Hagamos crecer nuestra comunidad de aprendizaje! 📖✨
    `.trim(), m, ctxWarn)
  }

  try {
    // Extraer números del texto
    let numbers = text.split(',').map(num => {
      num = num.trim().replace(/[^0-9]/g, '')
      if (num.startsWith('0')) num = '52' + num // Si empieza con 0, asumir México
      if (!num.startsWith('521') && num.length === 10) num = '521' + num // Agregar 521 si falta
      return num.includes('@') ? num : num + '@s.whatsapp.net'
    }).filter(num => num.length > 5)

    if (numbers.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron números válidos.', m, ctxErr)
    }

    await conn.reply(m.chat, `🍙📱 Invitando ${numbers.length} persona(s)... 👥✨`, m, ctxOk)

    // Obtener enlace de invitación del grupo
    let groupCode = ''
    try {
      groupCode = await conn.groupInviteCode(m.chat)
    } catch (e) {
      return conn.reply(m.chat, '❌ No pude generar el enlace de invitación.', m, ctxErr)
    }

    const inviteLink = `https://chat.whatsapp.com/${groupCode}`
    const groupName = (await conn.groupMetadata(m.chat)).subject || 'este grupo'

    let successCount = 0
    let failCount = 0
    let results = []

    // Invitar a cada número
    for (const number of numbers) {
      try {
        // Verificar si el número es válido y enviar invitación
        await conn.sendMessage(number, {
          text: `🍙📚 *Invitación de Itsuki Nakano* ✨\n\n¡Hola! Has sido invitado/a a unirte a nuestro grupo de estudio:\n\n*${groupName}*\n\n🔗 *Enlace de invitación:*\n${inviteLink}\n\n📖 *"¡Únete a nuestra comunidad de aprendizaje!"* 🍱\n\n*Invitado por:* @${m.sender.split('@')[0]}`,
          mentions: [m.sender]
        })
        
        successCount++
        results.push(`✅ ${number.split('@')[0]}`)
        
        // Pequeña pausa para evitar spam
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        failCount++
        results.push(`❌ ${number.split('@')[0]} (${error.message})`)
      }
    }

    // Enviar resumen al grupo
    const summary = `🍙✅ **Resumen de Invitaciones** 📊✨

👥 *Total procesado:* ${numbers.length}
✅ *Éxitos:* ${successCount}
❌ *Fallos:* ${failCount}

📋 *Detalles:*
${results.join('\n')}

🔗 *Enlace del grupo:*
${inviteLink}

🍱 *"¡Las invitaciones han sido enviadas!"* 📖✨`

    await conn.reply(m.chat, summary, m, ctxOk)

    // Notificación adicional si hay muchos éxitos
    if (successCount > 0) {
      await conn.sendMessage(m.chat, {
        text: `🎉 *¡Invitaciones exitosas!*\n\nSe enviaron ${successCount} invitación(es) correctamente.\n\n📚 *"Espero que se unan nuevos miembros a nuestra comunidad de aprendizaje"* 🍙✨`,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: '👥 Invitaciones Completadas',
            body: `Itsuki Nakano - Sistema Grupal`,
            thumbnailUrl: 'https://i.imgur.com/8S5eC0v.png',
            sourceUrl: inviteLink,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      })
    }

  } catch (error) {
    console.error('Error en add:', error)
    await conn.reply(m.chat, 
      `❌ Error en el sistema de invitaciones\n\n` +
      `🍙 ¡Lo siento! Ocurrió un error al procesar las invitaciones.\n\n` +
      `🔧 Error: ${error.message}\n\n` +
      `📖 ¡Intenta con menos números o verifica los formatos! 🍱✨`,
      m, ctxErr
    )
  }
}

handler.help = ['add <número(s)>', 'invitar <número(s)>', 'invite <número(s)>']
handler.tags = ['owner']
handler.command = ['add', 'invitar', 'invite', 'agregar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler