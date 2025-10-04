// ===== SISTEMA DE ANTIPRIVADO - ITSUKI NAKANO IA =====
// Guarda este archivo como: antiprivate.js en /plugins/

// ===== PARTE 1: DETECCIÓN Y BLOQUEO AUTOMÁTICO =====
export async function before(m, { conn, isAdmin, isBotAdmin, isROwner }) {
  const ctxErr = global.rcanalx || { contextInfo: { externalAdReply: { title: '❌ Bloqueado', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}

  if (m.isBaileys && m.fromMe) return !0
  if (m.isGroup) return !1
  if (!m.message) return !0
  if (m.sender === conn.user?.jid) return
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('code') || m.text.includes('qr')) return !0
  
  const chat = global.db.data.chats[m.chat]
  const bot = global.db.data.settings[conn.user.jid] || {}
  
  if (m.chat === '120363401404146384@newsletter') return !0
  
  if (bot.antiPrivate && !isROwner) {
    await conn.reply(m.chat, 
      `🍙🚫 *ITSUKI NAKANO IA* 📚🔒\n\n` +
      `⚠️ *Mi creador activó la función antiprivado*\n\n` +
      `🤖 *Bot: Itsuki Nakano IA*\n` +
      `❌ *No se permiten mensajes al privado de esta bot*\n\n` +
      `📢 *Canal Oficial:*\n${global.canalOficial || 'No configurado'}\n\n` +
      `🏘️ *Únete a la comunidad:*\n${global.community || 'No configurado'}\n\n` +
      `💬 "Por favor, usa el grupo para tus consultas"\n` +
      `🔒 *Serás bloqueado automáticamente*\n\n` +
      `🍱 "¡El aprendizaje es mejor en grupo!" 📖✨`, 
      m, 
      { ...ctxErr, mentions: [m.sender] }
    )
    
    await this.updateBlockStatus(m.chat, 'block')
  }
  
  return !1
}

// ===== PARTE 2: COMANDO PARA ACTIVAR/DESACTIVAR =====
let handler = async (m, { conn, args, usedPrefix, command, isROwner }) => {
  const ctxErr = global.rcanalx || { contextInfo: { externalAdReply: { title: '❌ Error', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}
  const ctxWarn = global.rcanalw || { contextInfo: { externalAdReply: { title: '⚠️ Antiprivado', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}
  const ctxOk = global.rcanalr || { contextInfo: { externalAdReply: { title: '✅ Configuración', body: 'Itsuki Nakano IA', thumbnailUrl: 'https://qu.ax/QGAVS.jpg', sourceUrl: global.canalOficial || '' }}}

  if (!isROwner) {
    return conn.reply(m.chat, `🍙❌ *ITSUKI - Acceso Denegado*\n\n⚠️ Solo el owner puede usar este comando\n\n📚 "Este es un comando de administración del bot..."`, m, ctxErr)
  }

  const bot = global.db.data.settings[conn.user.jid] || {}
  const action = args[0]?.toLowerCase()

  if (!action) {
    return conn.reply(m.chat,
      `🍙📚 *ITSUKI - Sistema Antiprivado* 🔒✨\n\n` +
      `📊 *Estado actual:* ${bot.antiPrivate ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'}\n\n` +
      `⚙️ *Opciones:*\n` +
      `• ${usedPrefix}${command} on\n` +
      `• ${usedPrefix}${command} off\n\n` +
      `🚫 *Función:*\n` +
      `Cuando está activado, bloquea automáticamente a cualquier usuario que escriba al privado del bot\n\n` +
      `📚 "Protege tu privado de mensajes no deseados"`,
      m, ctxWarn
    )
  }

  if (action === 'on' || action === 'activar') {
    if (bot.antiPrivate) {
      return conn.reply(m.chat, `🍙⚠️ *ITSUKI - Ya Activado*\n\n✅ El antiprivado ya está activado\n\n📚 "La protección ya está funcionando..."`, m, ctxWarn)
    }

    bot.antiPrivate = true
    await conn.reply(m.chat,
      `🍙🔒 *ITSUKI - Antiprivado ACTIVADO* 📚✨\n\n` +
      `✅ Sistema de antiprivado activado correctamente\n\n` +
      `🚫 *Acciones automáticas:*\n` +
      `• Bloqueo de usuarios que escriban al privado\n` +
      `• Mensaje de advertencia antes de bloquear\n` +
      `• Excepción para el owner\n\n` +
      `📢 *Configuración recomendada:*\n` +
      `Asegúrate de tener configurado:\n` +
      `• Canal oficial: ${global.canalOficial || '❌ No configurado'}\n` +
      `• Comunidad: ${global.community || '❌ No configurado'}\n\n` +
      `🔒 "¡Privado protegido!"\n` +
      `📚✨ "Nadie podrá escribirte al privado ahora"`,
      m, ctxOk
    )
  } 
  else if (action === 'off' || action === 'desactivar') {
    if (!bot.antiPrivate) {
      return conn.reply(m.chat, `🍙⚠️ *ITSUKI - Ya Desactivado*\n\n❌ El antiprivado ya está desactivado\n\n📚 "La protección no está activa..."`, m, ctxWarn)
    }

    bot.antiPrivate = false
    await conn.reply(m.chat,
      `🍙🔓 *ITSUKI - Antiprivado DESACTIVADO* 📚✨\n\n` +
      `✅ Sistema de antiprivado desactivado\n\n` +
      `📢 *Cambios aplicados:*\n` +
      `• Ahora puedes recibir mensajes privados\n` +
      `• No se bloquearán usuarios automáticamente\n` +
      `• El bot responderá normalmente en privado\n\n` +
      `🔓 "¡Privado abierto!"\n` +
      `📚✨ "Ahora puedes recibir mensajes directos"`,
      m, ctxOk
    )
  }
  else {
    await conn.reply(m.chat, `🍙❌ *ITSUKI - Opción Inválida*\n\n⚠️ Usa: on o off\n\n📚 "Elige una opción válida..."`, m, ctxErr)
  }
}

handler.help = ['antiprivate']
handler.tags = ['owner']
handler.command = ['antiprivate', 'antiprivado', 'ap']
handler.rowner = true

export default handler

/*
═══════════════════════════════════════════════
   INSTRUCCIONES DE INSTALACIÓN
═══════════════════════════════════════════════

1. GUARDA ESTE ARCHIVO:
   - Nombre: antiprivate.js
   - Ubicación: /plugins/

2. CONFIGURA EN config.js:
   global.canalOficial = 'https://whatsapp.com/channel/tu-canal'
   global.community = 'https://chat.whatsapp.com/tu-grupo'

3. COMANDOS DISPONIBLES (solo owner):
   .antiprivate          - Ver estado actual
   .antiprivate on       - Activar antiprivado
   .antiprivate off      - Desactivar antiprivado
   
   Alias:
   .antiprivado on/off
   .ap on/off

4. CÓMO FUNCIONA:
   - Cuando está ACTIVADO:
     * Cualquier usuario que escriba al privado del bot
       recibe un mensaje de advertencia
     * Es bloqueado automáticamente
     * El owner NUNCA es bloqueado
   
   - Cuando está DESACTIVADO:
     * El bot funciona normal en privado
     * No bloquea a nadie

5. EXCEPCIONES AUTOMÁTICAS:
   - El owner nunca será bloqueado
   - Juegos (piedra, papel, tijera)
   - Comandos de QR/código
   - Canales de newsletter

═══════════════════════════════════════════════
*/