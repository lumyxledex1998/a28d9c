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
  let fileName = args[1]?.toLowerCase()

  if (!action || !fileName) {
    return conn.reply(m.chat, 
      `🍙🛠️ *ITSUKI - Sistema de Mantenimiento* ⚙️\n\n` +
      `📝 *Modos disponibles:*\n` +
      `• ${usedPrefix}${command} on <archivo.js>\n` +
      `• ${usedPrefix}${command} off <archivo.js>\n\n` +
      `💡 *Ejemplos:*\n` +
      `• ${usedPrefix}${command} on main-report.js\n` +
      `• ${usedPrefix}${command} off anime.js\n\n` +
      `📚 "Activa o desactiva archivos completos del sistema" 🎨`,
      m, ctxWarn
    )
  }

  // Asegurar que tenga .js
  if (!fileName.endsWith('.js')) {
    fileName += '.js'
  }

  // Inicializar array si no existe
  if (!global.maintenanceFiles) global.maintenanceFiles = []

  try {
    const fileToManage = fileName.toLowerCase()

    if (action === 'on') {
      if (global.maintenanceFiles.includes(fileToManage)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - Ya en Mantenimiento* 🚧\n\n` +
          `ℹ️ El archivo "${fileToManage}" ya está en mantenimiento\n\n` +
          `📚 "No es necesario activarlo nuevamente" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceFiles.push(fileToManage)

      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Activado* ⚙️✨\n\n` +
        `🎉 Archivo "${fileToManage}" puesto en mantenimiento\n\n` +
        `📚 "Todos los comandos de este archivo han sido desactivados"\n` +
        `🛠️ "Nadie podrá usar sus comandos hasta que sea reactivado"\n` +
        `🔒 "Incluyendo al propietario"\n\n` +
        `✅ *Estado:* 🚧 En mantenimiento total`,
        m, ctxOk
      )

    } else if (action === 'off') {
      if (!global.maintenanceFiles.includes(fileToManage)) {
        return conn.reply(m.chat, 
          `🍙⚠️ *ITSUKI - No en Mantenimiento* ✅\n\n` +
          `ℹ️ El archivo "${fileToManage}" no está en mantenimiento\n\n` +
          `📚 "Este archivo ya está activo" 🛠️`,
          m, ctxWarn
        )
      }
      global.maintenanceFiles = global.maintenanceFiles.filter(file => file !== fileToManage)

      await conn.reply(m.chat, 
        `🍙✅ *ITSUKI - Mantenimiento Desactivado* ⚙️✨\n\n` +
        `🎉 Archivo "${fileToManage}" activado nuevamente\n\n` +
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

// Comando para ver archivos en mantenimiento
let listHandler = async (m, { conn, usedPrefix, command, isOwner }) => {
  if (!isOwner) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Acceso Denegado* 🔒\n\n` +
      `⚠️ Este comando es exclusivo para el propietario\n\n` +
      `📚 "Lo siento, solo LeoXzz puede usar este comando" 🎀`,
      m, ctxErr
    )
  }

  if (!global.maintenanceFiles || global.maintenanceFiles.length === 0) {
    return conn.reply(m.chat, 
      `🍙✅ *ITSUKI - Estado de Mantenimiento* ⚙️\n\n` +
      `📊 No hay archivos en mantenimiento\n\n` +
      `🎉 "Todos los archivos están activos y funcionando"\n` +
      `✨ "¡El sistema está operando al 100%!" 🎀`,
      m, ctxOk
    )
  }

  let maintenanceText = `🍙🛠️ *ITSUKI - Archivos en Mantenimiento* 🚧\n\n`
  maintenanceText += `📊 *Total de archivos:* ${global.maintenanceFiles.length}\n\n`
  maintenanceText += `📋 *Lista:*\n`
  
  global.maintenanceFiles.forEach((file, index) => {
    maintenanceText += `${index + 1}. ${file} 🚧\n`
  })
  
  maintenanceText += `\n📝 *Para quitar mantenimiento:*\n`
  maintenanceText += `${usedPrefix}mantenimiento off <archivo.js>\n\n`
  maintenanceText += `📚 "Estos archivos están desactivados para todos" 🔒`

  await conn.reply(m.chat, maintenanceText, m, ctxWarn)
}

// Comando para limpiar todo el mantenimiento
let clearHandler = async (m, { conn, usedPrefix, command, isOwner }) => {
  if (!isOwner) {
    return conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Acceso Denegado* 🔒\n\n` +
      `⚠️ Este comando es exclusivo para el propietario\n\n` +
      `📚 "Lo siento, solo LeoXzz puede usar este comando" 🎀`,
      m, ctxErr
    )
  }

  if (!global.maintenanceFiles || global.maintenanceFiles.length === 0) {
    return conn.reply(m.chat, 
      `🍙✅ *ITSUKI - Limpieza de Mantenimiento* 🧹\n\n` +
      `📊 No hay archivos en mantenimiento para limpiar\n\n` +
      `🎉 "El sistema ya está completamente activo" ✨`,
      m, ctxOk
    )
  }

  const count = global.maintenanceFiles.length
  global.maintenanceFiles = []

  await conn.reply(m.chat, 
    `🍙✅ *ITSUKI - Mantenimiento Limpiado* 🧹✨\n\n` +
    `🎉 Se removieron ${count} archivos del mantenimiento\n\n` +
    `📚 "Todos los archivos han sido reactivados"\n` +
    `🛠️ "El sistema está completamente operativo"\n\n` +
    `✅ *Estado:* 🟢 Todo activo y funcionando`,
    m, ctxOk
  )
}

// Handler principal
handler.command = ['mantenimiento', 'maintenance', 'mant']
handler.tags = ['owner']
handler.help = ['mantenimiento on/off <archivo.js>']
handler.owner = true
handler.group = false
handler.rowner = true

// Handler de lista
listHandler.command = ['mantenimientos', 'listamantenimiento', 'maintenances']
listHandler.tags = ['owner']
listHandler.help = ['mantenimientos']
listHandler.owner = true
listHandler.group = false

// Handler de limpieza
clearHandler.command = ['limpiarmantenimiento', 'clearmaintenance', 'mantclear']
clearHandler.tags = ['owner']
clearHandler.help = ['limpiarmantenimiento']
clearHandler.owner = true
clearHandler.group = false

export { handler as default, listHandler, clearHandler }