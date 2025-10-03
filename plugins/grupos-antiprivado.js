let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner, isROwner }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // ==================== COMANDOS DE ANTIPRIVADO ====================
  if (['antiprivado', 'antiprivate', 'noprivado'].includes(command)) {

    const action = args[0]?.toLowerCase()
    const esOwner = isOwner || isROwner || m.fromMe

    if (!action) {
      return conn.reply(m.chat, `
🔒 *SISTEMA ANTIPRIVADO*

🤖 *Bot:* ${conn.user.name || 'Itsuki Nakano'}

⚙️ *Opciones:*
• ${usedPrefix}antiprivado on
• ${usedPrefix}antiprivado off  
• ${usedPrefix}antiprivado status

🚫 *Cuando está ACTIVO:*
• Bloquea automáticamente a quien escriba al privado
• Envía mensaje de advertencia
• Solo el owner puede escribir al privado

✅ *Números permitidos:* ${(global.numerosPermitidos || []).length}
      `.trim(), m, ctxWarn)
    }

    // Inicializar sistemas
    if (!global.antiprivado) global.antiprivado = false
    if (!global.numerosPermitidos) global.numerosPermitidos = []
    if (!global.bloqueadosAntiprivado) global.bloqueadosAntiprivado = new Set()

    switch (action) {
      case 'on':
      case 'activar':
      case 'enable':
        global.antiprivado = true
        await conn.reply(m.chat, 
          `✅ *ANTIPRIVADO ACTIVADO*\n\n` +
          `🔒 Ahora bloquearé automáticamente a cualquier persona que me escriba al privado.\n\n` +
          `⚠️ *ADVERTENCIA:*\n` +
          `• Solo tú (owner) puedes escribir al privado\n` +
          `• Todos los demás serán bloqueados\n` +
          `• Se enviará mensaje de advertencia antes del bloqueo`,
          m, ctxOk
        )
        break

      case 'off':
      case 'desactivar':
      case 'disable':
        global.antiprivado = false
        await conn.reply(m.chat, 
          `❌ *ANTIPRIVADO DESACTIVADO*\n\n` +
          `🔓 Ahora cualquiera puede escribirme al privado.`,
          m, ctxWarn
        )
        break

      case 'status':
      case 'estado':
        const estado = global.antiprivado ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        const bloqueados = global.bloqueadosAntiprivado?.size || 0
        const permitidos = global.numerosPermitidos?.length || 0
        
        await conn.reply(m.chat, 
          `📊 *ESTADO ANTIPRIVADO*\n\n` +
          `🔒 *Sistema:* ${estado}\n` +
          `🚫 *Usuarios bloqueados:* ${bloqueados}\n` +
          `✅ *Números permitidos:* ${permitidos}\n` +
          `🤖 *Bot:* ${conn.user.name || 'Itsuki Nakano'}`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: on, off o status', m, ctxErr)
    }
    return
  }

  // ==================== COMANDO PERMITIR ====================
  if (['permitir', 'allow'].includes(command)) {
    const esOwner = isOwner || isROwner || m.fromMe
    if (!esOwner) return m.reply('❌ Solo el owner')

    if (!global.numerosPermitidos) global.numerosPermitidos = []

    const numero = args[0]?.replace(/[^0-9]/g, '')
    if (!numero) {
      const lista = global.numerosPermitidos.length > 0 
        ? global.numerosPermitidos.map(n => `• +${n}`).join('\n')
        : 'Ninguno'
      
      return m.reply(`📋 *Números Permitidos:*\n${lista}`)
    }

    if (global.numerosPermitidos.includes(numero)) {
      return m.reply(`⚠️ +${numero} ya está permitido`)
    }

    global.numerosPermitidos.push(numero)
    m.reply(`✅ +${numero} agregado a la lista blanca`)
    return
  }
}

// ==================== SISTEMA QUE SÍ FUNCIONA ====================
handler.all = async function (m, { conn, isOwner, isROwner }) {
  // SOLO mensajes privados
  if (m.isGroup || m.isBaileys) return
  
  // Ignorar comandos
  if (m.text?.startsWith('.') || m.text?.startsWith('!') || m.text?.startsWith('/')) return

  console.log(`📱 Mensaje privado de: ${m.sender}`)

  // Inicializar si no existe
  if (!global.antiprivado) global.antiprivado = false
  if (!global.numerosPermitidos) global.numerosPermitidos = []
  if (!global.bloqueadosAntiprivado) global.bloqueadosAntiprivado = new Set()

  // ⭐ PERMITIR AL OWNER SIEMPRE ⭐
  if (isOwner || isROwner || m.fromMe) {
    console.log('👑 Mensaje del owner - PERMITIDO')
    return false
  }

  // ⭐ PERMITIR NÚMEROS EN LISTA BLANCA ⭐
  const numeroUsuario = m.sender.split('@')[0]
  if (global.numerosPermitidos.includes(numeroUsuario)) {
    console.log(`✅ ${numeroUsuario} está en lista blanca - PERMITIDO`)
    return false
  }

  // ⭐ SI ANTIPRIVADO ESTÁ DESACTIVADO, PERMITIR ⭐
  if (!global.antiprivado) {
    console.log('🔓 Antiprivado desactivado - PERMITIDO')
    return false
  }

  // ⭐ SI YA FUE BLOQUEADO, IGNORAR ⭐
  if (global.bloqueadosAntiprivado.has(m.sender)) {
    console.log('⏭️ Usuario ya bloqueado - IGNORAR')
    return true
  }

  // ===== PROCEDER CON BLOQUEO =====
  console.log('🚫 INICIANDO BLOQUEO POR ANTIPRIVADO...')

  try {
    const userName = await conn.getName(m.sender) || 'Usuario'

    // 1. ENVIAR MENSAJE DE ADVERTENCIA
    const mensajeAdvertencia = 
      `🚫 *ACCESO DENEGADO*\n\n` +
      `Hola ${userName},\n\n` +
      `El propietario de este bot ha activado la protección antiprivado.\n\n` +
      `❌ *No se permiten mensajes privados*\n` +
      `🔒 *Serás bloqueado automáticamente*\n\n` +
      `📢 *Por favor, usa los grupos oficiales para comunicarte.*\n\n` +
      `🤖 *Bot:* ${conn.user.name || 'Itsuki Nakano'}`

    await conn.sendMessage(m.sender, { text: mensajeAdvertencia })
    console.log('📨 Mensaje de advertencia enviado')

    // Esperar 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 2. BLOQUEAR USUARIO
    await conn.updateBlockStatus(m.sender, 'block')
    console.log(`🔒 Usuario bloqueado: ${userName}`)

    // 3. AGREGAR A LISTA DE BLOQUEADOS
    global.bloqueadosAntiprivado.add(m.sender)

    // 4. NOTIFICAR AL OWNER
    const ownerJid = global.owner?.[0]?.[0] + '@s.whatsapp.net' || m.sender
    const notificacion = 
      `🚫 *USUARIO BLOQUEADO - ANTIPRIVADO*\n\n` +
      `👤 *Usuario:* ${userName}\n` +
      `📱 *Número:* ${numeroUsuario}\n` +
      `⏰ *Hora:* ${new Date().toLocaleString()}\n\n` +
      `🔒 *Motivo:* Mensaje al privado\n` +
      `🤖 *Bot:* ${conn.user.name}`

    await conn.sendMessage(ownerJid, { text: notificacion })
    console.log('📢 Notificación enviada al owner')

    return true

  } catch (error) {
    console.error('❌ Error en antiprivado:', error)
    
    // Intentar notificar error al owner
    try {
      const ownerJid = global.owner?.[0]?.[0] + '@s.whatsapp.net' || m.sender
      await conn.sendMessage(ownerJid, { 
        text: `❌ ERROR EN ANTIPRIVADO:\n${error.message}` 
      })
    } catch (e) {}
    
    return false
  }
}

handler.help = ['antiprivado <on/off/status>', 'permitir <número>']
handler.tags = ['owner']
handler.command = ['antiprivado', 'antiprivate', 'noprivado', 'permitir']

export default handler