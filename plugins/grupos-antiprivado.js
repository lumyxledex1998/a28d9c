let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner, isROwner }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // ==================== COMANDOS DE ANTIPRIVADO ====================
  if (['antiprivado', 'antiprivate', 'noprivado'].includes(command)) {
    
    const action = args[0]?.toLowerCase()

    // ⭐ VERIFICAR SI ES OWNER (para activar globalmente) ⭐
    const esOwner = isOwner || isROwner || m.fromMe

    // Si está en grupo, requiere admin
    if (m.isGroup && !isAdmin && !esOwner) {
      return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador para usar este comando en grupos.', m, ctxErr)
    }

    // Si es privado, solo el owner puede usar
    if (!m.isGroup && !esOwner) {
      return conn.reply(m.chat, '👑 ❌ Solo el owner puede usar este comando en privado.', m, ctxErr)
    }

    if (!action) {
      const tipoActivacion = m.isGroup ? 'en este grupo' : 'GLOBALMENTE (todo el bot)'
      return conn.reply(m.chat, `
🍙📚 **Itsuki Nakano - Sistema Antiprivado** 🚫📱

${m.isGroup ? '📍 *Modo:* Grupo' : '🌐 *Modo:* GLOBAL (Todo el bot)'}

⚙️ *Opciones:*
• ${usedPrefix}antiprivado activar
• ${usedPrefix}antiprivado desactivar
• ${usedPrefix}antiprivado estado

🚫 *Acciones:*
🔒 Bloqueo automático
⚠️ Mensaje de advertencia
📢 Notificación ${m.isGroup ? 'en el grupo' : 'al owner'}

📢 *Canal Oficial:* ${global.canalOficial || 'No configurado'}

🍱 *"¡Mi privado está reservado!"* 📖✨

💡 *Tip:* Usa ${usedPrefix}setcanal <enlace> para configurar el canal
${!m.isGroup ? '\n⚠️ *NOTA:* Activar aquí bloqueará TODOS los privados del bot' : ''}
      `.trim(), m, ctxWarn)
    }

    // Inicializar sistemas
    if (!global.antiprivadoStatus) global.antiprivadoStatus = {}
    if (!global.antiprivadoGlobal) global.antiprivadoGlobal = false

    switch (action) {
      case 'activar':
      case 'on':
      case 'enable':
        if (m.isGroup) {
          // Activar en grupo específico
          global.antiprivadoStatus[m.chat] = true
          await conn.reply(m.chat, 
            `🍙✅ *Antiprivado Activado en Este Grupo*\n\n` +
            `📚 *"¡Protección activada! Bloquearé a los miembros de este grupo que me escriban al privado."*\n\n` +
            `🚫 *Estado:* 🟢 ACTIVADO\n` +
            `🔒 *Modo:* Bloqueo automático\n` +
            `📍 *Alcance:* Solo miembros de este grupo\n` +
            `📢 *Canal:* ${global.canalOficial || 'No configurado'}\n\n` +
            `🍱 *"¡Privado protegido!"* 📖✨`,
            m, ctxOk
          )
        } else {
          // Activar GLOBALMENTE (todo el bot)
          global.antiprivadoGlobal = true
          await conn.reply(m.chat, 
            `🍙✅ *Antiprivado GLOBAL Activado*\n\n` +
            `📚 *"¡Protección TOTAL activada! Bloquearé a CUALQUIERA que me escriba al privado."*\n\n` +
            `🚫 *Estado:* 🟢 ACTIVADO GLOBAL\n` +
            `🔒 *Modo:* Bloqueo automático\n` +
            `🌐 *Alcance:* TODO EL BOT\n` +
            `📢 *Canal:* ${global.canalOficial || 'No configurado'}\n\n` +
            `⚠️ *IMPORTANTE:* Esto bloqueará a TODOS los que escriban al privado\n` +
            `👑 *Tú (owner) puedes seguir usando el privado*\n\n` +
            `🍱 *"¡Modo máxima protección!"* 📖✨`,
            m, ctxOk
          )
        }
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        if (m.isGroup) {
          global.antiprivadoStatus[m.chat] = false
          await conn.reply(m.chat, 
            `🍙❌ *Antiprivado Desactivado en Este Grupo*\n\n` +
            `📚 *"Protección desactivada en este grupo."*\n\n` +
            `🚫 *Estado:* 🔴 DESACTIVADO\n` +
            `🔒 *Modo:* Permisivo\n` +
            `🍱 *"¡Usen el grupo!"* 📖✨`,
            m, ctxWarn
          )
        } else {
          global.antiprivadoGlobal = false
          await conn.reply(m.chat, 
            `🍙❌ *Antiprivado GLOBAL Desactivado*\n\n` +
            `📚 *"Protección global desactivada."*\n\n` +
            `🚫 *Estado:* 🔴 DESACTIVADO GLOBAL\n` +
            `🔒 *Modo:* Permisivo\n` +
            `🍱 *"¡Privados permitidos!"* 📖✨`,
            m, ctxWarn
          )
        }
        break

      case 'estado':
      case 'status':
      case 'state':
        const statusGlobal = global.antiprivadoGlobal ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        const statusGrupo = m.isGroup ? (global.antiprivadoStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO') : 'N/A'
        const gruposActivos = Object.keys(global.antiprivadoStatus || {}).filter(k => global.antiprivadoStatus[k]).length
        const numerosPermitidosCount = (global.numerosPermitidos || []).length
        
        await conn.reply(m.chat, 
          `🍙📊 *Estado del Antiprivado*\n\n` +
          `🌐 *Global (Todo el bot):* ${statusGlobal}\n` +
          (m.isGroup ? `📍 *En este grupo:* ${statusGrupo}\n` : '') +
          `👥 *Grupos con antiprivado:* ${gruposActivos}\n` +
          `✅ *Números permitidos:* ${numerosPermitidosCount}\n` +
          `📢 *Canal:* ${global.canalOficial || 'No configurado'}\n\n` +
          `🔒 *Modo activo:* ${global.antiprivadoGlobal ? 'GLOBAL 🌐' : (gruposActivos > 0 ? 'POR GRUPOS 📍' : 'NINGUNO ❌')}\n\n` +
          `🍱 *"Sistema de protección operando"* ✨`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: activar, desactivar o estado', m, ctxErr)
    }
    return
  }

  // ==================== COMANDO SETCANAL ====================
  if (['setcanal', 'configurarcanal'].includes(command)) {
    const esOwner = isOwner || isROwner || m.fromMe
    
    if (!esOwner) {
      return conn.reply(m.chat, '👑 ❌ Solo el owner puede configurar el canal', m, ctxErr)
    }

    const canal = args.join(' ').trim()
    if (!canal) {
      return conn.reply(m.chat, 
        `📢 *Configurar Canal Oficial*\n\n` +
        `Uso: ${usedPrefix}setcanal <enlace del canal>\n` +
        `Ejemplo: ${usedPrefix}setcanal https://whatsapp.com/channel/xxx\n\n` +
        `🔗 *Canal actual:* ${global.canalOficial || 'No configurado'}`,
        m, ctxWarn
      )
    }

    global.canalOficial = canal
    await conn.reply(m.chat, 
      `✅ *Canal Configurado*\n\n` +
      `📢 *Nuevo canal:* ${canal}\n\n` +
      `Este enlace se mostrará en los mensajes de antiprivado.`,
      m, ctxOk
    )
    return
  }

  // ==================== COMANDO PERMITIR ====================
  if (['permitir', 'whitelist', 'permitirnumero'].includes(command)) {
    const esOwner = isOwner || isROwner || m.fromMe
    
    if (!esOwner) {
      return conn.reply(m.chat, '👑 ❌ Solo el owner puede usar este comando', m, ctxErr)
    }

    if (!global.numerosPermitidos) global.numerosPermitidos = []

    const numero = args[0]?.replace(/[^0-9]/g, '')
    
    if (!numero) {
      const lista = global.numerosPermitidos.length > 0 
        ? global.numerosPermitidos.map((n, i) => `${i + 1}. +${n}`).join('\n')
        : 'Ninguno'
        
      return conn.reply(m.chat, 
        `✅ *Lista de Números Permitidos*\n\n` +
        `📱 *Números en lista blanca:*\n${lista}\n\n` +
        `💡 *Uso:* ${usedPrefix}permitir <número>\n` +
        `📝 *Ejemplo:* ${usedPrefix}permitir 5218123456789`,
        m, ctxWarn
      )
    }

    if (global.numerosPermitidos.includes(numero)) {
      return conn.reply(m.chat, `⚠️ El número +${numero} ya está en la lista blanca`, m, ctxWarn)
    }

    global.numerosPermitidos.push(numero)
    await conn.reply(m.chat, 
      `✅ *Número Agregado a Lista Blanca*\n\n` +
      `📱 *Número:* +${numero}\n` +
      `🔓 Este número puede escribir al privado sin ser bloqueado`,
      m, ctxOk
    )
    return
  }
}

// ==================== SISTEMA DE BLOQUEO AUTOMÁTICO ====================
handler.all = async function (m, { conn, isOwner, isROwner }) {
  // SOLO mensajes privados (no grupos, no del bot mismo)
  if (m.isGroup || m.isBaileys || !m.chat.endsWith('@s.whatsapp.net')) return
  if (m.text?.startsWith('.') || m.text?.startsWith('!') || m.text?.startsWith('/')) return

  console.log(`📱 [ANTIPRIVADO] Mensaje privado de: ${m.sender}`)

  // ⭐ PERMITIR AL OWNER/CREADOR SIEMPRE ⭐
  if (isOwner || isROwner || m.fromMe) {
    console.log(`👑 [ANTIPRIVADO] Mensaje del owner/creador - PERMITIDO`)
    return false
  }

  // Verificar si está en la lista de números permitidos
  if (!global.numerosPermitidos) global.numerosPermitidos = []
  const numeroUsuario = m.sender.split('@')[0]
  
  if (global.numerosPermitidos.includes(numeroUsuario)) {
    console.log(`✅ [ANTIPRIVADO] Usuario en lista blanca - PERMITIDO: ${numeroUsuario}`)
    return false
  }

  // Inicializar sistemas
  if (!global.antiprivadoStatus) global.antiprivadoStatus = {}
  if (!global.antiprivadoGlobal) global.antiprivadoGlobal = false
  if (!global.bloqueadosPorAntiprivado) global.bloqueadosPorAntiprivado = new Set()

  // Si ya fue bloqueado antes, ignorar
  if (global.bloqueadosPorAntiprivado.has(m.sender)) {
    console.log(`⏭️ [ANTIPRIVADO] Usuario ya bloqueado previamente: ${m.sender}`)
    return true
  }

  let debeBloquear = false
  let grupoTarget = null
  let grupoNombre = ''
  let modoBloqueo = ''

  // ===== VERIFICAR ANTIPRIVADO GLOBAL =====
  if (global.antiprivadoGlobal === true) {
    console.log(`🌐 [ANTIPRIVADO] Modo GLOBAL activo - BLOQUEANDO`)
    debeBloquear = true
    modoBloqueo = 'GLOBAL'
  } 
  // ===== VERIFICAR ANTIPRIVADO POR GRUPOS =====
  else {
    try {
      const groups = await conn.groupFetchAllParticipating()
      const groupIds = Object.keys(groups)
      
      console.log(`🔍 [ANTIPRIVADO] Buscando en ${groupIds.length} grupos...`)

      for (const groupId of groupIds) {
        const group = groups[groupId]
        const userInGroup = group.participants.some(p => p.id === m.sender)
        
        if (userInGroup && global.antiprivadoStatus[groupId] === true) {
          debeBloquear = true
          grupoTarget = groupId
          grupoNombre = group.subject || 'Grupo'
          modoBloqueo = 'GRUPO'
          console.log(`✅ [ANTIPRIVADO] Usuario encontrado en grupo con antiprivado: ${grupoNombre}`)
          break
        }
      }
    } catch (error) {
      console.error('❌ [ANTIPRIVADO] Error buscando grupos:', error)
    }
  }

  // SI NO DEBE BLOQUEAR, PERMITIR EL MENSAJE
  if (!debeBloquear) {
    console.log(`ℹ️ [ANTIPRIVADO] Usuario permitido - no está en modo bloqueo`)
    return false
  }

  // ===== PROCEDER CON EL BLOQUEO =====
  console.log(`🚫 [ANTIPRIVADO] Iniciando bloqueo [${modoBloqueo}] de: ${m.sender}`)

  try {
    const userName = await conn.getName(m.sender) || 'Usuario'
    const userNumber = m.sender.split('@')[0]

    // 1. ENVIAR MENSAJE DE ADVERTENCIA
    const mensajeBloqueo = 
      `🍙🚫 *ITSUKI NAKANO IA* 📚🔒\n\n` +
      `⚠️ *Mi creador activó la función antiprivado*\n\n` +
      `🤖 *Bot: Itsuki Nakano IA*\n` +
      `❌ *No se permiten mensajes al privado de esta bot*\n\n` +
      `📢 *Canal Oficial:*\n${global.canalOficial || 'Consulta en el grupo'}\n\n` +
      `💬 *"Por favor, usa el grupo para tus consultas"*\n` +
      `🔒 *Serás bloqueado automáticamente*\n\n` +
      `🍱 *¡El aprendizaje es mejor en grupo!* 📖✨`

    await conn.sendMessage(m.sender, { text: mensajeBloqueo })
    console.log(`📨 [ANTIPRIVADO] Mensaje de advertencia enviado`)

    // Esperar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 2. BLOQUEAR AL USUARIO
    await conn.updateBlockStatus(m.sender, 'block')
    console.log(`🔒 [ANTIPRIVADO] Usuario bloqueado: ${userName}`)
    
    // Agregar a la lista de bloqueados
    global.bloqueadosPorAntiprivado.add(m.sender)

    // 3. NOTIFICAR
    if (modoBloqueo === 'GRUPO' && grupoTarget) {
      // Notificar en el grupo
      const notificacionGrupo = 
        `🚫📱 *USUARIO BLOQUEADO* 👤🔒\n\n` +
        `👤 *Usuario:* @${userNumber}\n` +
        `👤 *Nombre:* ${userName}\n` +
        `📱 *Motivo:* Mensaje privado al bot\n` +
        `⏰ *Hora:* ${new Date().toLocaleString('es-ES')}\n\n` +
        `💬 *"He bloqueado a este usuario por escribirme al privado."*\n` +
        `📢 *"Recuerden: consultas solo en el grupo"*\n\n` +
        `🍱 *Itsuki Nakano IA* 📖✨`

      await conn.sendMessage(grupoTarget, {
        text: notificacionGrupo,
        mentions: [m.sender]
      })
      console.log(`📢 [ANTIPRIVADO] Notificación enviada al grupo: ${grupoNombre}`)
    } else {
      // Notificar al owner (modo global)
      const ownerJid = global.owner[0][0] + '@s.whatsapp.net'
      const notificacionOwner = 
        `🚫📱 *USUARIO BLOQUEADO (MODO GLOBAL)* 👤🔒\n\n` +
        `👤 *Usuario:* @${userNumber}\n` +
        `👤 *Nombre:* ${userName}\n` +
        `📱 *Motivo:* Mensaje privado (antiprivado global activo)\n` +
        `⏰ *Hora:* ${new Date().toLocaleString('es-ES')}\n\n` +
        `🌐 *Modo:* BLOQUEO GLOBAL\n\n` +
        `🍱 *Itsuki Nakano IA* 📖✨`

      await conn.sendMessage(ownerJid, {
        text: notificacionOwner,
        mentions: [m.sender]
      })
      console.log(`📢 [ANTIPRIVADO] Notificación enviada al owner`)
    }

    return true

  } catch (error) {
    console.error('❌ [ANTIPRIVADO] Error en el proceso de bloqueo:', error)
    return false
  }
}

handler.help = ['antiprivado <activar/desactivar/estado>', 'setcanal <enlace>', 'permitir <número>']
handler.tags = ['group', 'owner']
handler.command = ['antiprivado', 'antiprivate', 'noprivado', 'setcanal', 'configurarcanal', 'permitir', 'whitelist', 'permitirnumero']

export default handler