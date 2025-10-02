let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
  }

  if (!isAdmin && !isBotAdmin) {
    return conn.reply(m.chat, '⚠️ Necesito ser administradora para generar el enlace.', m, ctxErr)
  }

  try {
    await conn.reply(m.chat, '🔗 Generando enlace del grupo...', m, ctxOk)

    // Obtener información del grupo
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupCode = await conn.groupInviteCode(m.chat)
    const inviteLink = `https://chat.whatsapp.com/${groupCode}`
    const groupName = groupMetadata.subject || 'Sin nombre'
    const participantsCount = groupMetadata.participants.length
    const groupDescription = groupMetadata.desc || 'Sin descripción'

    // Crear mensaje con el enlace
    const linkMessage = `
🔗 **ENLACE DEL GRUPO**

📝 **Nombre:** ${groupName}
👥 **Miembros:** ${participantsCount} participantes
📋 **Descripción:** ${groupDescription}

🔗 **Enlace de invitación:**
${inviteLink}

💡 **Para invitar:**
• Comparte este enlace con quien quieras invitar
• El enlace es válido permanentemente
• Puedes revocarlo creando uno nuevo

⚠️ **Nota:** Solo comparte este enlace con personas de confianza.
    `.trim()

    // Enviar el enlace
    await conn.reply(m.chat, linkMessage, m, ctxOk)

    // Opcional: Enviar también como mensaje con botón (si la versión de Baileys lo soporta)
    try {
      await conn.sendMessage(m.chat, {
        text: `📲 *Enlace directo para compartir:*\n${inviteLink}`,
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: '📱 Abrir Grupo',
              url: inviteLink
            }
          },
          {
            index: 2,
            quickReplyButton: {
              displayText: '📋 Copiar Enlace',
              id: `${usedPrefix}copiar ${inviteLink}`
            }
          }
        ]
      })
    } catch (buttonError) {
      console.log('Los botones no están soportados, enviando solo texto')
    }

    // Log en consola
    console.log(`🔗 ENLACE GENERADO:
🏷️ Grupo: ${groupName}
👥 Miembros: ${participantsCount}
🔗 Enlace: ${inviteLink}
👤 Solicitado por: ${m.sender}
🕒 Hora: ${new Date().toLocaleString()}
    `)

  } catch (error) {
    console.error('❌ Error generando enlace:', error)
    
    let errorMessage = '❌ Error al generar el enlace\n\n'
    
    if (error.message.includes('not authorized')) {
      errorMessage += 'No tengo permisos para generar el enlace.\n'
      errorMessage += 'Asegúrate de que soy administradora del grupo.'
    } else if (error.message.includes('group invite')) {
      errorMessage += 'Error al crear el código de invitación.\n'
      errorMessage += 'Intenta nuevamente en unos minutos.'
    } else {
      errorMessage += `Detalle: ${error.message}`
    }
    
    await conn.reply(m.chat, errorMessage, m, ctxErr)
  }
}

// Comando adicional para renovar el enlace
let renewHandler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
  }

  if (!isAdmin && !isBotAdmin) {
    return conn.reply(m.chat, '⚠️ Necesito ser administradora para renovar el enlace.', m, ctxErr)
  }

  try {
    await conn.reply(m.chat, '🔄 Renovando enlace del grupo...', m, ctxOk)

    // Revocar el enlace antiguo y crear uno nuevo
    await conn.groupRevokeInvite(m.chat)
    const newCode = await conn.groupInviteCode(m.chat)
    const newInviteLink = `https://chat.whatsapp.com/${newCode}`
    const groupName = (await conn.groupMetadata(m.chat)).subject || 'Sin nombre'

    const renewMessage = `
🔄 **ENLACE RENOVADO**

✅ Se ha generado un nuevo enlace para el grupo.
🔗 El enlace anterior ha sido revocado.

📝 **Grupo:** ${groupName}
🔗 **Nuevo enlace:**
${newInviteLink}

⚠️ **Importante:**
• El enlace anterior ya no funcionará
• Debes compartir este nuevo enlace
• Los miembros actuales no se verán afectados
    `.trim()

    await conn.reply(m.chat, renewMessage, m, ctxOk)

    console.log(`🔄 ENLACE RENOVADO:
🏷️ Grupo: ${groupName}
🔗 Nuevo enlace: ${newInviteLink}
👤 Solicitado por: ${m.sender}
    `)

  } catch (error) {
    console.error('❌ Error renovando enlace:', error)
    await conn.reply(m.chat, 
      `❌ Error al renovar el enlace: ${error.message}`,
      m, ctxErr
    )
  }
}

// Comando para ver información del grupo
let groupInfoHandler = async (m, { conn }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
  }

  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupCode = await conn.groupInviteCode(m.chat).catch(() => 'No disponible')
    const inviteLink = groupCode !== 'No disponible' ? `https://chat.whatsapp.com/${groupCode}` : 'No disponible'

    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)
    const creator = groupMetadata.owner || 'No disponible'

    const infoMessage = `
📊 **INFORMACIÓN DEL GRUPO**

📝 **Nombre:** ${groupMetadata.subject}
👥 **Miembros:** ${groupMetadata.participants.length}
👑 **Administradores:** ${admins.length}
🛠️ **Creador:** ${creator}
📋 **Descripción:** ${groupMetadata.desc || 'Sin descripción'}
🔗 **Enlace:** ${inviteLink}

📅 **Creado:** ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}
🔒 **Tipo:** ${groupMetadata.restrict ? 'Restringido' : 'Abierto'}
🚫 **Announce:** ${groupMetadata.announce ? 'Solo admins' : 'Todos'}
    `.trim()

    await conn.reply(m.chat, infoMessage, m, ctxOk)

  } catch (error) {
    console.error('❌ Error obteniendo info del grupo:', error)
    await conn.reply(m.chat, 
      `❌ Error al obtener información: ${error.message}`,
      m, ctxErr
    )
  }
}

// Configurar los handlers
handler.help = ['link', 'enlace', 'invitelink']
handler.tags = ['group']
handler.command = ['link', 'enlace', 'invitelink', 'grupolink']
handler.group = true
handler.admin = false
handler.botAdmin = true

// Exportar los comandos adicionales
export {
  renewHandler as renewlink,
  groupInfoHandler as infogrupo
}

export default handler