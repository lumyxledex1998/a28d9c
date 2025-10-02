let handler = async (m, { conn, text, isBotAdmin, isAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) return conn.reply(m.chat, '🍙 ❌ Este comando solo funciona en grupos.', m, ctxErr)
  if (!isAdmin) return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '🍱 🚫 Necesito ser administradora para generar el enlace.', m, ctxErr)

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 Itsuki Nakano - Sistema de Invitaciones

📝 Uso: !add <número>

💡 Ejemplos:
• !add 51987654321
• !add 51999999999,51888888888

🎯 Invita personas al grupo por WhatsApp
    `.trim(), m, ctxWarn)
  }

  try {
    // Obtener enlace de invitación del grupo
    let groupCode = await conn.groupInviteCode(m.chat)
    let inviteLink = `https://chat.whatsapp.com/${groupCode}`
    let groupName = (await conn.groupMetadata(m.chat)).subject || 'este grupo'

    // Procesar números
    let numbers = text.split(',').map(num => {
      num = num.trim().replace(/[^0-9]/g, '')
      if (num.startsWith('0')) num = '51' + num
      if (!num.startsWith('51') && num.length === 9) num = '51' + num
      return num.includes('@') ? num : num + '@s.whatsapp.net'
    }).filter(num => num.length > 5)

    if (numbers.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron números válidos.', m, ctxErr)
    }

    await conn.reply(m.chat, `🍙📱 Enviando ${numbers.length} invitación(es)...`, m, ctxOk)

    let successCount = 0
    let failCount = 0

    // Enviar invitaciones
    for (const number of numbers) {
      try {
        await conn.sendMessage(number, {
          text: `🍙📚 *Invitación de Itsuki Nakano*\n\n¡Hola! Has sido invitado/a a unirte al grupo:\n\n*${groupName}*\n\n🔗 ${inviteLink}\n\n*Invitado por:* @${m.sender.split('@')[0]}`,
          mentions: [m.sender]
        })
        successCount++
        // Esperar entre invitaciones
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        failCount++
        console.log(`Error invitando a ${number}:`, error.message)
      }
    }

    // Resultado final
    conn.reply(m.chat, 
      `🍙✅ Invitaciones enviadas\n\n` +
      `✅ Éxitos: ${successCount}\n` +
      `❌ Fallos: ${failCount}\n\n` +
      `🔗 ${inviteLink}`,
      m, ctxOk
    )

  } catch (error) {
    console.error('Error en add:', error)
    conn.reply(m.chat, '❌ Error al enviar invitaciones', m, ctxErr)
  }
}

handler.help = ['add <número>']
handler.tags = ['group']
handler.command = ['add', 'invitar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler