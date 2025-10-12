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
      `• ${usedPrefix}${command} on <archivo>\n` +
      `• ${usedPrefix}${command} off <archivo>\n\n` +
      `💡 *Ejemplos:*\n` +
      `• ${usedPrefix}${command} on main-menu\n` +
      `• ${usedPrefix}${command} off anime\n\n` +
      `📚 "Activa o desactiva archivos completos del sistema" 🎨`,
      m, ctxWarn
    )
  }

  // Inicializar array si no existe
  if (!global.maintenanceFiles) global.maintenanceFiles = []

  try {
    // Buscar el archivo en los plugins
    let foundFile = null
    let availableFiles = []
    
    for (let plugin of Object.values(global.plugins)) {
      if (plugin.filename) {
        const fullPath = plugin.filename
        const simpleName = fullPath.split('/').pop().replace('.js', '').toLowerCase()
        availableFiles.push(simpleName)
        
        if (simpleName === fileName.toLowerCase() || fullPath.toLowerCase().includes(fileName.toLowerCase())) {
          foundFile = simpleName
          break
        }
      }
    }

    if (!foundFile) {
      let errorMsg = `🍙❌ *ITSUKI - Archivo No Encontrado* 🔍\n\n`
      errorMsg += `⚠️ El archivo "${fileName}" no existe\n\n`
      errorMsg += `📋 *Archivos disponibles:*\n`
      
      // Mostrar primeros 10 archivos disponibles
      availableFiles.slice(0, 10).forEach((file, index) => {
        errorMsg += `${index + 1}. ${file}\n`
      })
      
      if (availableFiles.length > 10) {
        errorMsg += `... y ${availableFiles.length - 10} más\n`
      }
      
      errorMsg += `\n📚 "Usa solo el nombre sin .js" 📝`
      
      return conn.reply(m.chat, errorMsg, m, ctxErr)
    }

    if (action === 'on') {
      if (global.maintenanceFiles.includes(foundFile)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - Ya en Mantenimiento* 🚧\n\n` +
          `ℹ️ El archivo "${foundFile}" ya está en mantenimiento\n\n` +
          `📚 "No es necesario activarlo nuevamente" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceFiles.push(foundFile)

      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Activado* ⚙️✨\n\n` +
        `🎉 Archivo "${foundFile}" puesto en mantenimiento\n\n` +
        `📚 "Todos los comandos de este archivo han sido desactivados"\n` +
        `🛠️ "Nadie podrá usar sus comandos hasta que sea reactivado"\n` +
        `🔒 "Incluyendo al propietario"\n\n` +
        `✅ *Estado:* 🚧 En mantenimiento total`,
        m, ctxOk
      )

    } else if (action === 'off') {
      if (!global.maintenanceFiles.includes(foundFile)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - No en Mantenimiento* ✅\n\n` +
          `ℹ️ El archivo "${foundFile}" no está en mantenimiento\n\n` +
          `📚 "Este archivo ya está activo" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceFiles = global.maintenanceFiles.filter(file => file !== foundFile)

      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Desactivado* ⚙️✨\n\n` +
        `🎉 Archivo "${foundFile}" activado nuevamente\n\n` +
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
handler.help = ['mantenimiento on/off <archivo>']
handler.owner = true
handler.group = false
handler.rowner = true

export default handler