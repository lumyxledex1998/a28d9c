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
    // VERIFICAR MÉTODOS DISPONIBLES
    console.log('🔍 Métodos disponibles en conn:')
    console.log('- groupSettingUpdate:', typeof conn.groupSettingUpdate)
    console.log('- groupUpdateSetting:', typeof conn.groupUpdateSetting)
    console.log('- toggleGroupSettings:', typeof conn.toggleGroupSettings)

    if (action.includes('cerrar') || action === 'lock') {
      let success = false
      
      // INTENTAR TODOS LOS MÉTODOS POSIBLES
      try {
        // Método 1 - Más común
        await conn.groupSettingUpdate(m.chat, 'announcement')
        success = true
        console.log('✅ Cerrado con groupSettingUpdate')
      } catch (e) {
        console.log('❌ groupSettingUpdate falló:', e.message)
      }
      
      if (!success) {
        try {
          // Método 2 - Alternativo
          await conn.groupUpdateSetting(m.chat, 'announcement')
          success = true
          console.log('✅ Cerrado con groupUpdateSetting')
        } catch (e) {
          console.log('❌ groupUpdateSetting falló:', e.message)
        }
      }
      
      if (!success) {
        try {
          // Método 3 - Otro nombre
          await conn.toggleGroupSettings(m.chat, 'announcement')
          success = true
          console.log('✅ Cerrado con toggleGroupSettings')
        } catch (e) {
          console.log('❌ toggleGroupSettings falló:', e.message)
        }
      }
      
      if (success) {
        m.reply(`🔒 *GRUPO CERRADO*\n\n"${groupName}" ahora está cerrado.\nSolo administradores pueden escribir.`)
      } else {
        m.reply('❌ No se pudo cerrar el grupo. Verifica los permisos del bot.')
      }
      
    } else if (action.includes('abrir') || action === 'unlock') {
      let success = false
      
      // INTENTAR TODOS LOS MÉTODOS POSIBLES
      try {
        await conn.groupSettingUpdate(m.chat, 'not_announcement')
        success = true
        console.log('✅ Abierto con groupSettingUpdate')
      } catch (e) {
        console.log('❌ groupSettingUpdate falló:', e.message)
      }
      
      if (!success) {
        try {
          await conn.groupUpdateSetting(m.chat, 'not_announcement')
          success = true
          console.log('✅ Abierto con groupUpdateSetting')
        } catch (e) {
          console.log('❌ groupUpdateSetting falló:', e.message)
        }
      }
      
      if (!success) {
        try {
          await conn.toggleGroupSettings(m.chat, 'not_announcement')
          success = true
          console.log('✅ Abierto con toggleGroupSettings')
        } catch (e) {
          console.log('❌ toggleGroupSettings falló:', e.message)
        }
      }
      
      if (success) {
        m.reply(`🔓 *GRUPO ABIERTO*\n\n"${groupName}" ahora está abierto.\nTodos pueden escribir.`)
      } else {
        m.reply('❌ No se pudo abrir el grupo. Verifica los permisos del bot.')
      }
      
    } else if (action.includes('estado') || action === 'status') {
      const groupInfo = await conn.groupMetadata(m.chat)
      const estado = groupInfo.announce ? '🔒 CERRADO' : '🔓 ABIERTO'
      m.reply(`📊 *ESTADO*\nGrupo: ${groupName}\nEstado: ${estado}\nMiembros: ${groupInfo.participants.length}`)
      
    } else {
      m.reply(`❌ Comando no válido\n\nUsa:\n${usedPrefix}cerrargrupo\n${usedPrefix}abrirgrupo\n${usedPrefix}estadogrupo`)
    }

  } catch (error) {
    console.error('❌ Error general:', error)
    m.reply(`❌ Error: ${error.message}`)
  }
}

handler.help = ['cerrargrupo', 'abrirgrupo', 'estadogrupo']
handler.tags = ['group']
handler.command = ['cerrargrupo', 'abrirgrupo', 'estadogrupo', 'lock', 'unlock']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler