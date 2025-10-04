import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
  const ctxErr = global.rcanalx || { contextInfo: { externalAdReply: { title: '❌ Error', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}
  const ctxWarn = global.rcanalw || { contextInfo: { externalAdReply: { title: '⚠️ Advertencia', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}
  const ctxOk = global.rcanalr || { contextInfo: { externalAdReply: { title: '✅ Bot Primario', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}

  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid)])]
  
  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid)
  }

  const chat = global.db.data.chats[m.chat]
  const mentionedJid = await m.mentionedJid
  const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false

  if (!who) {
    return conn.reply(m.chat, `🍙📚 *ITSUKI - Bot Primario*\n\n❌ Debes mencionar al Sub-Bot que deseas establecer como primario\n\n📝 *Uso:*\n${usedPrefix}setprimary @subbot\n\n📖 "Menciona el bot que ejecutará los comandos..."`, m, ctxWarn)
  }

  if (!subBots.includes(who)) {
    return conn.reply(m.chat, `🍙❌ *ITSUKI - Usuario Inválido*\n\n⚠️ @${who.split`@`[0]} no es un Sub-Bot del sistema\n\n📚 "Solo puedes establecer Sub-Bots oficiales como primarios..."`, m, { ...ctxErr, mentions: [who] })
  }

  if (chat.primaryBot === who) {
    return conn.reply(m.chat, `🍙✅ *ITSUKI - Ya Configurado*\n\n⚠️ @${who.split`@`[0]} ya está establecido como Bot primario en este grupo\n\n📚 "Este bot ya está ejecutando los comandos del grupo"`, m, { ...ctxWarn, mentions: [who] })
  }

  try {
    chat.primaryBot = who
    await conn.reply(m.chat, 
      `🍙🤖 *ITSUKI - Bot Primario Configurado* 📚✨\n\n` +
      `✅ Se ha establecido a @${who.split`@`[0]} como Bot primario\n\n` +
      `📊 *Cambios aplicados:*\n` +
      `• Todos los comandos serán ejecutados por @${who.split`@`[0]}\n` +
      `• Este bot tendrá prioridad en las respuestas\n` +
      `• Los demás bots permanecen en modo secundario\n\n` +
      `📚 "Configuración actualizada correctamente"\n` +
      `🍱✨ "¡El nuevo bot primario ya está activo!"`, 
      m, 
      { ...ctxOk, mentions: [who] }
    )
  } catch (e) {
    await conn.reply(m.chat, 
      `🍙❌ *ITSUKI - Error Crítico*\n\n` +
      `⚠️ Ocurrió un problema al configurar el bot primario\n\n` +
      `📝 *Error:* ${e.message}\n\n` +
      `💡 Usa *${usedPrefix}report* para reportar este error\n\n` +
      `📖 "Por favor, contacta con el desarrollador"`, 
      m, ctxErr
    )
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary', 'botprimario', 'primarybot']
handler.group = true
handler.admin = true

export default handler