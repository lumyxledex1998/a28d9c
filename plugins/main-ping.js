let handler = async (m, { conn }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  try {
    // Tiempo inicial
    const start = Date.now()
    
    // Enviar mensaje de prueba
    const sentMsg = await conn.reply(m.chat, '🏓 *Calculando ping...*', m, ctxOk)
    
    // Tiempo final
    const end = Date.now()
    
    // Calcular ping
    const ping = end - start
    
    // Información del bot
    const botInfo = {
      speed: ping < 200 ? '🚀 Rápido' : ping < 500 ? '⚡ Normal' : '🐢 Lento',
      emoji: ping < 200 ? '🏓' : ping < 500 ? '🎯' : '⏳',
      status: ping < 200 ? 'Óptimo' : ping < 500 ? 'Normal' : 'Lento'
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
${botInfo.emoji} *Itsuki Nakano - Estado del Sistema* 🍙📊

🏓 *Ping:* ${ping} ms
📊 *Velocidad:* ${botInfo.speed}
🟢 *Estado:* ${botInfo.status}

💾 *Memoria:* ${memory}
⏱️ *Tiempo activo:* ${uptimeString}
🖥️ *Plataforma:* ${process.platform}
🔧 *Node.js:* ${process.version}

📡 *Latencia del mensaje:* ${ping} ms
${botInfo.emoji} *"¡Sistema operativo y listo para ayudar!"* 🍙✨
    `.trim()
    
    // Editar el mensaje original con los resultados
    await conn.sendMessage(m.chat, {
      text: pingMessage,
      edit: sentMsg.key
    }, { quoted: m })
    
  } catch (error) {
    console.error('Error en ping:', error)
    await conn.reply(m.chat, 
      `❌ *Error calculando ping*\n\n` +
      `🔧 ${error.message}\n\n` +
      `📖 ¡Intenta nuevamente! 🍱✨`,
      m, ctxErr
    )
  }
}

// Comando alternativo más simple y rápido
let handler2 = async (m, { conn }) => {
  const start = performance.now()
  await conn.reply(m.chat, '🏓 Pong!', m)
  const end = performance.now()
  const ping = Math.round(end - start)
  
  await conn.reply(m.chat, 
    `🏓 *Pong!*\n\n` +
    `📡 *Latencia:* ${ping} ms\n` +
    `⚡ *Velocidad:* ${ping < 100 ? 'Excelente' : ping < 300 ? 'Buena' : 'Regular'}\n\n` +
    `🍙 *Itsuki Nakano - Operativa* 📚`,
    m
  )
}

// Comando con medición real de conexión
let handler3 = async (m, { conn }) => {
  const timestamps = []
  
  // Medir 3 veces para mayor precisión
  for (let i = 0; i < 3; i++) {
    const start = Date.now()
    await conn.sendPresenceUpdate('composing', m.chat)
    const end = Date.now()
    timestamps.push(end - start)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  const averagePing = Math.round(timestamps.reduce((a, b) => a + b) / timestamps.length)
  const minPing = Math.min(...timestamps)
  const maxPing = Math.max(...timestamps)
  
  await conn.reply(m.chat, 
    `🎯 *Ping - Itsuki Nakano* 📊\n\n` +
    `📡 *Promedio:* ${averagePing} ms\n` +
    `⬇️ *Mínimo:* ${minPing} ms\n` +
    `⬆️ *Máximo:* ${maxPing} ms\n` +
    `📈 *Estabilidad:* ${maxPing - minPing < 100 ? 'Excelente' : 'Buena'}\n\n` +
    `🏓 *"Conexión estable y lista"* 🍙✨`,
    m
  )
}

// Exportar el handler principal (puedes cambiar a handler2 o handler3 si prefieres)
handler.help = ['ping', 'speed', 'velocidad']
handler.tags = ['main']
handler.command = ['ping', 'speed', 'velocidad', 'latencia']

export default handler