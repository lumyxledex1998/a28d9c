let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text, isOwner }) => {
  const ctxErr = global.rcanalx || { contextInfo: { externalAdReply: { title: '❌ Error', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}
  const ctxWarn = global.rcanalw || { contextInfo: { externalAdReply: { title: '⚠️ Invitación', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}
  const ctxOk = global.rcanalr || { contextInfo: { externalAdReply: { title: '✅ Unido', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}

  // Solo el bot oficial responde (no sub-bots)
  if (conn.user.jid !== global.conn.user.jid) {
    return
  }

  if (!text) {
    return conn.reply(m.chat, 
      `🍙📚 *ITSUKI - Invitar al Grupo* 🏘️\n\n` +
      `❌ Debes enviar un enlace de invitación\n\n` +
      `📝 *Uso:*\n` +
      `${usedPrefix || '.'}invite <link del grupo>\n\n` +
      `💡 *Ejemplo:*\n` +
      `${usedPrefix || '.'}invite https://chat.whatsapp.com/xxx\n\n` +
      `📖 "Envía el enlace para que pueda unirme"`, 
      m, ctxWarn
    )
  }

  let [_, code] = text.match(linkRegex) || []

  if (!code) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Enlace Inválido*\n\n` +
      `⚠️ El enlace no es válido\n\n` +
      `📝 *Formato correcto:*\n` +
      `https://chat.whatsapp.com/XXXXX\n\n` +
      `📚 "Verifica que el enlace esté completo y correcto"`, 
      m, ctxErr
    )
  }

  if (isOwner) {
    await conn.groupAcceptInvite(code)
      .then(async res => {
        await conn.reply(m.chat, 
          `🍙✅ *ITSUKI - Unida al Grupo* 🏘️✨\n\n` +
          `🎉 Me he unido exitosamente al grupo\n\n` +
          `📚 "¡Hola a todos! Estoy lista para ayudarles"\n` +
          `🍱 "¡Estudiemos juntos!"`, 
          m, ctxOk
        )
      })
      .catch(async err => {
        await conn.reply(m.chat, 
          `🍙❌ *ITSUKI - Error al Unirse*\n\n` +
          `⚠️ No pude unirme al grupo\n\n` +
          `📝 *Posibles causas:*\n` +
          `• El enlace expiró\n` +
          `• El grupo está lleno\n` +
          `• Ya estoy en el grupo\n` +
          `• El enlace fue revocado\n\n` +
          `📚 "Verifica el enlace e intenta nuevamente"`, 
          m, ctxErr
        )
      })
  } else {
    // Cambia este número por el tuyo
    const ownerNumber = global.owner[0][0] || '1234567890'
    
    let message = 
      `🍙🏘️ *ITSUKI - Nueva Invitación a Grupo*\n\n` +
      `👤 *Solicitante:* @${m.sender.split('@')[0]}\n` +
      `🔗 *Enlace:* ${text}\n\n` +
      `📚 "Alguien quiere que me una a su grupo"\n` +
      `💡 Usa .invite <link> para aceptar`

    await conn.sendMessage(ownerNumber + '@s.whatsapp.net', { 
      text: message, 
      mentions: [m.sender] 
    }, { quoted: m })

    await conn.reply(m.chat, 
      `🍙📬 *ITSUKI - Invitación Enviada* ✨\n\n` +
      `✅ Tu invitación ha sido enviada al owner\n\n` +
      `📚 "El owner revisará tu solicitud"\n` +
      `⏰ "Espera su respuesta"\n\n` +
      `🍱 ¡Gracias por tu interés!`, 
      m, ctxOk
    )
  }
}

handler.help = ['invite']
handler.tags = ['main', 'tools']
handler.command = ['invite', 'join', 'unirse']
