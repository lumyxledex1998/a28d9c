import fetch from 'node-fetch'

/**

🎀 CREADO POR: LeoXzzsy
🌸 ADAPTADO PARA: Itsuki-Nakano IA
📚 VERSIÓN: 3.4.0 Beta
🏷️ SISTEMA DE DESCARGAS APK
*/

let handler = async (m, { conn, usedPrefix, command, args }) => {
const ctxErr = (global.rcanalx || {})
const ctxWarn = (global.rcanalw || {})
const ctxOk = (global.rcanalr || {})

try {
if (!args[0]) {
return conn.reply(m.chat,
`🎀 *Itsuki-Nakano IA - Descargador APK*\n\n` +
`✦ *Uso correcto:*\n` +
`*${usedPrefix}apk* <nombre_de_la_app>\n\n` +
`✦ *Ejemplos populares:*\n` +
`*${usedPrefix}apk* whatsapp\n` +
`*${usedPrefix}apk* tiktok\n` +
`*${usedPrefix}apk* facebook\n` +
`*${usedPrefix}apk* instagram\n` +
`*${usedPrefix}apk* spotify\n\n` +
`🌸 *Itsuki descargará la aplicación para ti...* (◕‿◕✿)`,
m, ctxWarn)
}

const appName = args.join(' ').toLowerCase()    

// Mensaje de búsqueda - NO se borra    
await conn.reply(m.chat,    
  `🎀 *Itsuki-Nakano IA*\n\n` +    
  `🔍 *Buscando aplicación...*\n` +    
  `✦ Nombre: ${appName}\n` +    
  `✦ Consultando repositorios...\n\n` +    
  `🌸 *Itsuki está trabajando en ello...* 📱`,    
  m, ctxWarn    
)    

// ✅ API CORREGIDA
const apiUrl = `https://mayapi.ooguy.com/apk?query=${encodeURIComponent(appName)}&apikey=may-f53d1d49`    
const response = await fetch(apiUrl, {    
  timeout: 30000    
})    

if (!response.ok) {    
  throw new Error(`Error en la API: ${response.status}`)    
}    

const data = await response.json()    
console.log('📦 Respuesta de API APK:', data)    

if (!data.status || !data.result) {    
  throw new Error('No se encontró la aplicación solicitada')    
}    

const appData = data.result    
const downloadUrl = appData.url    
const appTitle = appData.title || appName    
const appVersion = 'Última versión'    
const appSize = 'Tamaño no especificado'    
const appDeveloper = 'Desarrollador no especificado'    

if (!downloadUrl) {    
  throw new Error('No se encontró enlace de descarga')    
}    

// Mensaje de aplicación encontrada - NO se borra    
await conn.reply(m.chat,    
  `🎀 *Itsuki-Nakano IA*\n\n` +    
  `✅ *¡Aplicación encontrada!*\n\n` +    
  `📱 *Nombre:* ${appTitle}\n` +    
  `🔄 *Versión:* ${appVersion}\n` +    
  `💾 *Tamaño:* ${appSize}\n` +    
  `👨‍💻 *Desarrollador:* ${appDeveloper}\n\n` +    
  `🌸 *Preparando descarga...* ⬇️`,    
  m, ctxOk    
)    

// Enviar el archivo APK    
await conn.sendMessage(m.chat, {    
  document: { url: downloadUrl },    
  mimetype: 'application/vnd.android.package-archive',    
  fileName: `${appTitle.replace(/\s+/g, '_')}_v${appVersion}.apk`,    
  caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +    
          `╰ Creado por: LeoXzzsy 👑\n\n` +    
          `📱 *${appTitle}*\n` +    
          `⭐ Versión: ${appVersion}\n` +    
          `💾 Tamaño: ${appSize}\n` +    
          `👨‍💻 Desarrollador: ${appDeveloper}\n\n` +    
          `⚠️ *Instala bajo tu propia responsabilidad*`    
}, { quoted: m })    

await m.react('✅')

} catch (error) {
console.error('❌ Error en descarga APK:', error)

await conn.reply(m.chat,    
  `🎀 *Itsuki-Nakano IA*\n\n` +    
  `❌ *Error en la descarga*\n\n` +    
  `✦ *Detalles:* ${error.message}\n\n` +    
  `✦ *Posibles causas:*\n` +    
  `• Nombre de aplicación incorrecto\n` +    
  `• Aplicación no disponible\n` +    
  `• Error del servidor\n` +    
  `• Intenta con otro nombre\n\n` +    
  `🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)\n\n` +    
  `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +    
  `╰ Creado por: LeoXzzsy 👑`,    
  m, ctxErr    
)    

await m.react('❌')

}
}

handler.help = ['apk <nombre_app>']
handler.tags = ['downloader']
handler.command = ['apk', 'apkdl', 'descargarapk']
handler.register = true

export default handler
