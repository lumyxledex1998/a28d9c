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
• !add 51999999999

🎯 *Comparte el enlace manualmente*
    `.trim(), m, ctxWarn)
  }

  try {
    // Obtener enlace del grupo
    let groupCode = await conn.groupInviteCode(m.chat)
    let inviteLink = `https://chat.whatsapp.com/${groupCode}`
    let groupName = (await conn.groupMetadata(m.chat)).subject || 'el grupo'

    // Procesar número
    let number = text.trim().replace(/[^0-9]/g, '')
    
    // Formatear número
    if (number.startsWith('0')) number = '51' + number.substring(1)
    if (!number.startsWith('51') && number.length === 9) number = '51' + number
    if (number.length === 10 && number.startsWith('51')) number = '51' + number.substring(2)
    
    const fullNumber = number + '@s.whatsapp.net'

    // Verificar si el número existe en los contactos del bot
    try {
      const contact = await conn.onWhatsApp(fullNumber)
      if (contact && contact.length > 0 && contact[0].exists) {
        // Intentar enviar mensaje directo
        try {
          await conn.sendMessage(fullNumber, {
            text: `🍙📚 *Invitación de Itsuki Nakano*\n\n¡Hola! Te invitan a unirte al grupo:\n\n*${groupName}*\n\n🔗 ${inviteLink}\n\n*Invitado por:* @${m.sender.split('@')[0]}`,
            mentions: [m.sender]
          })
          return conn.reply(m.chat, 
            `✅ *Invitación enviada*\n\n` +
            `👤 *Para:* ${number}\n` +
            `🔗 *Enlace:* ${inviteLink}\n\n` +
            `📱 *Se envió al privado del número*`,
            m, ctxOk
          )
        } catch (sendError) {
          console.log('Error enviando mensaje:', sendError)
        }
      }
    } catch (contactError) {
      console.log('Error verificando contacto:', contactError)
    }

    // Si no se pudo enviar al privado, mostrar el enlace para compartir manualmente
    conn.reply(m.chat, 
      `🍙📱 *Enlace de Invitación*\n\n` +
      `👤 *Para:* ${number}\n` +
      `🏷️ *Grupo:* ${groupName}\n\n` +
      `🔗 *Enlace:* ${inviteLink}\n\n` +
      `📝 *Copia y comparte este enlace con la persona*` +
      `\\n\\n*O pídele que escanee este código QR:*`,
      m, ctxOk
    )

    // Generar y enviar código QR del enlace
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

  } catch (error) {
    console.error('Error en add:', error)
    conn.reply(m.chat, 
      `❌ *Error*\n\n` +
      `No se pudo generar la invitación.\n` +
      `Intenta obtener el enlace manualmente.`,
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