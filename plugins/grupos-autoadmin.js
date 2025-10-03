// Codigo Creado por Félix Creador de Deymoon Club 

let autoadminGlobal = global.autoadminGlobal ?? true // Variable global para activar/desactivar autoadmin
global.autoadminGlobal = autoadminGlobal

const handler = async (m, { conn, isAdmin, isBotAdmin, isROwner, usedPrefix, command, args }) => {
  // Owner: activar/desactivar autoadmin global
  if (['autoadmin'].includes(command) && args.length > 0 && isROwner) {
    if (args[0].toLowerCase() === 'on') {
      if (global.autoadminGlobal) return m.reply('💜 El comando *Autoadmin* ya estaba activado globalmente.')
      global.autoadminGlobal = true
      return m.reply('💜 El comando *Autoadmin* ha sido activado globalmente por mis desarrolladores.')
    }
    if (args[0].toLowerCase() === 'off') {
      if (!global.autoadminGlobal) return m.reply('💜 El comando *Autoadmin* ya estaba desactivado globalmente.')
      global.autoadminGlobal = false
      return m.reply('💜 El comando *Autoadmin* ha sido desactivado globalmente por mis desarrolladores.')
    }
  }

  // Si el comando está desactivado globalmente, avisa
  if (!global.autoadminGlobal && !isROwner) {
    return m.reply('💜 El comando *Autoadmin* Está Desactivado por mis desarrolladores.')
  }

  // Si no es admin, no puede usar el comando
  if (!isAdmin && !isROwner) {
    return m.reply('💜 Este comando solo puede ser usado por admins.')
  }

  // Si el bot no es admin, avisa
  if (!isBotAdmin) {
    return m.reply('Debo ser admin para poder promover a otros usuarios.')
  }

  // Si ya es admin, avisa
  if (isAdmin) {
    return m.reply('Tu ya eres admin.')
  }

  try {
    await m.react('🕒')
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    await m.react('✔️')
    m.reply('💜 Fuiste agregado como admin del grupo con exito.')
  } catch (error) {
    await m.react('✖️')
    m.reply(`💜 Se ha producido un problema\n> Usa *${usedPrefix}report* para informarlo\n\n${error.message}`)
  }
}

handler.tags = ['group']
handler.help = ['autoadmin', 'autoadmin on', 'autoadmin off']
handler.command = ['autoadmin']
handler.group = true

export default handler