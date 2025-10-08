let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, participants }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

const isClose = { 
    'open': 'not_announcement', 
    'close': 'announcement', 
    'abierto': 'not_announcement', 
    'cerrado': 'announcement', 
    'abrir': 'not_announcement', 
    'cerrar': 'announcement', 
    'desbloquear': 'unlocked', 
    'bloquear': 'locked' 
}[(args[0] || '').toLowerCase()]

if (isClose === undefined) { 
    return conn.reply(m.chat, `*Elija una opción para configurar el grupo*\n\nEjemplo:\n*○ !${command} abrir*\n*○ !${command} cerrar*\n*○ !${command} bloquear*\n*○ !${command} desbloquear*`, m, ctxErr)
}

await conn.groupSettingUpdate(m.chat, isClose)

let message = ''
if (args[0].toLowerCase() === 'cerrar' || args[0].toLowerCase() === 'close' || args[0].toLowerCase() === 'cerrado') {
    message = '🔒 *El grupo ha sido cerrado correctamente*'
} else if (args[0].toLowerCase() === 'abrir' || args[0].toLowerCase() === 'open' || args[0].toLowerCase() === 'abierto') {
    message = '🔓 *El grupo ha sido abierto correctamente*'
} else if (args[0].toLowerCase() === 'bloquear' || args[0].toLowerCase() === 'locked') {
    message = '🚫 *El grupo ha sido bloqueado correctamente*'
} else if (args[0].toLowerCase() === 'desbloquear' || args[0].toLowerCase() === 'unlocked') {
    message = '✅ *El grupo ha sido desbloqueado correctamente*'
} else {
    message = '✅ *Configurado correctamente*'
}

conn.reply(m.chat, message, m, ctxOk)
// await m.react(done) // Descomenta esta línea si tienes definida la variable 'done'
}

handler.help = ['group abrir / cerrar']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler