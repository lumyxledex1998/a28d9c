let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    if (!global.opts['owner']) return conn.reply(m.chat, ctxErr.grupos || '❌ No tienes permisos para usar este comando', m)
    
    let chats = conn.chats.all()
    let groups = chats.filter(chat => chat.jid.endsWith('@g.us'))
    
    if (groups.length === 0) {
      return conn.reply(m.chat, ctxErr.grupos || '😕 No hay grupos disponibles', m)
    }

    await conn.reply(m.chat, ctxWarn.grupos || '📚 Obteniendo información de grupos...', m)

    let totalGroups = groups.length
    let groupInfo = `*🌸 LISTA DE GRUPOS - ITSUKI 🌸*\n\n`
    groupInfo += `📊 *Total:* ${totalGroups} grupos\n`
    groupInfo += `⏰ *Fecha:* ${new Date().toLocaleString()}\n\n`
    groupInfo += `📋 *GRUPOS:*\n${'═'.repeat(35)}\n\n`

    // Limitar a 15 grupos para evitar mensaje muy largo
    let displayGroups = groups.slice(0, 15)
    
    displayGroups.forEach((group, index) => {
      let groupName = group.name || 'Sin nombre'
      let participants = group.participants ? group.participants.length : '?'
      let groupCode = group.id ? group.id : null
      
      groupInfo += `*${index + 1}. ${groupName}*\n`
      groupInfo += `   👥 *Miembros:* ${participants}\n`
      if (groupCode) {
        groupInfo += `   🔗 https://chat.whatsapp.com/${groupCode}\n`
      }
      groupInfo += `   ${'─'.repeat(32)}\n`
    })

    if (groups.length > 15) {
      groupInfo += `\n📝 *Mostrando 15 de ${totalGroups} grupos*\n`
    }

    groupInfo += `\n✨️ *Itsuki Nakano - Siempre aprendiendo*`

    await conn.reply(m.chat, (ctxOk.grupos || '✅ Información obtenida') + '\n\n' + groupInfo, m)

  } catch (error) {
    console.error(error)
    conn.reply(m.chat, ctxErr.grupos || '❌ Error al obtener grupos', m)
  }
}

handler.help = ['grupos', 'listagrupos', 'groups']
handler.tags = ['owner']
handler.command = /^(grupos|listagrupos|groups|itsukigrupos)$/i
handler.owner = true
handler.register = false

export default handler