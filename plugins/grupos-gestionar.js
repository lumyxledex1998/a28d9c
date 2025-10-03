let handler = async (m, { conn, isAdmin, isBotAdmin, text, usedPrefix }) => {
  if (!m.isGroup) return m.reply('❌ Solo en grupos')
  if (!isAdmin) return m.reply('⚠️ Necesitas ser admin')
  if (!isBotAdmin) return m.reply('⚠️ Necesito ser admin')

  const action = text?.toLowerCase()
  const groupName = (await conn.groupMetadata(m.chat)).subject || 'Grupo'

  if (!action) {
    return m.reply(`🔐 *GESTIÓN DE GRUPO*\n\n• ${usedPrefix}cerrargrupo\n• ${usedPrefix}abrirgrupo\n• ${usedPrefix}estadogrupo`)
  }

  try {
    if (action.includes('cerrar') || action === 'lock') {
      // MÉTODO CORRECTO para Baileys v5+
      await conn.groupSettingUpdate(m.chat, 'announcement')
      m.reply(`✅ *GRUPO CERRADO*\n\n"${groupName}" ahora está cerrado.\nSolo administradores pueden enviar mensajes.`)
      
    } else if (action.includes('abrir') || action === 'unlock') {
      // MÉTODO CORRECTO para Baileys v5+
      await conn.groupSettingUpdate(m.chat, 'not_announcement')
      m.reply(`✅ *GRUPO ABIERTO*\n\n"${groupName}" ahora está abierto.\nTodos los miembros pueden enviar mensajes.`)
      
    } else if (action.includes('estado') || action === 'status') {
      const groupInfo = await conn.groupMetadata(m.chat)
      const estado = groupInfo.announce ? '🔒 CERRADO' : '🔓 ABIERTO'
      m.reply(`📊 *ESTADO DE "${groupName}"*\n\n• Estado: ${estado}\n• Miembros: ${groupInfo.participants.length}\n• Admins: ${groupInfo.participants.filter(p => p.admin).length}`)
      
    } else {
      m.reply(`❌ Comando no válido\n\nUsa:\n${usedPrefix}cerrargrupo\n${usedPrefix}abrirgrupo\n${usedPrefix}estadogrupo`)
    }

  } catch (error) {
    console.error('Error:', error)
    
    // Si falla, probar método alternativo
    try {
      if (action.includes('cerrar')) {
        await conn.groupUpdateSetting(m.chat, 'announcement')
        m.reply(`✅ *GRUPO CERRADO* (método alternativo)\n\n"${groupName}" ahora está cerrado.`)
      } else if (action.includes('abrir')) {
        await conn.groupUpdateSetting(m.chat, 'not_announcement')
        m.reply(`✅ *GRUPO ABIERTO* (método alternativo)\n\n"${groupName}" ahora está abierto.`)
      }
    } catch (error2) {
      m.reply(`❌ Error grave: ${error.message}\n\nVerifica que el bot tenga permisos de administrador completos.`)
    }
  }
}

handler.help = ['cerrargrupo', 'abrirgrupo', 'estadogrupo']
handler.tags = ['group']
handler.command = ['cerrargrupo', 'abrirgrupo', 'estadogrupo', 'lock', 'unlock', 'groupstatus']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler