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
  const fileName = args[1]?.toLowerCase()

  if (!action || !fileName) {
    return conn.reply(m.chat, 
      `🍙🛠️ *ITSUKI - Sistema de Mantenimiento* ⚙️\n\n` +
      `📝 *Modos disponibles:*\n` +
      `• ${usedPrefix}${command} on <archivo.js>\n` +
      `• ${usedPrefix}${command} off <archivo.js>\n\n` +
      `💡 *Ejemplos:*\n` +
      `• ${usedPrefix}${command} on main-menu.js\n` +
      `• ${usedPrefix}${command} off anime.js\n\n` +
      `📚 "Activa o desactiva archivos completos del sistema" 🎨`,
      m, ctxWarn
    )
  }

  // Inicializar array si no existe
  if (!global.maintenanceFiles) global.maintenanceFiles = []

  // Verificar si el archivo existe en los plugins
  const fileExists = Object.values(global.plugins).some(plugin => {
    const pluginFile = plugin.filename || ''
    return pluginFile.toLowerCase().includes(fileName)
  })

  if (!fileExists) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Archivo No Encontrado* 🔍\n\n` +
      `⚠️ El archivo "${fileName}" no existe\n\n` +
      `📚 "Verifica el nombre del archivo .js" 📝`,
      m, ctxErr
    )
  }

  try {
    if (action === 'on') {
      if (global.maintenanceFiles.includes(fileName)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - Ya en Mantenimiento* 🚧\n\n` +
          `ℹ️ El archivo "${fileName}" ya está en mantenimiento\n\n` +
          `📚 "No es necesario activarlo nuevamente" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceFiles.push(fileName)

      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Activado* ⚙️✨\n\n` +
        `🎉 Archivo "${fileName}" puesto en mantenimiento\n\n` +
        `📚 "Todos los comandos de este archivo han sido desactivados"\n` +
        `🛠️ "Nadie podrá usar sus comandos hasta que sea reactivado"\n` +
        `🔒 "Incluyendo al propietario"\n\n` +
        `✅ *Estado:* 🚧 En mantenimiento total`,
        m, ctxOk
      )

    } else if (action === 'off') {
      if (!global.maintenanceFiles.includes(fileName)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - No en Mantenimiento* ✅\n\n` +
          `ℹ️ El archivo "${fileName}" no está en mantenimiento\n\n` +
          `📚 "Este archivo ya está activo" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceFiles = global.maintenanceFiles.filter(file => file !== fileName)

      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Desactivado* ⚙️✨\n\n` +
        `🎉 Archivo "${fileName}" activado nuevamente\n\n` +
        `📚 "Todos los comandos han sido reactivados exitosamente"\n` +
        `🛠️ "Los usuarios ya pueden usar sus comandos normalmente"\n\n` +
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
handler.help = ['mantenimiento on/off <archivo.js>']
handler.owner = true
handler.group = false
handler.rowner = true

export default handler