let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // ID DEL GRUPO DE SOPORTE
  const supportGroupId = "120363403185670214@g.us"

  if (!text) {
    return conn.reply(m.chat, `
📋 **Sistema de Sugerencias**

📝 **Forma correcta de sugerir:**
${usedPrefix + command} [tu sugerencia]

💡 **Ejemplos de sugerencias:**
• ${usedPrefix + command} Podrían agregar más juegos
• ${usedPrefix + command} Sería útil un comando de recordatorios
• ${usedPrefix + command} Me gustaría que tuviera más stickers

🌟 **Tipos de sugerencias:**
✨ Nuevos comandos
🎮 Juegos interactivos
🔧 Mejoras técnicas
📚 Funciones educativas

⚡ **Las sugerencias se envían al grupo de soporte**
    `.trim(), m, ctxWarn)
  }

  // Información del usuario
  const userName = await conn.getName(m.sender) || 'No disponible'
  const userMention = `@${m.sender.split('@')[0]}`
  const chatType = m.isGroup ? `Grupo: ${await conn.getName(m.chat) || 'Sin nombre'}` : 'Chat privado'

  const suggestionReport = `💡 **NUEVA SUGERENCIA RECIBIDA**

👤 **Usuario:** ${userMention}
🏷️ **Nombre:** ${userName}
💬 **Lugar:** ${chatType}
⭐ **Tipo:** Sugerencia de mejora

📝 **Sugerencia:**
"${text}"

📊 **Estado:** 🟡 Pendiente de revisión
⏰ **Fecha:** ${new Date().toLocaleString()}`

  try {
    // ENVIAR SUGERENCIA AL GRUPO DE SOPORTE
    await conn.sendMessage(
      supportGroupId,
      {
        text: suggestionReport,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: '💡 Nueva Sugerencia',
            body: 'Sistema de Mejoras',
            thumbnailUrl: 'https://files.catbox.moe/w491g3.jpg',
            sourceUrl: 'https://chat.whatsapp.com/CYKX0ZR6pWMHCXgBgVoTGA',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }
    )

    // Notificar al usuario que sugirió
    await conn.reply(m.chat, 
      `✅ *¡Sugerencia enviada con éxito!*\n\n` +
      `📋 *Tu sugerencia ha sido enviada al grupo de soporte.*\n\n` +
      `💡 **Sugerencia registrada:**\n"${text}"\n\n` +
      `📊 **Estado:** 🟡 En revisión\n` +
      `👥 **Enviado a:** Grupo de soporte\n\n` +
      `⚡ *El equipo la revisará pronto*`,
      m, ctxOk
    )

    // Log en consola
    console.log(`💡 NUEVA SUGERENCIA RECIBIDA:
👤 De: ${m.sender} (${userName})
💡 Sugerencia: ${text}
📍 Chat: ${m.chat}
🕒 Hora: ${new Date().toLocaleString()}
📬 Grupo Soporte: ${supportGroupId}
    `)

  } catch (error) {
    console.error('❌ Error al enviar sugerencia:', error)
    await conn.reply(m.chat, 
      `❌ *¡Error al enviar la sugerencia!*\n\n` +
      `No pude enviar tu sugerencia al grupo de soporte.\n\n` +
      `🔧 **Detalle:** ${error.message}\n` +
      `📝 **Intenta nuevamente en unos minutos**`,
      m, ctxErr
    )
  }
}

handler.help = ['sugerencia', 'sugerir', 'idea', 'suggestion <texto>']
handler.tags = ['main']
handler.command = ['sugerencia', 'sugerir', 'idea', 'suggestion', 'propuesta']
handler.private = false
handler.group = true

export default handler