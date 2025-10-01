let handler = async (m, { conn, args, usedPrefix, command, isAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Verificar si es un comando de configuración
  if (['antiprivado', 'antiprivate', 'noprivado'].includes(command)) {
    if (!m.isGroup) return conn.reply(m.chat, '🍙 ❌ Este comando solo funciona en grupos.', m, ctxErr)
    if (!isAdmin) return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador.', m, ctxErr)
    
    const action = args[0]?.toLowerCase()
    
    if (!action) {
      return conn.reply(m.chat, `
🍙📚 **Itsuki Nakano - Sistema Antiprivado** 🚫📱

🌟 *¡No permito mensajes privados!*

⚙️ *Opciones:*
• ${usedPrefix}antiprivado activar
• ${usedPrefix}antiprivado desactivar
• ${usedPrefix}antiprivado estado

🚫 *Acciones:*
🔒 Bloqueo automático
⚠️ Mensaje de advertencia
📢 Notificación en grupos

🍱 *"¡Mi privado está reservado!"* 📖✨
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado
    if (!global.antiprivadoStatus) global.antiprivadoStatus = {}
    if (!global.antiprivadoStatus[m.chat]) global.antiprivadoStatus[m.chat] = true

    switch (action) {
      case 'activar':
      case 'on':
      case 'enable':
        global.antiprivadoStatus[m.chat] = true
        await conn.reply(m.chat, 
          `🍙✅ *Antiprivado Activado*\n\n` +
          `📚 *"¡Protección activada! Bloquearé a quien me escriba al privado."*\n\n` +
          `🚫 *Estado:* 🟢 ACTIVADO\n` +
          `🔒 *Modo:* Bloqueo automático\n` +
          `🍱 *"¡Privado protegido!"* 📖✨`,
          m, ctxOk
        )
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        global.antiprivadoStatus[m.chat] = false
        await conn.reply(m.chat, 
          `🍙❌ *Antiprivado Desactivado*\n\n` +
          `📚 *"Protección desactivada."*\n\n` +
          `🚫 *Estado:* 🔴 DESACTIVADO\n` +
          `🔒 *Modo:* Permisivo\n` +
          `🍱 *"¡Usen el grupo!"* 📖✨`,
          m, ctxWarn
        )
        break

      case 'estado':
      case 'status':
      case 'state':
        const status = global.antiprivadoStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, 
          `🍙📊 *Estado Antiprivado*\n\n` +
          `🚫 *Sistema:* ${status}\n` +
          `🔒 *Modo:* ${global.antiprivadoStatus[m.chat] ? 'BLOQUEO' : 'PERMISIVO'}\n` +
          `🍱 *"Protección ${global.antiprivadoStatus[m.chat] ? 'activa' : 'desactivada'}"* ✨`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida', m, ctxErr)
    }
    return
  }
}

// ===== DETECCIÓN Y BLOQUEO - VERSIÓN QUE SÍ FUNCIONA =====
handler.all = async (m, { conn }) => {
  // SOLO mensajes privados (no grupos, no del bot, no comandos)
  if (!m.isGroup && !m.isBaileys && m.chat.endsWith('@s.whatsapp.net') && !m.text.startsWith('!')) {
    
    console.log(`📱 MENSAJE PRIVADO RECIBIDO DE: ${m.sender}`)
    
    if (!global.antiprivadoStatus) global.antiprivadoStatus = {}
    
    let antiprivadoActive = false
    let grupoTarget = null
    
    try {
      // Buscar en todos los grupos
      const groups = await conn.groupFetchAllParticipating()
      console.log(`🔍 Buscando en ${Object.keys(groups).length} grupos...`)
      
      for (const groupId in groups) {
        const group = groups[groupId]
        const userInGroup = group.participants.find(p => p.id === m.sender)
        
        if (userInGroup && global.antiprivadoStatus[groupId]) {
          antiprivadoActive = true
          grupoTarget = groupId
          console.log(`✅ Usuario encontrado en grupo: ${group.subject} (${groupId})`)
          break
        }
      }
    } catch (error) {
      console.error('❌ Error buscando grupos:', error)
    }

    // SI ESTÁ EN ALGÚN GRUPO CON ANTIPRIVADO ACTIVADO
    if (antiprivadoActive && grupoTarget) {
      console.log(`🚫 BLOQUEANDO USUARIO: ${m.sender}`)
      
      try {
        const userName = await conn.getName(m.sender) || 'Usuario'
        
        // 1. ENVIAR MENSAJE DE BLOQUEO
        const bloqueoMsg = `🍙🚫 **Itsuki Nakano** 📚🔒\n\n` +
          `*¡No permito mensajes privados!*\n\n` +
          `🔒 *Has sido bloqueado automáticamente*\n` +
          `📱 *Razón:* Mensaje privado detectado\n\n` +
          `💬 *"Por favor, usa el grupo para tus consultas"*\n` +
          `🍱 *¡El aprendizaje es mejor en grupo!*`
        
        await conn.sendMessage(m.sender, { text: bloqueoMsg })
        console.log(`📨 Mensaje de bloqueo enviado a: ${userName}`)

        // 2. BLOQUEAR AL USUARIO
        await conn.updateBlockStatus(m.sender, 'block')
        console.log(`🔒 Usuario bloqueado: ${userName}`)

        // 3. NOTIFICAR EN EL GRUPO
        const grupoMsg = `🚫📱 **Usuario Bloqueado** 👤🔒\n\n` +
          `👤 *Usuario:* @${m.sender.split('@')[0]}\n` +
          `📱 *Motivo:* Mensaje privado al bot\n\n` +
          `💬 *"He bloqueado a este usuario por escribirme al privado."*\n` +
          `🍱 *"¡Recuerden usar el grupo para consultas!"*`
        
        await conn.sendMessage(grupoTarget, {
          text: grupoMsg,
          mentions: [m.sender]
        })
        console.log(`📢 Notificación enviada al grupo`)

        // 4. EVITAR QUE EL MENSAJE SE PROCESE
        return true

      } catch (error) {
        console.error('❌ Error en antiprivado:', error)
      }
    } else {
      console.log(`ℹ️ Usuario no está en grupo con antiprivado o está desactivado`)
    }
  }
}

handler.help = ['antiprivado <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antiprivado', 'antiprivate', 'noprivado']
handler.group = true
handler.admin = true

export default handler