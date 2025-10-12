let handler = async (m, { conn, text, usedPrefix, command, isOwner, args }) => {
  const ctxErr = global.rcanalx || {}
  const ctxWarn = global.rcanalw || {}
  const ctxOk = global.rcanalr || {}

  if (!isOwner) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Acceso Denegado* 🔒\n\n` +
      `⚠️ Este comando es exclusivo para el propietario\n\n` +
      `📚 "Lo siento, solo LeoXzz puede usar este comando" 🎀`,
      m, ctxErr
    )
  }

  const action = args[0]?.toLowerCase()
  const commandName = args[1]?.toLowerCase()

  if (!action || !commandName) {
    return conn.reply(m.chat, 
      `🍙🛠️ *ITSUKI - Sistema de Mantenimiento* ⚙️\n\n` +
      `📝 *Modos disponibles:*\n` +
      `• ${usedPrefix}${command} on <comando>\n` +
      `• ${usedPrefix}${command} off <comando>\n\n` +
      `💡 *Ejemplos:*\n` +
      `• ${usedPrefix}${command} on anime\n` +
      `• ${usedPrefix}${command} off juego\n\n` +
      `📚 "Activa o desactiva comandos del sistema" 🎨`,
      m, ctxWarn
    )
  }

  // Inicializar array si no existe
  if (!global.maintenanceCommands) global.maintenanceCommands = []

  const commands = Object.values(global.plugins)
    .filter(v => v.help && v.help.length > 0)
    .map(v => v.help[0].split(' ')[0].toLowerCase())
  
  if (!commands.includes(commandName)) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Comando No Encontrado* 🔍\n\n` +
      `⚠️ El comando "${commandName}" no existe\n\n` +
      `📚 "Verifica el nombre del comando" 📝`,
      m, ctxErr
    )
  }

  try {
    if (action === 'on') {
      if (global.maintenanceCommands.includes(commandName)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - Ya en Mantenimiento* 🚧\n\n` +
          `ℹ️ El comando "${commandName}" ya está en mantenimiento\n\n` +
          `📚 "No es necesario activarlo nuevamente" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceCommands.push(commandName)
      
      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Activado* ⚙️✨\n\n` +
        `🎉 Comando "${commandName}" puesto en mantenimiento\n\n` +
        `📚 "El comando ha sido desactivado temporalmente"\n` +
        `🛠️ "Los usuarios no podrán usarlo hasta nuevo aviso"\n\n` +
        `✅ *Estado:* 🚧 En mantenimiento`,
        m, ctxOk
      )
      
    } else if (action === 'off') {
      if (!global.maintenanceCommands.includes(commandName)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - No en Mantenimiento* ✅\n\n` +
          `ℹ️ El comando "${commandName}" no está en mantenimiento\n\n` +
          `📚 "Este comando ya está activo" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceCommands = global.maintenanceCommands.filter(cmd => cmd !== commandName)
      
      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Desactivado* ⚙️✨\n\n` +
        `🎉 Comando "${commandName}" activado nuevamente\n\n` +
        `📚 "El comando ha sido reactivado exitosamente"\n` +
        `🛠️ "Los usuarios ya pueden usarlo normalmente"\n\n` +
        `✅ *Estado:* 🟢 Activo y funcionando`,
        m, ctxOk
      )
    } else {
      return conn.reply(m.chat, 
        `🍙❌ *ITSUKI - Acción Inválida* ❓\n\n` +
        `⚠️ Usa "on" o "off"\n\n` +
        `📚 "Solo puedo activar o desactivar mantenimiento" 📝`,
        m, ctxErr
      )
    }

  } catch (e) {
    console.error('Error en comando mantenimiento:', e)
    await conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Error del Sistema* 💥\n\n` +
      `⚠️ Ocurrió un error al procesar la solicitud\n\n` +
      `📝 *Detalles:* ${e.message}\n\n` +
      `🔧 "Por favor, intenta nuevamente más tarde" 📚`,
      m, ctxErr
    )
  }
}

handler.command = ['mantenimiento', 'maintenance', 'mant']
handler.tags = ['owner']
handler.help = ['mantenimiento on/off <comando>']
handler.owner = true
handler.group = false
handler.rowner = true

export default handler