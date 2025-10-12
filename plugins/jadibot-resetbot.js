let handler = async (m, { conn, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  let chat = global.db.data.chats[m.chat];

  if (!m.isGroup) {
    return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Comando solo para grupos*\n\n` +
      `🌸 *Este comando solo puede usarse en grupos...* (´･ω･\`)`,
    m, ctxErr)
  }

  if (!chat || !chat.primaryBot) {
    return conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `ℹ️ *Sin configuración activa*\n\n` +
      `✦ No hay ningún bot principal establecido en este grupo\n\n` +
      `🌸 *No hay nada que restablecer...* (´｡• ᵕ •｡\`)`,
    m, ctxWarn)
  }

  console.log(`[ResetBot] Reseteando configuración para el chat: ${m.chat}`)
  chat.primaryBot = null

  await conn.reply(m.chat,
    `🎀 *Itsuki-Nakano IA*\n\n` +
    `✅ *¡Configuración restablecida!*\n\n` +
    `✦ Se ha eliminado el bot principal del grupo\n\n` +
    `📚 *A partir de ahora:*\n` +
    `• Todos los bots válidos responderán\n` +
    `• Configuración de bot principal removida\n` +
    `• Funcionalidad completa restaurada\n\n` +
    `🔄 *Para configurar un bot principal:*\n` +
    `Usa el comando *${usedPrefix}setprimary*\n\n` +
    `🌸 *¡Restablecimiento exitoso!* (◕‿◕✿)`,
  m, ctxOk)
}

handler.customPrefix = /^(resetbot|resetprimario|botreset)$/i
handler.command = new RegExp

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler