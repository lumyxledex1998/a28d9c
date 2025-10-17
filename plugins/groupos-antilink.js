let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, participants }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Patrones de enlaces a detectar
  const linkPatterns = [
    /https?:\/\/[^\s]+/gi,
    /wa\.me\/[0-9]+/gi,
    /chat\.whatsapp\.com\/[A-Za-z0-9]+/gi,
    /www\.[^\s]+/gi,
    /t\.me\/[^\s]+/gi,
    /instagram\.com\/[^\s]+/gi,
    /facebook\.com\/[^\s]+/gi,
    /youtube\.com\/[^\s]+/gi,
    /twitter\.com\/[^\s]+/gi,
    /discord\.gg\/[^\s]+/gi,
    /tiktok\.com\/[^\s]+/gi
  ]

  // Verificar si es un comando de configuración
  if (['antilink', 'antienlace'].includes(command)) {
    if (!m.isGroup) return conn.reply(m.chat, '🍙 ❌ Este comando solo funciona en grupos.', m, ctxErr)
    if (!isAdmin) return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador para configurar el antilink.', m, ctxErr)

    const action = args[0]?.toLowerCase()

    if (!action) {
      return conn.reply(m.chat, `
🔗 **Sistema Antilink** 🚫

🌟 *Protección contra enlaces no autorizados*

⚙️ *Opciones de configuración:*
• ${usedPrefix}antilink activar
• ${usedPrefix}antilink desactivar
• ${usedPrefix}antilink estado

🚫 *Acciones automáticas:*
⚠️ Eliminación del mensaje con enlace
🗑️ Expulsión inmediata del usuario
👑 *Los administradores pueden enviar enlaces libremente*
🤖 *Los bots pueden enviar enlaces libremente*

✨ *"Manteniendo el grupo libre de enlaces no autorizados"*
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado persistente
    if (!global.antilinkStatus) global.antilinkStatus = {}
    if (!global.antilinkStatus[m.chat]) global.antilinkStatus[m.chat] = false

    switch (action) {
      case 'activar':
      case 'on':
      case 'enable':
        global.antilinkStatus[m.chat] = true
        await conn.reply(m.chat, 
          `✅ *Antilink Activado*\n\n` +
          `*Protección activada. Los usuarios que envíen enlaces serán eliminados inmediatamente.*\n\n` +
          `🔗 *Estado:* 🟢 ACTIVADO\n` +
          `🚫 *Acción:* Eliminación + Expulsión INMEDIATA\n` +
          `👑 *Admins:* Pueden enviar enlaces\n` +
          `🤖 *Bots:* Pueden enviar enlaces\n` +
          `✨ *El grupo ahora está protegido contra enlaces*`,
          m, ctxOk
        )
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        global.antilinkStatus[m.chat] = false
        await conn.reply(m.chat, 
          `✅ *Antilink Desactivado*\n\n` +
          `*He desactivado el sistema antilink. Los enlaces ahora están permitidos.*\n\n` +
          `🔗 *Estado:* 🔴 DESACTIVADO\n` +
          `🚫 *Modo:* Permisivo\n` +
          `✨ *Los enlaces ahora están permitidos en el grupo*`,
          m, ctxWarn
        )
        break

      case 'estado':
      case 'status':
      case 'state':
        const status = global.antilinkStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, 
          `📊 *Estado del Antilink*\n\n` +
          `🔗 *Sistema:* ${status}\n` +
          `🚫 *Acción:* ${global.antilinkStatus[m.chat] ? 'ELIMINACIÓN + EXPULSIÓN INMEDIATA' : 'PERMISIVO'}\n` +
          `👑 *Admins:* ${global.antilinkStatus[m.chat] ? 'PUEDEN ENVIAR ENLACES' : 'TODOS PUEDEN ENVIAR ENLACES'}\n` +
          `🤖 *Bots:* PUEDEN ENVIAR ENLACES\n` +
          `💬 *Grupo:* ${await conn.getName(m.chat) || 'Sin nombre'}\n\n` +
          `✨ *Protección ${global.antilinkStatus[m.chat] ? 'activa' : 'desactivada'}*`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: activar, desactivar o estado', m, ctxErr)
    }
    return
  }

  // ===== DETECCIÓN AUTOMÁTICA DE ENLACES =====
  if (command === 'antilink_detection') {
    if (!m.isGroup) return

    // VERIFICACIÓN CRÍTICA: Solo actuar si el antilink está ACTIVADO
    if (!global.antilinkStatus || global.antilinkStatus[m.chat] !== true) {
      return
    }

    const messageText = m.text || m.caption || ''
    let hasLink = false
    let detectedLink = ''

    for (const pattern of linkPatterns) {
      const matches = messageText.match(pattern)
      if (matches && matches.length > 0) {
        hasLink = true
        detectedLink = matches[0]
        break
      }
    }

    if (!hasLink) return

    const sender = m.sender

    // EXCEPCIONES - Quienes PUEDEN enviar enlaces:
    if (isAdmin) return
    if (sender.endsWith('@s.whatsapp.net')) return
    if (sender === conn.user.jid) return

    try {
      const userName = await conn.getName(sender) || 'Usuario'
      const groupName = await conn.getName(m.chat) || 'Grupo'

      // 1. Eliminar el mensaje con enlace
      if (isBotAdmin && m.key) {
        await conn.sendMessage(m.chat, { 
          delete: { 
            remoteJid: m.chat, 
            fromMe: false, 
            id: m.key.id, 
            participant: sender 
          } 
        }).catch(() => {})
      }

      // 2. Enviar advertencia y eliminar inmediatamente
      const warningMessage = `🚫 *¡ENLACE DETECTADO!*\n\n` +
        `👤 *Usuario:* @${sender.split('@')[0]}\n` +
        `🔗 *Enlace detectado:* ${detectedLink}\n` +
        `❌ *Acción:* Eliminado inmediatamente por enviar enlaces`

      await conn.sendMessage(m.chat, { 
        text: warningMessage, 
        mentions: [sender] 
      }, { quoted: m })

      // 3. Eliminar al usuario INMEDIATAMENTE
      if (isBotAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
      }

      // Log en consola
      console.log(`🔗 ENLACE DETECTADO Y USUARIO ELIMINADO:
👤 Usuario: ${sender} (${userName})
🔗 Enlace: ${detectedLink}
💬 Grupo: ${groupName}
🕒 Hora: ${new Date().toLocaleString()}
      `)

    } catch (error) {
      console.error('❌ Error en antilink:', error)
    }
  }
}

// Detectar todos los mensajes
handler.before = async (m, { conn, isAdmin, isBotAdmin, participants }) => {
  if (m.isBaileys || !m.isGroup) return

  // Solo procesar si el antilink está ACTIVADO para este grupo
  if (!global.antilinkStatus || global.antilinkStatus[m.chat] !== true) {
    return
  }

  await handler(m, { conn, args: [], usedPrefix: '!', command: 'antilink_detection', isAdmin, isBotAdmin, participants })
}

handler.help = ['antilink']
handler.tags = ['group']
handler.command = ['antilink', 'antienlace']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler