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
⚠️ Eliminación silenciosa del mensaje con enlace

✨ *"Manteniendo el grupo libre de enlaces no autorizados"*
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
          `✅ *Antilink Activado*\n\n` +
          `*Protección activada. Los enlaces no autorizados serán eliminados automáticamente.*\n\n` +
          `🔗 *Estado:* 🟢 ACTIVADO\n` +
          `🚫 *Modo:* Eliminación silenciosa\n` +
          `✨ *El grupo ahora está protegido contra enlaces*`,
          m, ctxOk
        )
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        global.antilinkStatus[m.chat] = false
        await conn.reply(m.chat, 
          `❌ *Antilink Desactivado*\n\n` +
          `*He desactivado el sistema antilink. Los enlaces ahora están permitidos.*\n\n` +
          `🔗 *Estado:* 🔴 DESACTIVADO\n` +
          `🚫 *Modo:* Permisivo\n` +
          `✨ *Por favor, mantengan el orden en el grupo*`,
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
          `🚫 *Modo:* ${global.antilinkStatus[m.chat] ? 'ELIMINACIÓN SILENCIOSA' : 'PERMISIVO'}\n` +
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

    // 1. Eliminar el mensaje con enlace (acción silenciosa)
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

    // Log en consola (solo para administradores del bot)
    console.log(`🔗 ENLACE DETECTADO Y ELIMINADO:
👤 Usuario: ${sender} (${userName})
🔗 Enlace: ${detectedLink}
💬 Grupo: ${m.chat}
🕒 Hora: ${new Date().toLocaleString()}
    `)

  } catch (error) {
    console.error('❌ Error en antilink:', error)
    // No enviar mensaje de error al grupo para evitar spam
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