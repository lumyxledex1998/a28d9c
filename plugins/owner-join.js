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

  if (isOwner) {
    try {
      await conn.groupAcceptInvite(code)
      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Unida al Grupo* 🏘️✨\n\n` +
        `🎉 Me he unido exitosamente al grupo\n\n` +
        `📚 "¡Hola a todos! Estoy lista para ayudarles"\n` +
        `🍱 "¡Estudiemos juntos!"`, 
        m, ctxOk
      )
    } catch (e) {
      await conn.reply(m.chat, 
        `🍙❌ *ITSUKI - Error al Unirse*\n\n` +
        `⚠️ No pude unirme al grupo\n\n` +
        `📝 *Posibles causas:*\n` +
        `• El enlace expiró\n` +
        `• El grupo está lleno\n` +
        `• Ya estoy en el grupo\n` +
        `• El enlace fue revocado\n\n` +
        `❌ Error: ${e.message}`, 
        m, ctxErr
      )
    }
  } else {
    const owner = (global.owner?.[0]?.[0] || '0')
    try {
      let message = 
        `🍙🏘️ *ITSUKI - Nueva Invitación a Grupo*\n\n` +
        `👤 *Solicitante:* @${m.sender.split('@')[0]}\n` +
        `🔗 *Enlace:* ${text}\n\n` +
        `📚 "Alguien quiere que me una a su grupo"\n` +
        `💡 Usa .invite <link> para aceptar`

      await conn.sendMessage(owner + '@s.whatsapp.net', { 
        text: message, 
        mentions: [m.sender] 
      })

      await conn.reply(m.chat, 
        `🍙📬 *ITSUKI - Invitación Enviada* ✨\n\n` +
        `✅ Tu invitación ha sido enviada al owner\n\n` +
        `📚 "El owner revisará tu solicitud"\n` +
        `⏰ "Espera su respuesta"\n\n` +
        `🍱 ¡Gracias por tu interés!`, 
        m, ctxOk
      )
    } catch (e) {
      await conn.reply(m.chat, 
        `🍙❌ Error al enviar invitación\n\n❌ ${e.message}`, 
        m, ctxErr
      )
    }
  }
}

handler.command = ['invite', 'join', 'unirse']
handler.tags = ['owner']
handler.help = ['invite <link>']

export default handler