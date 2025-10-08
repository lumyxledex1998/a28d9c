let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
  const ctxErr = global.rcanalx || {}
  const ctxWarn = global.rcanalw || {}
  const ctxOk = global.rcanalr || {}

  if (!text) {
    return conn.reply(m.chat, 
      `🍙📚 *ITSUKI - Invitar al Grupo* 🏘️\n\n` +
      `❌ Debes enviar un enlace de invitación\n\n` +
      `📝 *Uso:*\n${usedPrefix}${command} <link del grupo>\n\n` +
      `💡 *Ejemplo:*\n${usedPrefix}${command} https://chat.whatsapp.com/xxx\n\n` +
      `📖 "Envía el enlace para que pueda unirme"`, 
      m, ctxWarn
    )
  }

  let [_, code] = text.match(linkRegex) || []

  if (!code) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Enlace Inválido*\n\n` +
      `⚠️ El enlace no es válido\n\n` +
      `📝 *Formato correcto:*\nhttps://chat.whatsapp.com/XXXXX\n\n` +
      `📚 "Verifica que el enlace esté completo"`, 
      m, ctxErr
    )
  }

  try {
    // Intentar unirse al grupo directamente
    let result = await conn.groupAcceptInvite(code)
    
    await conn.reply(m.chat, 
      `🍙✅ *ITSUKI - Unida al Grupo* 🏘️✨\n\n` +
      `🎉 Me he unido exitosamente al grupo\n\n` +
      `📚 "¡Hola a todos! Estoy lista para ayudarles"\n` +
      `🍱 "¡Estudiemos juntos!"\n\n` +
      `✅ Grupo: ${result}`,
      m, ctxOk
    )
    
  } catch (e) {
    console.error('Error al unirse al grupo:', e)
    
    let errorMessage = `🍙❌ *ITSUKI - Error al Unirse*\n\n`
    
    if (e.message.includes('invite')) {
      errorMessage += `⚠️ El enlace de invitación no es válido\n\n`
    } else if (e.message.includes('full')) {
      errorMessage += `⚠️ El grupo está lleno\n\n`
    } else if (e.message.includes('already')) {
      errorMessage += `⚠️ Ya estoy en este grupo\n\n`
    } else if (e.message.includes('expired')) {
      errorMessage += `⚠️ El enlace ha expirado\n\n`
    } else {
      errorMessage += `⚠️ Error desconocido\n\n`
    }
    
    errorMessage += `📝 *Detalles:* ${e.message}\n\n`
    errorMessage += `🔗 *Enlace usado:* ${text}`
    
    await conn.reply(m.chat, errorMessage, m, ctxErr)
  }
}

handler.command = ['invite', 'join', 'unirse', 'entrar']
handler.tags = ['owner']
handler.help = ['invite <link>']

// Permisos modificados para que más usuarios puedan usar el comando
handler.owner = true
handler.group = false
handler.private = true

export default handler