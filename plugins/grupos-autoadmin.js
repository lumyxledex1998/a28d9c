const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, isROwner }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  // Inicializar sistema si no existe
  if (!global.autoadmin) global.autoadmin = {}
  if (!global.autoadmin[m.chat]) global.autoadmin[m.chat] = false
  
  // COMANDO DE CONFIGURACIÓN
  if (args[0]) {
    if (!isROwner) return conn.reply(m.chat, '👑 ❌ Solo el owner puede configurar.', m, ctxErr)
    
    const action = args[0].toLowerCase()
    
    switch(action) {
      case 'on':
      case 'activar':
        global.autoadmin[m.chat] = true
        await conn.reply(m.chat, 
          `🌸✅ **Auto-Admin Activado**\n\n` +
          `📚 *"He activado el sistema de auto-admin en este grupo."*\n\n` +
          `🔧 *Estado:* 🟢 ACTIVADO\n` +
          `👑 *Función:* Promoción automática\n` +
          `🍙 *"Los usuarios podrán promoverse automáticamente"* ✨`,
          m, ctxOk
        )
        break
        
      case 'off':
      case 'desactivar':
        global.autoadmin[m.chat] = false
        await conn.reply(m.chat, 
          `🌸❌ **Auto-Admin Desactivado**\n\n` +
          `📚 *"He desactivado el sistema de auto-admin en este grupo."*\n\n` +
          `🔧 *Estado:* 🔴 DESACTIVADO\n` +
          `👑 *Función:* Desactivada\n` +
          `🍙 *"La promoción automática está deshabilitada"* ✨`,
          m, ctxWarn
        )
        break
        
      case 'estado':
      case 'status':
        const estado = global.autoadmin[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, 
          `🌸📊 **Estado Auto-Admin**\n\n` +
          `🔧 *Sistema:* ${estado}\n` +
          `💬 *Grupo:* ${(await conn.groupMetadata(m.chat)).subject || 'Sin nombre'}\n\n` +
          `📝 *Usa:* ${usedPrefix}autoadmin <on/off/estado>`,
          m, ctxOk
        )
        break
        
      default:
        await conn.reply(m.chat, 
          `❌ Opción no válida\n\n` +
          `💡 *Opciones disponibles:*\n` +
          `• ${usedPrefix}autoadmin on\n` +
          `• ${usedPrefix}autoadmin off\n` +
          `• ${usedPrefix}autoadmin estado`,
          m, ctxErr
        )
    }
    return
  }
  
  // SISTEMA DE AUTO-PROMOCIÓN
  if (!isROwner) return conn.reply(m.chat, '👑 ❌ Solo el owner puede usar este comando.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '🤖 ❌ Necesito ser administradora para promover.', m, ctxErr)
  if (isAdmin) return conn.reply(m.chat, '👑 ❀ Ya tienes privilegios de administrador.', m, ctxWarn)
  
  // Verificar si el sistema está activado
  if (!global.autoadmin[m.chat]) {
    return conn.reply(m.chat, 
      `🌸❌ **Sistema Desactivado**\n\n` +
      `📚 *"El sistema de auto-admin está desactivado en este grupo."*\n\n` +
      `💡 *Para activarlo:*\n` +
      `» ${usedPrefix}autoadmin on\n\n` +
      `👑 *Solo el owner puede activar el sistema*`,
      m, ctxErr
    )
  }
  
  try {
    await m.react('🕒')
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    await m.react('✔️')
    
    await conn.reply(m.chat, 
      `🌸✅ **Auto-Admin Ejecutado** 👑\n\n` +
      `📚 *"¡Te he otorgado privilegios de administrador automáticamente!"*\n\n` +
      `👤 *Usuario promovido:* @${m.sender.split('@')[0]}\n` +
      `👑 *Rango:* Administrador\n` +
      `🔧 *Sistema:* Auto-Admin Activado\n\n` +
      `🍙 *"¡Ahora puedes ayudar a moderar el grupo!"* ✨`,
      m, 
      { mentions: [m.sender], ...ctxOk }
    )
    
  } catch (error) {
    await m.react('✖️')
    await conn.reply(m.chat, 
      `❌📚 **Error al Promover**\n\n` +
      `🍙 *"No pude otorgarte privilegios de administrador."*\n\n` +
      `🔧 *Detalle:* ${error.message}\n` +
      `📝 *Solución:* Usa ${usedPrefix}report para informar el problema\n\n` +
      `📖 *"¡Intentaré mejorar para la próxima!"* 🍱`,
      m, 
      ctxErr
    )
  }
}

handler.help = ['autoadmin <on/off/estado>']
handler.tags = ['owner', 'group']
handler.command = ['autoadmin']
handler.group = true

export default handler