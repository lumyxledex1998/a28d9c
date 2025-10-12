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

  const commandName = text?.toLowerCase()
  if (!commandName) {
    return conn.reply(m.chat, 
      `🍙🛠️ *ITSUKI - Modo Mantenimiento* ⚙️\n\n` +
      `❌ Debes especificar un comando\n\n` +
      `📝 *Uso:*\n${usedPrefix}${command} <nombre del comando>\n\n` +
      `💡 *Ejemplo:*\n${usedPrefix}${command} anime\n\n` +
      `📖 "Indica qué comando necesitas poner en mantenimiento" 🎨`,
      m, ctxWarn
    )
  }

  // Obtener lista de comandos disponibles
  const commands = Object.values(global.plugins).filter(v => v.help).map(v => v.help[0].split(' ')[0].toLowerCase())
  
  if (!commands.includes(commandName)) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Comando No Encontrado* 🔍\n\n` +
      `⚠️ El comando "${commandName}" no existe\n\n` +
      `📚 "Verifica el nombre del comando y vuelve a intentarlo" 📝`,
      m, ctxErr
    )
  }

  try {
    // Leer y actualizar la base de datos de mantenimiento
    const maintenanceList = readMaintenanceDb() || []
    
    if (maintenanceList.includes(commandName)) {
      return conn.reply(m.chat, 
        `🍙⚠️ *ITSUKI - Comando en Mantenimiento* 🚧\n\n` +
        `ℹ️ El comando "${commandName}" ya está en mantenimiento\n\n` +
        `📚 "Este comando ya fue agregado previamente" 🛠️`,
        m, ctxWarn
      )
    }

    maintenanceList.push(commandName)
    writeMaintenanceDb(maintenanceList)

    await conn.reply(m.chat, 
      `🍙✅ *ITSUKI - Mantenimiento Activado* ⚙️✨\n\n` +
      `🎉 Comando "${commandName}" puesto en mantenimiento\n\n` +
      `📚 "El comando ha sido desactivado temporalmente"\n` +
      `🛠️ "Los usuarios no podrán usarlo hasta nuevo aviso"\n\n` +
      `✅ *Estado:* 🚧 En mantenimiento`,
      m, ctxOk
    )

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
handler.help = ['mantenimiento <comando>']

handler.owner = true
handler.group = false

// Importar funciones de la base de datos (asegúrate de tener estas funciones)
const { readMaintenanceDb, writeMaintenanceDb } = '../lib/database.js'

export default handler