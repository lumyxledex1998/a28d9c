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
}

// Handler separado para la detección automática
handler.before = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (m.isBaileys || !m.isGroup) return
  
  // Verificar si el anti-árabe está activo
  if (!global.antiArab || global.antiArab[m.chat] === false) return

  const messageText = m.text || m.caption || ''

  // Patrón para detectar caracteres árabes
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  const hasArabic = arabicPattern.test(messageText)

  if (!hasArabic) return

  // Excepciones
  const sender = m.sender
  if (isAdmin) return // Los admins pueden escribir en árabe
  if (sender === conn.user.jid) return

  try {
    console.log(`🔍 Detectado texto árabe de: ${sender}`)
    
    // 1. Eliminar el mensaje con texto árabe
    if (isBotAdmin && m.key) {
      await conn.sendMessage(m.chat, { 
        delete: { 
          remoteJid: m.chat, 
          fromMe: false, 
          id: m.key.id, 
          participant: sender 
        } 
      })
      console.log('✅ Mensaje eliminado')
    }

    // 2. EXPULSAR AL USUARIO DEL GRUPO
    if (isBotAdmin) {
      await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
      console.log('✅ Usuario expulsado')
      
      // Mensaje corto de expulsión
      await conn.reply(m.chat, '🚫 Usuario expulsado por texto árabe', m)
    } else {
      console.log('❌ Bot no es admin, no puede expulsar')
    }

  } catch (error) {
    console.error('❌ Error en anti-árabe:', error)
  }
}

handler.help = ['antiarabe <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabic']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler