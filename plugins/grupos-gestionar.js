let handler = async (m, { conn, isAdmin, isBotAdmin, text, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) {
    return conn.reply(m.chat, '🌸 ❌ Este comando solo funciona en grupos.', m, ctxErr)
  }

  if (!isAdmin) {
    return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador para usar este comando.', m, ctxErr)
  }

  if (!isBotAdmin) {
    return conn.reply(m.chat, '🍱 🚫 Necesito ser administradora para gestionar el grupo.', m, ctxErr)
  }

  const action = text?.toLowerCase()

  if (!action) {
    return conn.reply(m.chat, `
🍙📚 **Itsuki Nakano - Gestión de Grupo** 🔒🔓

🌟 *¡Como tutora responsable, puedo ayudar a gestionar la seguridad del grupo!*

⚙️ *Opciones disponibles:*
• ${usedPrefix}cerrargrupo
• ${usedPrefix}abrirgrupo
• ${usedPrefix}estadogrupo

🔒 *Cerrar Grupo:*
✅ Solo admins pueden enviar mensajes
🚫 Miembros normales no pueden escribir
🛡️ Mayor control y seguridad

🔓 *Abrir Grupo:*
✅ Todos pueden enviar mensajes
💬 Conversación libre y activa

🍱 *"¡Mantengamos un ambiente de aprendizaje ordenado!"* 📖✨
    `.trim(), m, ctxWarn)
  }

  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupName = groupMetadata.subject || 'el grupo'

    switch (action) {
      case 'cerrar':
      case 'close':
      case 'cerrargrupo':
      case 'lock':
        // Cerrar grupo - solo admins pueden enviar mensajes
        await conn.groupSettingUpdate(m.chat, 'announcement')
        
        await conn.reply(m.chat, 
          `🔒📚 **Itsuki Nakano - Grupo Cerrado** 🍙✨\n\n` +
          `🌸 *"¡He cerrado el grupo para mantener el orden!"*\n\n` +
          `📝 *Grupo:* ${groupName}\n` +
          `🚫 *Estado:* SOLO ADMINISTRADORES\n` +
          `👑 *Acción realizada por:* @${m.sender.split('@')[0]}\n\n` +
          `💡 *Ahora solo los administradores pueden enviar mensajes.*\n` +
          `🍱 *"¡El silencio ayuda a la concentración!"* 📖`,
          m, { mentions: [m.sender] }
        )
        break

      case 'abrir':
      case 'open':
      case 'abrirgrupo':
      case 'unlock':
        // Abrir grupo - todos pueden enviar mensajes
        await conn.groupSettingUpdate(m.chat, 'not_announcement')
        
        await conn.reply(m.chat, 
          `🔓📚 **Itsuki Nakano - Grupo Abierto** 🍙✨\n\n` +
          `🌸 *"¡He abierto el grupo para conversaciones libres!"*\n\n` +
          `📝 *Grupo:* ${groupName}\n` +
          `✅ *Estado:* TODOS PUEDEN ESCRIBIR\n` +
          `👑 *Acción realizada por:* @${m.sender.split('@')[0]}\n\n` +
          `💡 *Ahora todos los miembros pueden participar.*\n` +
          `🍱 *"¡La discusión enriquece el aprendizaje!"* 📖`,
          m, { mentions: [m.sender] }
        )
        break

      case 'estado':
      case 'status':
      case 'estadogrupo':
        // Ver estado actual del grupo
        const groupInfo = await conn.groupMetadata(m.chat)
        const estado = groupInfo.announce ? '🔒 CERRADO (Solo admins)' : '🔓 ABIERTO (Todos pueden escribir)'
        const participantes = groupInfo.participants.length
        const admins = groupInfo.participants.filter(p => p.admin).length
        
        await conn.reply(m.chat, 
          `📊📚 **Itsuki Nakano - Estado del Grupo** 🍙✨\n\n` +
          `📝 *Grupo:* ${groupName}\n` +
          `🔐 *Estado:* ${estado}\n` +
          `👥 *Miembros:* ${participantes}\n` +
          `👑 *Administradores:* ${admins}\n\n` +
          `🍱 *"¡Revisando el estado actual del grupo!"* 📖`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, 
          '❌📚 *Opción no válida*\n\n' +
          '🍙 *Usa:*\n' +
          `• ${usedPrefix}cerrargrupo\n` +
          `• ${usedPrefix}abrirgrupo\n` +
          `• ${usedPrefix}estadogrupo`,
          m, ctxErr
        )
    }

    // Log en consola
    console.log(`🔐 GRUPO ${action.toUpperCase()}: ${m.chat} por ${m.sender}`)

  } catch (error) {
    console.error('❌ Error en gestión de grupo:', error)
    await conn.reply(m.chat, 
      `❌📚 *Error al gestionar el grupo*\n\n` +
      `🍙 *"¡No pude completar la acción! Error: ${error.message}"*\n\n` +
      `📖 *"¡Tendré que estudiar más para mejorar!"* 🍱`,
      m, ctxErr
    )
  }
}

handler.help = ['cerrargrupo', 'abrirgrupo', 'estadogrupo']
handler.tags = ['group']
handler.command = ['cerrargrupo', 'abrirgrupo', 'estadogrupo', 'lockgroup', 'unlockgroup', 'groupstatus']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler