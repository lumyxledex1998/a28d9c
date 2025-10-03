const handler = async (m, { conn, isAdmin, groupMetadata, usedPrefix, isBotAdmin, isROwner }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  if (!isROwner) return conn.reply(m.chat, '👑 ❌ Solo el owner puede usar este comando.', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '🤖 ❌ Necesito ser administradora para promover.', m, ctxErr)
  if (isAdmin) return conn.reply(m.chat, '👑 Ya tienes privilegios de administrador.', m, ctxWarn)
  
  try {
    await m.react('🕒')
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    await m.react('✔️')
    
    await conn.reply(m.chat, 
      `🌸✅ **Auto-Admin Activado** 👑\n\n` +
      `📚 *"¡Te he otorgado privilegios de administrador en este grupo!"*\n\n` +
      `👤 *Usuario promovido:* @${m.sender.split('@')[0]}\n` +
      `👑 *Rango:* Administrador\n` +
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

handler.tags = ['owner']
handler.help = ['autoadmin']
handler.command = ['autoadmin']
handler.group = true

export default handler