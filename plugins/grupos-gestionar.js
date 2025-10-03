let handler = async (m, { conn, isAdmin, isBotAdmin, text, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
  }

  if (!isAdmin) {
    return conn.reply(m.chat, '⚠️ Necesitas ser administrador.', m, ctxErr)
  }

  if (!isBotAdmin) {
    return conn.reply(m.chat, '⚠️ Necesito ser administradora.', m, ctxErr)
  }

  const action = text?.toLowerCase()

  if (!action) {
    return conn.reply(m.chat, `
🔐 *GESTIÓN DE GRUPO*

• ${usedPrefix}cerrargrupo - Cerrar grupo
• ${usedPrefix}abrirgrupo - Abrir grupo
• ${usedPrefix}estadogrupo - Ver estado
    `, m, ctxWarn)
  }

  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupName = groupMetadata.subject || 'Grupo'

    switch (action) {
      case 'cerrar':
      case 'close':
      case 'cerrargrupo':
      case 'lock':
        // MÉTODO QUE SÍ FUNCIONA - Cerrar grupo
        await conn.groupUpdateSetting(m.chat, 'announcement')
        
        await conn.reply(m.chat, 
          `🔒 *GRUPO CERRADO*\n\n` +
          `✅ *${groupName} ha sido cerrado*\n` +
          `🚫 Solo administradores pueden escribir\n` +
          `👑 Acción realizada por: @${m.sender.split('@')[0]}`,
          m, { mentions: [m.sender] }
        )
        break

      case 'abrir':
      case 'open':
      case 'abrirgrupo':
      case 'unlock':
        // MÉTODO QUE SÍ FUNCIONA - Abrir grupo
        await conn.groupUpdateSetting(m.chat, 'not_announcement')
        
        await conn.reply(m.chat, 
          `🔓 *GRUPO ABIERTO*\n\n` +
          `✅ *${groupName} ha sido abierto*\n` +
          `💬 Todos pueden escribir\n` +
          `👑 Acción realizada por: @${m.sender.split('@')[0]}`,
          m, { mentions: [m.sender] }
        )
        break

      case 'estado':
      case 'status':
      case 'estadogrupo':
        const groupInfo = await conn.groupMetadata(m.chat)
        const estado = groupInfo.announce ? '🔒 CERRADO' : '🔓 ABIERTO'
        const participantes = groupInfo.participants.length
        const admins = groupInfo.participants.filter(p => p.admin).length
        
        await conn.reply(m.chat, 
          `📊 *ESTADO DEL GRUPO*\n\n` +
          `📝 *Nombre:* ${groupName}\n` +
          `🔐 *Estado:* ${estado}\n` +
          `👥 *Miembros:* ${participantes}\n` +
          `👑 *Admins:* ${admins}`,
          m, ctxOk
        )
        break

      default:
        await conn.reply(m.chat, 
          `❌ Opción no válida\n\nUsa:\n${usedPrefix}cerrargrupo\n${usedPrefix}abrirgrupo\n${usedPrefix}estadogrupo`,
          m, ctxErr
        )
    }

    console.log(`✅ GRUPO ${action.toUpperCase()}: ${m.chat}`)

  } catch (error) {
    console.error('❌ Error:', error)
    
    // INTENTAR CON MÉTODO ALTERNATIVO
    try {
      if (action.includes('cerrar')) {
        await conn.groupSettingUpdate(m.chat, true)
        m.reply('🔒 Grupo cerrado (método alternativo)')
      } else if (action.includes('abrir')) {
        await conn.groupSettingUpdate(m.chat, false) 
        m.reply('🔓 Grupo abierto (método alternativo)')
      }
    } catch (error2) {
      await conn.reply(m.chat, 
        `❌ Error: ${error.message}\n\nEl bot puede no tener permisos suficientes.`,
        m, ctxErr
      )
    }
  }
}

handler.help = ['cerrargrupo', 'abrirgrupo', 'estadogrupo']
handler.tags = ['group']
handler.command = ['cerrargrupo', 'abrirgrupo', 'estadogrupo', 'lock', 'unlock']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler