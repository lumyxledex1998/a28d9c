let handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
  }

  if (!isAdmin) {
    return conn.reply(m.chat, '⚠️ Necesitas ser administrador para usar este comando.', m, ctxErr)
  }

  if (!isBotAdmin) {
    return conn.reply(m.chat, '⚠️ Necesito ser administradora para ver la información.', m, ctxErr)
  }

  try {
    await conn.reply(m.chat, '👻 Analizando actividad en el grupo...', m, ctxOk)

    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupName = groupMetadata.subject || 'Sin nombre'
    const allParticipants = participants
    
    // Obtener información más detallada de cada participante
    let inactiveUsers = []
    let activeUsers = []
    let unknownUsers = []

    // Umbral de inactividad (en días)
    const INACTIVITY_THRESHOLD = 7 // 7 días sin actividad

    for (let participant of allParticipants) {
      try {
        const userJid = participant.id
        const isAdmin = participant.admin || false
        
        // Intentar obtener información de actividad (esto es limitado en WhatsApp)
        let lastSeen = 'Desconocido'
        let status = 'Desconocido'
        let isInactive = false
        
        try {
          // Intentar obtener el estado del usuario
          const userStatus = await conn.fetchStatus(userJid).catch(() => null)
          if (userStatus && userStatus.setAt) {
            const lastSeenDate = new Date(userStatus.setAt)
            const daysSinceLastSeen = Math.floor((new Date() - lastSeenDate) / (1000 * 60 * 60 * 24))
            
            lastSeen = `${daysSinceLastSeen} días`
            isInactive = daysSinceLastSeen > INACTIVITY_THRESHOLD
            status = userStatus.status || 'Sin estado'
          }
        } catch (e) {
          // Si no se puede obtener el estado, usar métodos alternativos
          lastSeen = 'No disponible'
          status = 'Privado'
        }

        const userInfo = {
          jid: userJid,
          name: participant.name || participant.notify || userJid.split('@')[0],
          isAdmin: isAdmin,
          lastSeen: lastSeen,
          status: status,
          isInactive: isInactive
        }

        if (isInactive) {
          inactiveUsers.push(userInfo)
        } else if (lastSeen !== 'Desconocido' && lastSeen !== 'No disponible') {
          activeUsers.push(userInfo)
        } else {
          unknownUsers.push(userInfo)
        }

        // Pequeña pausa para no saturar
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.log(`Error procesando usuario ${participant.id}:`, error.message)
        unknownUsers.push({
          jid: participant.id,
          name: participant.name || participant.notify || participant.id.split('@')[0],
          isAdmin: participant.admin || false,
          lastSeen: 'Error',
          status: 'Error',
          isInactive: false
        })
      }
    }

    // Generar reporte
    let reportMessage = `👻 **REPORTE FANTASMA - USUARIOS INACTIVOS**\n\n`
    reportMessage += `📝 **Grupo:** ${groupName}\n`
    reportMessage += `👥 **Total miembros:** ${allParticipants.length}\n`
    reportMessage += `😴 **Inactivos:** ${inactiveUsers.length}\n`
    reportMessage += `✅ **Activos:** ${activeUsers.length}\n`
    reportMessage += `❓ **Desconocidos:** ${unknownUsers.length}\n`
    reportMessage += `📅 **Umbral de inactividad:** ${INACTIVITY_THRESHOLD} días\n\n`

    // Lista de inactivos
    if (inactiveUsers.length > 0) {
      reportMessage += `😴 **USUARIOS INACTIVOS:**\n`
      inactiveUsers.forEach((user, index) => {
        const mention = `@${user.jid.split('@')[0]}`
        const adminBadge = user.isAdmin ? ' 👑' : ''
        reportMessage += `${index + 1}. ${mention} (${user.name})${adminBadge}\n`
        reportMessage += `   📅 Última vez: ${user.lastSeen}\n`
        reportMessage += `   📝 Estado: ${user.status}\n\n`
      })
    } else {
      reportMessage += `🎉 **¡No hay usuarios inactivos!**\n\n`
    }

    // Estadísticas de administradores
    const inactiveAdmins = inactiveUsers.filter(u => u.isAdmin)
    const activeAdmins = activeUsers.filter(u => u.isAdmin)
    
    if (inactiveAdmins.length > 0) {
      reportMessage += `👑 **ADMINISTRADORES INACTIVOS:**\n`
      inactiveAdmins.forEach((admin, index) => {
        const mention = `@${admin.jid.split('@')[0]}`
        reportMessage += `${index + 1}. ${mention} - ${admin.lastSeen} sin actividad\n`
      })
      reportMessage += `\n`
    }

    // Recomendaciones
    reportMessage += `💡 **RECOMENDACIONES:**\n`
    if (inactiveUsers.length > allParticipants.length * 0.5) {
      reportMessage += `• ⚠️ Más del 50% del grupo está inactivo\n`
      reportMessage += `• 💬 Considera reactivar el grupo con nuevas conversaciones\n`
    }
    if (inactiveAdmins.length > 0) {
      reportMessage += `• 👑 Hay administradores inactivos\n`
      reportMessage += `• 🔄 Considera agregar administradores activos\n`
    }
    
    reportMessage += `• 📊 Revisa periódicamente la actividad del grupo\n`
    reportMessage += `• 🎯 Enfócate en mantener engagement con los activos\n\n`

    reportMessage += `⏰ **Generado:** ${new Date().toLocaleString()}`

    // Enviar reporte
    const mentions = [...inactiveUsers.map(u => u.jid), ...inactiveAdmins.map(u => u.jid)]
    await conn.sendMessage(m.chat, {
      text: reportMessage,
      mentions: mentions
    }, { quoted: m })

    // Enviar resumen rápido
    await conn.reply(m.chat, 
      `👻 **Resumen Fantasma:**\n` +
      `✅ Activos: ${activeUsers.length}\n` +
      `😴 Inactivos: ${inactiveUsers.length}\n` +
      `❓ Desconocidos: ${unknownUsers.length}\n` +
      `📊 Ver reporte completo arriba ↑`,
      m, ctxOk
    )

    // Log en consola
    console.log(`👻 REPORTE FANTASMA GENERADO:
🏷️ Grupo: ${groupName}
👥 Total: ${allParticipants.length}
😴 Inactivos: ${inactiveUsers.length}
✅ Activos: ${activeUsers.length}
❓ Desconocidos: ${unknownUsers.length}
👤 Solicitado por: ${m.sender}
    `)

  } catch (error) {
    console.error('❌ Error en comando fantasma:', error)
    await conn.reply(m.chat, 
      `❌ Error al generar el reporte: ${error.message}`,
      m, ctxErr
    )
  }
}

// Comando adicional para limpiar inactivos (OPCIONAL - usar con cuidado)
let cleanHandler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) return conn.reply(m.chat, '❌ Solo en grupos.', m, ctxErr)
  if (!isAdmin) return conn.reply(m.chat, '⚠️ Necesitas ser admin.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '⚠️ Necesito ser admin.', m, ctxErr)

  try {
    await conn.reply(m.chat, '⚠️ Esta función expulsará a los inactivos. ¿Estás seguro? Responde "SI" para confirmar.', m, ctxWarn)
    
    // Aquí iría la lógica para expulsar inactivos después de confirmación
    // (Se recomienda implementar confirmación por seguridad)

  } catch (error) {
    console.error('Error en limpieza:', error)
    await conn.reply(m.chat, `❌ Error: ${error.message}`, m, ctxErr)
  }
}

handler.help = ['fantasma', 'inactivos', 'ghost']
handler.tags = ['group']
handler.command = ['fantasma', 'inactivos', 'ghost', 'usuariosinactivos']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler