// cheat-yenes.js - YENES INFINITOS (ACTUALIZADO)
let handler = async (m, { conn, usedPrefix, command, isOwner, args, sender }) => {
  const ctxErr = global.rcanalx || {}
  const ctxWarn = global.rcanalw || {}
  const ctxOk = global.rcanalr || {}
  
  // Inicializar sistema de yenes SIEMPRE
  if (!global.yenesData) global.yenesData = { users: {} }
  if (!global.yenesData.users) global.yenesData.users = {}
  
  const getYenes = (userId) => {
    if (!global.yenesData.users[userId]) {
      global.yenesData.users[userId] = 0
    }
    return global.yenesData.users[userId]
  }
  
  const setYenes = (userId, amount) => {
    global.yenesData.users[userId] = amount < 0 ? 0 : amount
    return global.yenesData.users[userId]
  }

  // Yenes infinitos para mí
  if (command === 'infinito') {
    setYenes(sender, 999999999)
    return conn.reply(m.chat, 
      `🍙∞ *YENES INFINITOS ACTIVADOS* 💴✨\n\n` +
      `💰 *Ahora tienes:* 999,999,999 ¥\n` +
      `👤 *Usuario:* ${m.name || 'Tú'}\n\n` +
      `💡 Usa ${usedPrefix}perfil para ver tus yenes\n\n` +
      `👑 *Poder de creador activado*`,
      m, ctxOk
    )
  }

  // Chetear a otros (solo owner)
  if (command === 'chetar' && isOwner) {
    let target = args[0]
    let amount = parseInt(args[1]) || 999999
    
    if (!target) {
      setYenes(sender, amount)
      return conn.reply(m.chat, 
        `🍙💰 *AUTOCHEAT ACTIVADO* 💴\n\n` +
        `👤 *Para:* ${m.name || 'Tú'}\n` +
        `💰 *Yenes:* ${amount.toLocaleString()} ¥\n\n` +
        `💡 Usa ${usedPrefix}perfil para verificar`,
        m, ctxOk
      )
    }

    if (target.startsWith('@')) {
      target = target.replace('@', '') + '@s.whatsapp.net'
    } else if (!target.includes('@')) {
      target = target + '@s.whatsapp.net'
    }

    setYenes(target, amount)
    const targetName = await conn.getName(target).catch(() => 'Usuario')
    
    return conn.reply(m.chat, 
      `🍙⚡ *CHETEADO EXITOSO* 💴\n\n` +
      `👤 *Usuario:* ${targetName}\n` +
      `💰 *Yenes asignados:* ${amount.toLocaleString()} ¥\n\n` +
      `💡 El usuario puede verlo con ${usedPrefix}perfil`,
      m, ctxOk
    )
  }

  // Ver yenes de cualquier usuario (solo owner)
  if (command === 'beryenes' && isOwner) {
    let target = args[0] || sender
    
    if (target.startsWith('@')) {
      target = target.replace('@', '') + '@s.whatsapp.net'
    } else if (!target.includes('@')) {
      target = target + '@s.whatsapp.net'
    }

    const yenes = getYenes(target)
    const targetName = await conn.getName(target).catch(() => 'Usuario')
    
    return conn.reply(m.chat, 
      `🍙🔍 *YENES DE USUARIO* 💴\n\n` +
      `👤 *Usuario:* ${targetName}\n` +
      `📱 *ID:* ${target.split('@')[0]}\n` +
      `💰 *Yenes:* ${yenes.toLocaleString()} ¥`,
      m, ctxOk
    )
  }

  // Si no es owner y usa comandos de owner
  if ((command === 'chetar' || command === 'beryenes') && !isOwner) {
    return conn.reply(m.chat, 
      `🍙❌ *ACCESO DENEGADO* 🔒\n\n` +
      `⚠️ Comando exclusivo para el propietario\n\n` +
      `💡 Usa ${usedPrefix}infinito para obtener yenes`,
      m, ctxErr
    )
  }
}

handler.command = ['infinito', 'chetar', 'beryenes']
handler.tags = ['Yenes Infinito']
handler.help = ['infinito', 'chetar @usuario cantidad', 'beryenes @usuario']
handler.owner = true

export default handler