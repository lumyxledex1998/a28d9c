import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // REEMPLAZA ESTE NÚMERO CON EL TUYO (con código de país, sin +)
  const ownerNumber = "18493907272" // EJEMPLO: Cambia por "51987654321" (tu número)

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 **Itsuki Nakano - Sistema de Reportes** ✨📖

🌟 *¡Como tutora responsable, tomo muy en serio los reportes!*

📝 *Forma correcta de reportar:*
${usedPrefix + command} [descripción del error]

💡 *Ejemplos:*
• ${usedPrefix + command} El comando !menu no funciona
• ${usedPrefix + command} El bot no responde a !play
• ${usedPrefix + command} Error en el comando !sticker

🍱 *"¡Por favor, describe el error con detalles para poder estudiarlo y solucionarlo adecuadamente!"* 🎓
    `.trim(), m, ctxWarn)
  }

  // Información del usuario
  const userName = await conn.getName(m.sender) || 'No disponible'
  const userMention = `@${m.sender.split('@')[0]}`
  const chatType = m.isGroup ? `Grupo: ${await conn.getName(m.chat) || 'Sin nombre'}` : 'Chat privado'
  const commandUsed = m.text.split(' ')[0] || 'N/A'

  const fullReport = `🌟📚 **REPORTE DE ERROR - ITSUKI NAKANO** 🍙✨

👤 *Usuario:* ${userMention}
🏷️ *Nombre:* ${userName}
💬 *Lugar:* ${chatType}
🔧 *Comando usado:* ${commandUsed}

🐛 *Error Reportado:*
${text}

⏰ *Fecha:* ${new Date().toLocaleString()}

🍱 *"¡Reporte recibido! Estudiaré este error detenidamente."* 📖💫`

  try {
    // ENVIAR REPORTE DIRECTAMENTE AL PROPIETARIO
    const ownerJid = ownerNumber + '@s.whatsapp.net'
    
    await conn.sendMessage(
      ownerJid,  // Esto envía DIRECTAMENTE a tu número
      {
        text: fullReport,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: '🐛📚 Nuevo Reporte Recibido',
            body: 'Itsuki Nakano - Sistema de Tutoría',
            thumbnailUrl: 'https://files.catbox.moe/w491g3.jpg',
            sourceUrl: 'https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }
    )

    // Notificar al usuario que reportó
    await conn.reply(m.chat, 
      `🍙✨ *¡Reporte enviado con éxito!*\n\n` +
      `📚 *"Gracias por reportar el error. He notificado al desarrollador para que lo solucione."*\n\n` +
      `🎯 *Estado:* 📝 En revisión\n` +
      `👨‍💻 *Desarrollador notificado:* ✅\n\n` +
      `🍱 *¡El problema será estudiado!* 📖🌟`,
      m, ctxOk
    )

    // Log en consola
    console.log(`📨 REPORTE ENVIADO AL PROPIETARIO:
👤 De: ${m.sender} (${userName})
📝 Error: ${text}
📍 Chat: ${m.chat}
🕒 Hora: ${new Date().toLocaleString()}
    `)

  } catch (error) {
    console.error('❌ Error al enviar reporte:', error)
    await conn.reply(m.chat, 
      `❌📚 *¡Error al enviar el reporte!*\n\n` +
      `🍙 *"No pude enviar el reporte al desarrollador. Por favor, intenta más tarde."*\n\n` +
      `🔧 *Detalle:* ${error.message}\n` +
      `📖 *"¡Reportaré este fallo también!"* 🍱✨`,
      m, ctxErr
    )
  }
}

handler.help = ['reporte', 'report', 'bug', 'error <descripción>']
handler.tags = ['main']
handler.command = ['reporte', 'report', 'bug', 'error', 'reportar']
handler.private = false
handler.group = true

export default handler