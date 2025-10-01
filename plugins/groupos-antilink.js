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
🍙📚 **Itsuki Nakano - Sistema Antilink Estricto** 🔗🚫

🌟 *¡Protección máxima activada! Enlaces no permitidos.*

⚙️ *Opciones de configuración:*
• ${usedPrefix}antilink activar
• ${usedPrefix}antilink desactivar
• ${usedPrefix}antilink estado

🚫 *Acciones automáticas:*
⚠️ Advertencia al usuario
🗑️ Eliminación del mensaje
🔴 Expulsión inmediata del grupo
📢 Notificación a administradores

🍱 *"¡Cero tolerancia con los enlaces no autorizados!"* 📖✨
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado persistente
    if (!global.antilinkStatus) global.antilinkStatus = {}
    if (!global.antilinkStatus[m.chat]) global.antilinkStatus[m.chat] = true

    switch (action) {
      case 'activar':
      case 'on':
      case 'enable':
        global.antilinkStatus[m.chat] = true
        await conn.reply(m.chat, 
          `🍙✅ *Antilink Estricto Activado*\n\n` +
          `📚 *"¡Protección máxima activada! Los enlaces no autorizados resultarán en expulsión inmediata."*\n\n` +
          `🔗 *Estado:* 🟢 ACTIVADO\n` +
          `🚫 *Modo:* Expulsión automática\n` +
          `🍱 *"¡El grupo ahora está bajo protección estricta!"* 📖✨`,
          m, ctxOk
        )
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        global.antilinkStatus[m.chat] = false
        await conn.reply(m.chat, 
          `🍙❌ *Antilink Desactivado*\n\n` +
          `📚 *"He desactivado el sistema antilink estricto. ¡Confío en su responsabilidad!"*\n\n` +
          `🔗 *Estado:* 🔴 DESACTIVADO\n` +
          `🚫 *Modo:* Permisivo\n` +
          `🍱 *"¡Por favor, mantengan el orden en el grupo!"* 📖✨`,
          m, ctxWarn
        )
        break

      case 'estado':
      case 'status':
      case 'state':
        const status = global.antilinkStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, 
          `🍙📊 *Estado del Antilink Estricto*\n\n` +
          `🔗 *Sistema:* ${status}\n` +
          `🚫 *Modo:* ${global.antilinkStatus[m.chat] ? 'EXPULSIÓN AUTOMÁTICA' : 'PERMISIVO'}\n` +
          `💬 *Grupo:* ${await conn.getName(m.chat) || 'Sin nombre'}\n\n` +
          `📚 *"Protección ${global.antilinkStatus[m.chat] ? 'activa con expulsión' : 'desactivada'}"* 🍱✨`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: activar, desactivar o estado', m, ctxErr)
    }
    return
  }

  // ===== DETECCIÓN AUTOMÁTICA DE ENLACES =====
  if (!m.isGroup) return
  if (!global.antilinkStatus) global.antilinkStatus = {}
  if (global.antilinkStatus[m.chat] === false) return
  
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

  // Excepciones
  const sender = m.sender
  if (isAdmin) return // Los admins pueden enviar enlaces
  if (sender === conn.user.jid) return

  try {
    const userName = await conn.getName(sender) || 'Usuario'
    const userMention = `@${sender.split('@')[0]}`

    // Mensaje de expulsión
    const expulsionMessage = 
      `🍙🚫 **Itsuki Nakano - Expulsión por Enlace** 📚🔗\n\n` +
      `👤 *Usuario expulsado:* ${userMention}\n` +
      `🏷️ *Nombre:* ${userName}\n` +
      `🔗 *Enlace detectado:* ${detectedLink}\n\n` +
      `📚 *"Como tutora estricta, debo aplicar las reglas del grupo. Los enlaces no autorizados resultan en expulsión inmediata."*\n\n` +
      `⚡ *Acción tomada:*\n` +
      `✅ Mensaje eliminado\n` +
      `🔴 Usuario expulsado\n` +
      `📢 Administradores notificados\n\n` +
      `🍱 *"Las reglas son claras y deben respetarse para mantener un ambiente de aprendizaje adecuado."* 📖✨`

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

    // 2. EXPULSAR AL USUARIO DEL GRUPO
    if (isBotAdmin) {
      await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
      
      // 3. Enviar mensaje de expulsión
      await conn.sendMessage(m.chat, { 
        text: expulsionMessage,
        mentions: [sender]
      })

      // 4. Notificar a administradores
      const admins = participants.filter(p => p.admin).map(p => p.id)
      if (admins.length > 0) {
        const adminAlert = 
          `📢 **Alerta de Expulsión - Administradores** 👑\n\n` +
          `🚫 *Usuario expulsado por enlace*\n` +
          `👤 *Expulsado:* ${userMention}\n` +
          `🔗 *Enlace:* ${detectedLink}\n` +
          `⏰ *Hora:* ${new Date().toLocaleTimeString()}\n` +
          `🤖 *Acción:* Automática por Itsuki\n\n` +
          `🍙 *"He aplicado la expulsión automática según las reglas establecidas."* 📚`

        await conn.sendMessage(m.chat, {
          text: adminAlert,
          mentions: admins
        })
      }

      // Log en consola
      console.log(`🔴 USUARIO EXPULSADO POR ENLACE:
👤 Usuario: ${sender} (${userName})
🔗 Enlace: ${detectedLink}
💬 Grupo: ${m.chat}
🕒 Hora: ${new Date().toLocaleString()}
      `)
    } else {
      // Si el bot no es admin, solo enviar advertencia
      await conn.reply(m.chat, 
        `⚠️ *Itsuki - Enlace Detectado*\n\n` +
        `👤 ${userMention} ha enviado un enlace\n` +
        `🔗 ${detectedLink}\n\n` +
        `❌ *Necesito ser administradora para expulsar*`,
        m, { mentions: [sender] }
      )
    }

  } catch (error) {
    console.error('❌ Error en antilink:', error)
    await conn.reply(m.chat, 
      `❌ *Error al procesar enlace*\n` +
      `🔧 ${error.message}`,
      m
    )
  }
}

// Detectar todos los mensajes
handler.before = async (m, { conn, isAdmin, isBotAdmin, participants }) => {
  if (m.isBaileys || !m.isGroup) return
  await handler(m, { conn, args: [], usedPrefix: '!', command: 'antilink_detection', isAdmin, isBotAdmin, participants })
}

handler.help = ['antilink <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antilink', 'antienlace']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler