import os from 'os'
import process from 'process'
import { performance } from 'perf_hooks'
import si from 'systeminformation'

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, participants }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    const start = performance.now()
    await m.react('📊')
    
    // Mensaje de espera estilo Itsuki
    conn.sendPresenceUpdate('composing', m.chat)
    let waitingMsg = await conn.reply(m.chat, `🎀 *Itsuki Nakano-IA analizando el servidor...*\n✦ Recolectando datos del sistema en tiempo real... 💫`, m, ctxWarn)

    // Obtener estadísticas del sistema en tiempo real
    const [
      time,
      cpu,
      memory,
      osInfo,
      load,
      networkStats
    ] = await Promise.all([
      si.time(),
      si.currentLoad(),
      si.mem(),
      si.osInfo(),
      si.currentLoad(),
      si.networkStats()
    ])

    const end = performance.now()
    const latency = end - start

    // Información del sistema
    const arch = os.arch()
    const platform = os.platform()
    const release = os.release()
    const hostname = os.hostname()
    const uptime = formatUptime(os.uptime())
    const totalMem = formatBytes(memory.total)
    const freeMem = formatBytes(memory.free)
    const usedMem = formatBytes(memory.used)
    const memUsage = ((memory.used / memory.total) * 100).toFixed(2)
    const swapTotal = formatBytes(memory.swaptotal)
    const swapUsed = formatBytes(memory.swapused)
    const swapUsage = memory.swaptotal > 0 ? ((memory.swapused / memory.swaptotal) * 100).toFixed(2) : '0'

    // Información de CPU
    const cpuModel = os.cpus()[0].model
    const cpuCores = os.cpus().length
    const cpuSpeed = os.cpus()[0].speed + ' MHz'
    const cpuUsage = cpu.currentLoad.toFixed(2)
    const cpuUser = cpu.cpus[0]?.user.toFixed(2) || '0'
    const cpuSystem = cpu.cpus[0]?.system.toFixed(2) || '0'

    // Información de red
    const networkInterface = networkStats[0] || {}
    const rxBytes = formatBytes(networkInterface.rx_bytes || 0)
    const txBytes = formatBytes(networkInterface.tx_bytes || 0)

    // Información del bot
    const nodeVersion = process.version
    const botUptime = formatUptime(process.uptime())
    const memoryUsage = formatBytes(process.memoryUsage().rss)
    const pid = process.pid

    // Crear mensaje con estilo Itsuki
    const message = `
💮 *┌─✦⋅⋅⋅⋅⋅⋅〖 ITS UKI  NAKANO 〗⋅⋅⋅⋅⋅⋅✦─┐*
🎀 *│        ANÁLISIS DEL SERVIDOR       │*
💮 *└─✦⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅✦🌙✦⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅✦─┘*

📖 *INFORMACIÓN DEL SISTEMA*
🎀  ➺ 🏠 *Hostname:* ${hostname}
🎀  ➺ 🖥️ *Plataforma:* ${platform} ${arch}
🎀  ➺ 🐧 *Kernel:* ${release}
🎀  ➺ ⏰ *Uptime Sistema:* ${uptime}

💻 *ESTADO DE LA CPU*
  ➺ 🧠 *Modelo:* ${shortenModel(cpuModel)}
  ➺ 🔧 *Núcleos:* ${cpuCores} cores
  ➺ 🚀 *Velocidad:* ${cpuSpeed}
  ➺ 📈 *Uso Actual:* ${cpuUsage}% ${getBar(cpuUsage)}
  ➺ 👤 *Uso Usuario:* ${cpuUser}%
  ➺ ⚙️ *Uso Sistema:* ${cpuSystem}%

💾 *ESTADO DE LA MEMORIA*
  ➺ 💿 *RAM Total:* ${totalMem}
  ➺ 📊 *RAM Usada:* ${usedMem} (${memUsage}%) ${getBar(memUsage)}
  ➺ 🆓 *RAM Libre:* ${freeMem}
  ➺ 🔄 *Swap Total:* ${swapTotal}
  ➺ 📈 *Swap Usado:* ${swapUsed} (${swapUsage}%)

🌐 *ESTADO DE LA RED*
  ➺ 📥 *Descargado:* ${rxBytes}
  ➺ 📤 *Subido:* ${txBytes}
  ➺ 🏓 *Latencia API:* ${latency.toFixed(2)}ms

🤖 *INFORMACIÓN DEL BOT*
  ➺ 📦 *Node.js:* ${nodeVersion}
  ➺ ⏱️ *Uptime Bot:* ${botUptime}
  ➺ 💾 *Memoria Bot:* ${memoryUsage}
  ➺ 🔢 *PID:* ${pid}

🔗 *PANELES DE CONTROL*
  ➺ 📊 *Dashboard:* dash.deluxehost.cl
  ➺ ⚙️ *Panel Principal:* panel.deluxehost.cl

${getItsukiStatus(cpu.currentLoad, memUsage)}

 *¡El análisis está completo! ¿No es fascinante?* (´｡• ᵕ •｡\`) 
💮 *¡Todo funciona perfectamente para atenderte!* 🌙
    `.trim()

    // Eliminar mensaje de espera
    if (waitingMsg) {
      await conn.sendMessage(m.chat, { delete: waitingMsg.key })
    }

    // Imagen temática de Itsuki Nakano
    const itsukiImage = 'https://files.catbox.moe/h2g54u.jpg'
    
    await conn.sendFile(m.chat, itsukiImage, 'itsuki-server.jpg', message, m, ctxOk)
    await m.react('💫')

  } catch (error) {
    console.error('Error en comando ping:', error)
    
    // Eliminar mensaje de espera si existe
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }
    
    // Mensaje de error estilo Itsuki
    const errorMessage = `
🌷 *¡Oh no! Itsuki-Nakano está un poco confundida...* (´；ω；\`)

💔 *Ocurrió un error al analizar el servidor:*
✦ ${error.message}

📖 *Pero no te preocupes, aquí tienes información básica:*
✦ 🖥️ *Plataforma:* ${os.platform()} ${os.arch()}
✦ 💾 *RAM:* ${formatBytes(os.totalmem())} total
✦ ⏰ *Uptime:* ${formatUptime(os.uptime())}

💮 *¡Itsuki intentará de nuevo más tarde!* (´｡• ᵕ •｡\`)
    `.trim()
    
    await conn.reply(m.chat, errorMessage, m, ctxErr)
    await m.react('❌')
  }
}

// Función para acortar modelo de CPU
function shortenModel(model) {
  return model.replace(/Processor|CPU|@|\(R\)|\(TM\)/gi, '').trim()
}

// Función para crear barras de progreso
function getBar(percentage) {
  const percent = parseFloat(percentage)
  const bars = 10
  const filled = Math.round((percent / 100) * bars)
  const empty = bars - filled
  
  let bar = '【'
  for (let i = 0; i < filled; i++) bar += '■'
  for (let i = 0; i < empty; i++) bar += '─'
  bar += '】'
  
  return bar
}

// Función para determinar el estado del servidor estilo Itsuki
function getItsukiStatus(cpuLoad, memUsage) {
  const cpu = parseFloat(cpuLoad)
  const mem = parseFloat(memUsage)
  
  if (cpu > 90 || mem > 90) {
    return `🔴 * ESTADO DEL SERVIDOR:* ¡CRÍTICO! *Itsuki está preocupada...*\n✦ El servidor necesita atención inmediata (´；ω；\`)`
  } else if (cpu > 70 || mem > 70) {
    return `🟡 * ESTADO DEL SERVIDOR:* ¡ALERTA! *Itsuki está atenta...*\n✦ Los recursos están un poco altos pero funciona (•̀o•́)ง`
  } else {
    return `🟢 *ESTADO DEL SERVIDOR:* ¡ÓPTIMO! *Itsuki está feliz...*\n✦ Todo funciona perfectamente (´｡• ᵕ •｡\`)`
  }
}

// Funciones auxiliares
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

handler.help = ['ping', 'server', 'estado']
handler.tags = ['info', 'itsuki']
handler.command = ['ping', 'server', 'estado', 'stats', 'analisis']
handler.register = true

export default handler