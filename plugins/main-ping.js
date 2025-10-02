let handler = async (m, { conn }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    // Tiempo inicial
    const start = Date.now()

    // Enviar mensaje de prueba
    await conn.reply(m.chat, '🍙🏓 *Calculando velocidad...* 📚✨', m, ctxOk)

    // Tiempo final
    const end = Date.now()

    // Calcular ping
    const ping = end - start

    // Información del bot
    const botInfo = {
      speed: ping < 200 ? '🚀 Excelente' : ping < 500 ? '⚡ Buena' : '🐢 Regular',
      emoji: ping < 200 ? '🎯' : ping < 500 ? '🏓' : '⏳',
      status: ping < 200 ? 'Óptimo' : ping < 500 ? 'Estable' : 'Lento'
    }

    // Obtener uso de memoria
    const used = process.memoryUsage()
    const memory = Math.round(used.rss / 1024 / 1024) + ' MB'

    // Obtener tiempo de actividad
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`

    // Mensaje del ping
    const pingMessage = `
${botInfo.emoji} **Itsuki Nakano - Estado del Sistema** 🍙📊

🏓 *Velocidad:* ${ping} ms
📊 *Conexión:* ${botInfo.speed}
🟢 *Rendimiento:* ${botInfo.status}

💾 *Memoria:* ${memory}
⏱️ *Activo:* ${uptimeString}
🖥️ *Plataforma:* ${process.platform}

🍙 *"¡Sistema listo para ayudar!"* 📚✨
    `.trim()

    // Enviar resultado directamente
    await conn.reply(m.chat, pingMessage, m, ctxOk)

  } catch (error) {
    console.error('Error en ping:', error)
    await conn.reply(m.chat, 
      `❌ *Error en el diagnóstico*\n\n` +
      `🍙 *"¡No pude calcular la velocidad!"*\n\n` +
      `🔧 *Error:* ${error.message}\n\n` +
      `📖 *¡Intenta nuevamente!* 🍱✨`,
      m, ctxErr
    )
  }
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['p', 'ping']

export default handler