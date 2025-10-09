import os from 'os'
import process from 'process'
import { performance } from 'perf_hooks'

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, participants }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  try {
    const start = performance.now()
    await m.react('📊')

    // Mensaje de espera
    let waitingMsg = await conn.reply(m.chat, `🎀 *Itsuki Nakano-IA analizando el servidor...*`, m, ctxWarn)

    // Obtener información básica del sistema
    const arch = os.arch()
    const platform = os.platform()
    const release = os.release()
    const hostname = os.hostname()
    const uptime = formatUptime(os.uptime())
    const totalMem = formatBytes(os.totalmem())
    const freeMem = formatBytes(os.freemem())
    const usedMem = formatBytes(os.totalmem() - os.freemem())
    const memUsage = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
    
    // Información de CPU
    const cpuModel = os.cpus()[0].model
    const cpuCores = os.cpus().length
    const cpuSpeed = os.cpus()[0].speed + ' MHz'
    
    // Información del bot
    const nodeVersion = process.version
    const botUptime = formatUptime(process.uptime())
    const memoryUsage = formatBytes(process.memoryUsage().rss)
    
    // Calcular latencia
    const latency = performance.now() - start

    // Crear mensaje
    const message = `

🌟 *ITSUKI NAKANO ANÁLISIS DEL SERVIDOR*

📖 *INFORMACIÓN DEL SISTEMA*
  ➺ 🏠 *Hostname:* ${hostname}
  ➺ 🖥️ *Plataforma:* ${platform} ${arch}
  ➺ 🐧 *Kernel:* ${release}
  ➺ ⏰ *Uptime Sistema:* ${uptime}

💻 *INFORMACIÓN DE CPU*
  ➺ 🧠 *Modelo:* ${shortenModel(cpuModel)}
  ➺ 🔧 *Núcleos:* ${cpuCores} cores
  ➺ 🚀 *Velocidad:* ${cpuSpeed}

💾 *ESTADO DE MEMORIA*
  ➺ 💿 *RAM Total:* ${totalMem}
  ➺ 📊 *RAM Usada:* ${usedMem} (${memUsage}%)
  ➺ 🆓 *RAM Libre:* ${freeMem}

🤖 *INFORMACIÓN DEL BOT*
  ➺ 📦 *Node.js:* ${nodeVersion}
  ➺ ⏱️ *Uptime Bot:* ${botUptime}
  ➺ 💾 *Memoria Bot:* ${memoryUsage}
  ➺ 🏓 *Latencia:* ${latency.toFixed(2)}ms

🔗 *PANELES DE CONTROL*
  ➺ 📊 *Dashboard:* dash.deluxehost.cl
  ➺ ⚙️ *Panel Principal:* panel.deluxehost.cl

🟢 *ESTADO DEL SERVIDOR:* ¡ÓPTIMO! *Itsuki está feliz...*
✦ Todo funciona perfectamente (´｡• ᵕ •｡\`)

🎀 *¡El análisis está completo! ¿No es fascinante?*
💮 *¡Todo funciona para atenderte!* 🌙
    `.trim()

    // Eliminar mensaje de espera
    if (waitingMsg) {
      await conn.sendMessage(m.chat, { delete: waitingMsg.key })
    }

    // URL de imagen de Itsuki Nakano
    const imageUrl = 'https://files.catbox.moe/h2g54u.jpg'

    // Enviar mensaje con imagen
    await conn.sendFile(m.chat, imageUrl, 'itsuki-server.jpg', message, m, ctxOk)
    await m.react('💫')

  } catch (error) {
    console.error('Error en comando serverinfo:', error)
    
    // Mensaje de error simple
    await conn.reply(m.chat, `❌ *Error:* No se pudo obtener la información del servidor`, m, ctxErr)
    await m.react('❌')
  }
}

// Función para acortar modelo de CPU
function shortenModel(model) {
  return model.replace(/Processor|CPU|@|\(R\)|\(TM\)/gi, '').trim().substring(0, 30) + '...'
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
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

handler.help = ['serverinfo']
handler.tags = ['info', 'itsuki'] 
handler.command = ['serverinfo', 'server', 'info']
handler.register = true

export default handler