let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Comando de configuración
  if (['antiarabe', 'antiarab', 'antiarabic'].includes(m.text?.toLowerCase()?.split(' ')[0])) {
    if (!m.isGroup) return conn.reply(m.chat, '❌ Solo en grupos.', m, ctxErr)
    if (!isAdmin) return conn.reply(m.chat, '⚠️ Necesitas ser admin.', m, ctxErr)

    const action = m.text?.toLowerCase()?.split(' ')[1]

    if (!action) {
      return conn.reply(m.chat, `
🚫 **Anti-Árabe**

• !antiarabe activar
• !antiarabe desactivar  
• !antiarabe estado
      `.trim(), m, ctxWarn)
    }

    if (!global.antiArab) global.antiArab = {}

    switch (action) {
      case 'activar':
      case 'on':
      case 'enable':
        global.antiArab[m.chat] = true
        await conn.reply(m.chat, '✅ Anti-árabe activado', m, ctxOk)
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        global.antiArab[m.chat] = false
        await conn.reply(m.chat, '❌ Anti-árabe desactivado', m, ctxWarn)
        break

      case 'estado':
      case 'status':
        const status = global.antiArab[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, `📊 Estado: ${status}`, m, ctxOk)
        break

      default:
        await conn.reply(m.chat, '❌ Usa: activar, desactivar o estado', m, ctxErr)
    }
    return
  }

  // ===== DETECCIÓN AUTOMÁTICA DE TEXTO ÁRABE =====
  // Solo procesar si NO es un comando y es un mensaje normal
  if (m.isGroup && !m.text?.startsWith('!') && !m.text?.startsWith('/') && !m.text?.startsWith('.')) {
    
    // Verificar si el anti-árabe está activo
    if (!global.antiArab || global.antiArab[m.chat] !== true) return

    const messageText = m.text || m.caption || ''

    // Patrón para detectar caracteres árabes
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
    const hasArabic = arabicPattern.test(messageText)

    if (!hasArabic) return

    console.log(`🔍 Detectado texto árabe de: ${m.sender}`)
    console.log(`📝 Mensaje: ${messageText}`)

    // Excepciones
    if (isAdmin) {
      console.log('✅ Usuario es admin, no se expulsa')
      return
    }
    
    if (m.sender === conn.user.jid) return

    if (!isBotAdmin) {
      console.log('❌ Bot no es admin, no puede expulsar')
      await conn.reply(m.chat, '⚠️ Bot necesita ser admin para expulsar', m)
      return
    }

    try {
      // 1. Eliminar el mensaje con texto árabe
      if (m.key) {
        await conn.sendMessage(m.chat, { 
          delete: { 
            remoteJid: m.chat, 
            fromMe: false, 
            id: m.key.id, 
            participant: m.sender 
          } 
        })
        console.log('✅ Mensaje eliminado')
      }

      // 2. EXPULSAR AL USUARIO DEL GRUPO
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      console.log('✅ Usuario expulsado')

      // 3. Mensaje de expulsión
      await conn.reply(m.chat, '🚫 Usuario expulsado por texto árabe', m)

    } catch (error) {
      console.error('❌ Error en anti-árabe:', error)
      await conn.reply(m.chat, `❌ Error: ${error.message}`, m)
    }
  }
}

handler.help = ['antiarabe <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabic']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler