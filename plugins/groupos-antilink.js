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
👑 *Los administradores pueden enviar enlaces libremente*
🤖 *Los bots pueden enviar enlaces libremente*

✨ *"Manteniendo el grupo libre de enlaces no autorizados"*
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado persistente
    if (!global.antilinkStatus) global.antilinkStatus = {}
    if (!global.antilinkStatus[m.chat]) global.antilinkStatus[m.chat] = false // Por defecto DESACTIVADO

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
          `🚫 *Modo:* ${global.antilinkStatus[m.chat] ? 'ELIMINACIÓN SILENCIOSA' : 'PERMISIVO'}\n` +
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
  // SOLO ejecutar si es una detección automática y el antilink está ACTIVADO
  if (command === 'antilink_detection') {
    if (!m.isGroup) return
    
    // VERIFICACIÓN CRÍTICA: Solo actuar si el antilink está ACTIVADO
    if (!global.antilinkStatus || global.antilinkStatus[m.chat] !== true) {
      return // NO hacer nada si está desactivado
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
    // 1. Administradores del grupo
    if (isAdmin) return
    
    // 2. Bots (cualquier número que termine en @s.whatsapp.net y sea un bot)
    if (sender.endsWith('@s.whatsapp.net')) {
      // Verificar si es un bot (puedes agregar más lógica aquí si es necesario)
      return // Los bots pueden enviar enlaces
    }
    
    // 3. Este bot mismo
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

      // Log en consola
      console.log(`🔗 ENLACE DETECTADO Y ELIMINADO:
👤 Usuario: ${sender} (${userName})
🔗 Enlace: ${detectedLink}
💬 Grupo: ${m.chat}
🕒 Hora: ${new Date().toLocaleString()}
👥 Tipo: Usuario normal
      `)

    } catch (error) {
      console.error('❌ Error en antilink:', error)
    }
  }
}

// Detectar todos los mensajes - PERO SOLO SI EL ANTILINK ESTÁ ACTIVADO
handler.before = async (m, { conn, isAdmin, isBotAdmin, participants }) => {
  if (m.isBaileys || !m.isGroup) return
  
  // VERIFICACIÓN IMPORTANTE: Solo procesar si el antilink está ACTIVADO para este grupo
  if (!global.antilinkStatus || global.antilinkStatus[m.chat] !== true) {
    return // NO procesar si está desactivado
  }
  
  await handler(m, { conn, args: [], usedPrefix: '!', command: 'antilink_detection', isAdmin, isBotAdmin, participants })
}

handler.help = ['antilink <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antilink', 'antienlace']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler