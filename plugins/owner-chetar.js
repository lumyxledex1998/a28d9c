// cheat-yenes.js - YENES INFINITOS (MEJORADO)
let handler = async (m, { conn, usedPrefix, command, isOwner, args, sender }) => {
  const ctxErr = global.rcanalx || {}
  const ctxWarn = global.rcanalw || {}
  const ctxOk = global.rcanalr || {}
  
  // Inicializar sistema de yenes en la base de datos global
  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {}
  
  // Función para obtener yenes (compatible con sistema existente)
  const getYenes = (userId) => {
    if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
    return global.db.data.users[userId].yenes || 
           global.db.data.users[userId].money || 
           global.db.data.users[userId].moneda || 0
  }
  
  // Función para establecer yenes
  const setYenes = (userId, amount) => {
    if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
    global.db.data.users[userId].yenes = amount
    global.db.data.users[userId].money = amount // Compatibilidad
    global.db.data.users[userId].moneda = amount // Compatibilidad
    return amount
  }

  // Yenes infinitos para mí
  if (command === 'infinito') {
    setYenes(sender, 999999999)
    return conn.reply(m.chat, 
      `🍙∞ *YENES INFINITOS ACTIVADOS* 💴✨\n\n` +
      `💰 *Yenes asignados:* 999,999,999 ¥\n` +
      `👤 *Para:* ${m.name || 'Tú'}\n\n` +
      `💡 Usa ${usedPrefix}perfil para verificar\n\n` +
      `👑 *¡Ahora eres rico!*`,
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
        `💰 *Yenes:* ${amount.toLocaleString()} ¥`,
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
      `💰 *Yenes asignados:* ${amount.toLocaleString()} ¥\n` +
      `🎯 *Estado:* ¡Usuario cheteado!`,
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
      `🍙🔍 *INFORMACIÓN DE YENES* 💴\n\n` +
      `👤 *Usuario:* ${targetName}\n` +
      `📱 *ID:* ${target.split('@')[0]}\n` +
      `💰 *Yenes:* ${yenes.toLocaleString()} ¥\n` +
      `💳 *En sistema:* ${global.db.data.users[target] ? 'SÍ' : 'NO'}`,
      m, ctxOk
    )
  }

  if ((command === 'chetar' || command === 'beryenes') && !isOwner) {
    return conn.reply(m.chat, 
      `🍙❌ *ACCESO DENEGADO* 🔒\n\n` +
      `⚠️ Solo LeoXzz puede usar este comando`,
      m, ctxErr
    )
  }
}

handler.command = ['infinito', 'chetar', 'beryenes']
handler.tags = ['yenes']
handler.help = ['infinito', 'chetar @usuario cantidad', 'beryenes @usuario']
handler.owner = true

export default handler