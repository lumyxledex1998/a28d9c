let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // REEMPLAZA CON TU NÚMERO (con código de país, sin +)
  const ownerNumber = "18493907272" // EJEMPLO: Cambia por "51987654321" (tu número)

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 **Itsuki Nakano - Sistema de Sugerencias** ✨🌟

🎯 *¡Como futura maestra, valoro mucho tus ideas para mejorar!*

📝 *Forma correcta de sugerir:*
${usedPrefix + command} [tu sugerencia]

💡 *Ejemplos de sugerencias:*
• ${usedPrefix + command} Podrían agregar más juegos educativos
• ${usedPrefix + command} Sería útil un comando de recordatorios
• ${usedPrefix + command} Me gustaría que tuviera más stickers de anime

🌟 *Tipos de sugerencias que acepto:*
✨ Nuevos comandos
📚 Funciones educativas
🎮 Juegos interactivos
🍱 Contenido de anime
🔧 Mejoras técnicas

🍙 *"¡Tus ideas son importantes para hacer del bot una mejor herramienta de aprendizaje!"* 📖💫
    `.trim(), m, ctxWarn)
  }

  // Información del usuario
  const userName = await conn.getName(m.sender) || 'No disponible'
  const userMention = `@${m.sender.split('@')[0]}`
  const chatType = m.isGroup ? `Grupo: ${await conn.getName(m.chat) || 'Sin nombre'}` : 'Chat privado'

  const suggestionReport = `🌟📚 **NUEVA SUGERENCIA - ITSUKI NAKANO** 🍙✨

👤 *Usuario:* ${userMention}
🏷️ *Nombre:* ${userName}
💬 *Lugar:* ${chatType}
⭐ *Tipo:* Sugerencia de mejora

💡 *Sugerencia:*
"${text}"

📊 *Estado:* 🟡 Pendiente de revisión
⏰ *Fecha:* ${new Date().toLocaleString()}

🍱 *"¡Una idea brillante! La estudiaré con atención para mejorar el sistema de tutoría."* 📖🎓`

  try {
    // ENVIAR SUGERENCIA DIRECTAMENTE AL PROPIETARIO
    const ownerJid = ownerNumber + '@s.whatsapp.net'
    
    await conn.sendMessage(
      ownerJid,
      {
        text: suggestionReport,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: '💡🌟 Nueva Sugerencia Recibida',
            body: 'Itsuki Nakano - Sistema de Mejoras',
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
      `🍙✨ *¡Sugerencia enviada con éxito!*\n\n` +
      `📚 *"¡Gracias por tu valiosa idea! Como futura maestra, aprecio mucho las sugerencias que ayudan a mejorar."*\n\n` +
      `💡 *Sugerencia registrada:*\n"${text}"\n\n` +
      `📊 *Estado:* 🟡 En revisión\n` +
      `👨‍💻 *Desarrollador notificado:* ✅\n\n` +
      `🍱 *"¡Estudiaré tu propuesta con mucho cuidado!"* 📖🌟`,
      m, ctxOk
    )

    // Log en consola
    console.log(`💡 NUEVA SUGERENCIA RECIBIDA:
👤 De: ${m.sender} (${userName})
💡 Sugerencia: ${text}
📍 Chat: ${m.chat}
🕒 Hora: ${new Date().toLocaleString()}
    `)

  } catch (error) {
    console.error('❌ Error al enviar sugerencia:', error)
    await conn.reply(m.chat, 
      `❌📚 *¡Error al enviar la sugerencia!*\n\n` +
      `🍙 *"No pude enviar tu brillante idea al desarrollador. ¡Por favor, inténtalo de nuevo más tarde!"*\n\n` +
      `📖 *"¡Me esforzaré más para que esto no vuelva a pasar!"* 🍱✨`,
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