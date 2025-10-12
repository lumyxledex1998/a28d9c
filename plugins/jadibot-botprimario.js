let handler = async (m, { conn, text, usedPrefix, command, isAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  if (!m.isGroup) {
    return conn.reply(m.chat, 
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Comando solo para grupos*\n\n` +
      `🌸 *Este comando solo puede usarse en grupos...* (´･ω･\`)`,
    m, ctxErr)
  }

  if (!isAdmin) {
    return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Solo administradores*\n\n` +
      `✦ Solo los administradores pueden configurar el bot principal\n\n` +
      `🌸 *Itsuki necesita permisos...* (´；ω；\`)`,
    m, ctxErr)
  }

  if (!text) {
    return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA - Configurar Bot Principal*\n\n` +
      `✦ *Uso correcto:*\n` +
      `*${usedPrefix}setprimary* <número_del_bot>\n\n` +
      `✦ *Ejemplo:*\n` +
      `*${usedPrefix}setprimary* 1234567890\n\n` +
      `🌸 *Itsuki necesita saber qué bot será el principal...* (◕‿◕✿)`,
    m, ctxWarn)
  }

  let botJid = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  if (global.db.data.chats[m.chat].primaryBot === botJid) {
    return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `ℹ️ *Bot ya configurado*\n\n` +
      `✦ @${botJid.split`@`[0]} ya es el bot principal de este grupo\n\n` +
      `🌸 *No hay cambios necesarios...* (´｡• ᵕ •｡\`)`,
    m, { mentions: [botJid], ...ctxWarn })
  }

  global.db.data.chats[m.chat].primaryBot = botJid

  let response = 
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `✅ *¡Configuración completada!*\n\n` +
      `✦ Se ha establecido a *@${botJid.split('@')[0]}* como el bot principal\n\n` +
      `📚 *A partir de ahora:*\n` +
      `• Solo este bot responderá comandos\n` +
      `• Los demás bots permanecerán inactivos\n` +
      `• Configuración aplicada para este grupo\n\n` +
      `🔄 *Para restaurar todos los bots:*\n` +
      `Usa el comando *${usedPrefix}resetbot*\n\n` +
      `🌸 *¡Configuración exitosa!* (◕‿◕✿)`

  await conn.sendMessage(m.chat, { 
    text: response, 
    mentions: [botJid] 
  }, { quoted: m, ...ctxOk })
}

handler.help = ['setprimary <número>']
handler.tags = ['group', 'admin']
handler.command = ['setprimary', 'setbot', 'botprincipal']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler