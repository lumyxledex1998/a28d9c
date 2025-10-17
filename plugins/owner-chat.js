let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {
    grupos: '🍥 *¡Itsuki está confundida!*\nNo pudo obtener la información de los grupos donde está.'
  })
  const ctxWarn = (global.rcanalw || {
    grupos: '📚 *Itsuki está consultando sus notas...*\nObteniendo información de grupos...'
  })
  const ctxOk = (global.rcanalr || {
    grupos: '🌸 *¡Itsuki lo ha logrado!*\nAquí tienes la información de los grupos:'
  })

  try {
    // Verificar si es propietario del bot
    if (!global.opts['owner']) return conn.reply(m.chat, ctxErr.grupos, m)
    
    // Obtener todos los chats
    let chats = conn.chats.all()
    let groups = chats.filter(chat => chat.jid.endsWith('@g.us'))
    
    if (groups.length === 0) {
      return conn.reply(m.chat, '😕 *Itsuki está sola...*\nNo está en ningún grupo actualmente.', m)
    }

    // Enviar mensaje de procesamiento
    await conn.reply(m.chat, ctxWarn.grupos, m)

    let totalGroups = groups.length
    let groupInfo = `🌸 *INFORMACIÓN DE GRUPOS - ITSUKI NAKANO*\n\n`
    groupInfo += `📊 *Total de Grupos:* ${totalGroups}\n\n`
    groupInfo += `📋 *Lista de Grupos:*\n${'═'.repeat(30)}\n\n`

    // Agregar información de cada grupo
    groups.forEach((group, index) => {
      let groupName = group.name || 'Sin nombre'
      let participants = group.participants ? group.participants.length : '?'
      let groupLink = group.id ? `https://chat.whatsapp.com/${group.id}` : 'No disponible'
      
      groupInfo += `*${index + 1}. ${groupName}*\n`
      groupInfo += `👥 *Miembros:* ${participants}\n`
      groupInfo += `🔗 *Enlace:* ${groupLink}\n`
      groupInfo += `${'─'.repeat(25)}\n`
    })

    // Agregar estadísticas adicionales
    groupInfo += `\n📈 *Estadísticas:*\n`
    groupInfo += `🌸 Itsuki está ayudando en ${totalGroups} grupos\n`
    groupInfo += `📚 Su libro favorito: "La Chica Gourmet"\n`
    groupInfo += `🍥 Siempre lista para ayudar`

    // Enviar la información
    await conn.reply(m.chat, ctxOk.grupos + '\n\n' + groupInfo, m)

  } catch (error) {
    console.error(error)
    conn.reply(m.chat, ctxErr.grupos, m)
  }
}

handler.help = ['grupos', 'listagrupos', 'groups']
handler.tags = ['owner']
handler.command = /^(grupos|listagrupos|groups|itsukigrupos)$/i
handler.owner = true
handler.register = false

export default handler