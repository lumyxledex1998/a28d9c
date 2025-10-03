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

📢 *Canal Oficial:* ${global.canalOficial || 'No configurado'}

🍱 *"¡Mi privado está reservado!"* 📖✨

💡 *Tip:* Usa ${usedPrefix}setcanal <enlace> para configurar el canal
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado - Inicializar si no existe
    if (!global.antiprivadoStatus) global.antiprivadoStatus = {}

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
          `📢 *Canal:* ${global.canalOficial || 'No configurado'}\n\n` +
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
        const gruposActivos = Object.keys(global.antiprivadoStatus || {}).filter(k => global.antiprivadoStatus[k]).length
        
        await conn.reply(m.chat, 
          `🍙📊 *Estado Antiprivado*\n\n` +
          `🚫 *Sistema en este grupo:* ${status}\n` +
          `🔒 *Modo:* ${global.antiprivadoStatus[m.chat] ? 'BLOQUEO' : 'PERMISIVO'}\n` +
          `📢 *Canal:* ${global.canalOficial || 'No configurado'}\n` +
          `👥 *Grupos con antiprivado:* ${gruposActivos}\n` +
          `🍱 *"Protección ${global.antiprivadoStatus[m.chat] ? 'activa' : 'desactivada'}"* ✨`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: activar, desactivar o estado', m, ctxErr)
    }
    return
  }

  // COMANDO PARA CONFIGURAR EL CANAL (Solo owner/admin global)
  if (['setcanal', 'configurarcanal'].includes(command)) {
    if (!global.db.data.users[m.sender].premium && !m.fromMe) {
      return conn.reply(m.chat, '❌ Solo el owner puede configurar el canal', m, ctxErr)
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
}

// ===== DETECCIÓN Y BLOQUEO MEJORADO =====
handler.all = async function (m, { conn }) {
  // SOLO mensajes privados (no grupos, no del bot mismo, no comandos)
  if (m.isGroup || m.isBaileys || !m.chat.endsWith('@s.whatsapp.net')) return
  if (m.text?.startsWith('.') || m.text?.startsWith('!') || m.text?.startsWith('/')) return

  console.log(`📱 [ANTIPRIVADO] Mensaje privado de: ${m.sender}`)

  // Inicializar sistema
  if (!global.antiprivadoStatus) global.antiprivadoStatus = {}
  if (!global.bloqueadosPorAntiprivado) global.bloqueadosPorAntiprivado = new Set()

  // Si ya fue bloqueado antes, ignorar
  if (global.bloqueadosPorAntiprivado.has(m.sender)) {
    console.log(`⏭️ [ANTIPRIVADO] Usuario ya bloqueado previamente: ${m.sender}`)
    return true
  }

  let antiprivadoActive = false
  let grupoTarget = null
  let grupoNombre = ''

  try {
    // Obtener todos los grupos
    const groups = await conn.groupFetchAllParticipating()
    const groupIds = Object.keys(groups)
    
    console.log(`🔍 [ANTIPRIVADO] Buscando en ${groupIds.length} grupos...`)

    // Buscar en qué grupo está el usuario Y tiene antiprivado activo
    for (const groupId of groupIds) {
      const group = groups[groupId]
      
      // Verificar si el usuario está en el grupo
      const userInGroup = group.participants.some(p => p.id === m.sender)
      
      // Verificar si ese grupo tiene antiprivado activado
      if (userInGroup && global.antiprivadoStatus[groupId] === true) {
        antiprivadoActive = true
        grupoTarget = groupId
        grupoNombre = group.subject || 'Grupo'
        console.log(`✅ [ANTIPRIVADO] Usuario encontrado en: ${grupoNombre}`)
        break
      }
    }

    // SI NO ESTÁ EN NINGÚN GRUPO CON ANTIPRIVADO, PERMITIR
    if (!antiprivadoActive) {
      console.log(`ℹ️ [ANTIPRIVADO] Usuario no está en grupos con antiprivado activo`)
      return false
    }

    // PROCEDER CON EL BLOQUEO
    console.log(`🚫 [ANTIPRIVADO] Iniciando bloqueo de: ${m.sender}`)

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
    console.log(`📨 [ANTIPRIVADO] Mensaje enviado a: ${userName}`)

    // Pequeña espera para que el usuario vea el mensaje
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 2. BLOQUEAR AL USUARIO
    try {
      await conn.updateBlockStatus(m.sender, 'block')
      console.log(`🔒 [ANTIPRIVADO] Usuario bloqueado: ${userName}`)
      
      // Agregar a la lista de bloqueados
      global.bloqueadosPorAntiprivado.add(m.sender)
    } catch (blockError) {
      console.error(`❌ [ANTIPRIVADO] Error al bloquear:`, blockError)
    }

    // 3. NOTIFICAR EN EL GRUPO
    const notificacionGrupo = 
      `🚫📱 *USUARIO BLOQUEADO* 👤🔒\n\n` +
      `👤 *Usuario:* @${userNumber}\n` +
      `👤 *Nombre:* ${userName}\n` +
      `📱 *Motivo:* Mensaje privado al bot\n` +
      `⏰ *Hora:* ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}\n\n` +
      `💬 *"He bloqueado a este usuario por escribirme al privado."*\n` +
      `📢 *"Recuerden: consultas solo en el grupo"*\n\n` +
      `🍱 *Itsuki Nakano IA* 📖✨`

    await conn.sendMessage(grupoTarget, {
      text: notificacionGrupo,
      mentions: [m.sender]
    })
    console.log(`📢 [ANTIPRIVADO] Notificación enviada al grupo: ${grupoNombre}`)

    // 4. EVITAR QUE SE PROCESE EL MENSAJE
    return true

  } catch (error) {
    console.error('❌ [ANTIPRIVADO] Error general:', error)
    return false
  }
}

handler.help = ['antiprivado <activar/desactivar/estado>', 'setcanal <enlace>']
handler.tags = ['group', 'owner']
handler.command = ['antiprivado', 'antiprivate', 'noprivado', 'setcanal', 'configurarcanal']

export default handler