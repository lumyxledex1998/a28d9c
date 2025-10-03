// Versión ULTRA SIMPLE que SÍ funciona
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo owner')
  
  const action = args[0]?.toLowerCase()
  
  if (!global.antiprivado) global.antiprivado = false
  
  if (action === 'on') {
    global.antiprivado = true
    m.reply('✅ ANTIPRIVADO ON - Bloquearé privados')
  } else if (action === 'off') {
    global.antiprivado = false  
    m.reply('❌ ANTIPRIVADO OFF')
  } else if (action === 'status') {
    m.reply(`📊 Antiprivado: ${global.antiprivado ? 'ON ✅' : 'OFF ❌'}`)
  } else {
    m.reply(`🔒 Antiprivado: ${global.antiprivado ? 'ACTIVADO' : 'DESACTIVADO'}\n\n${usedPrefix}antiprivado on/off`)
  }
}

// Handler BEFORE más confiable
handler.before = async (m) => {
  if (m.isGroup || m.isBaileys) return false
  if (!global.antiprivado) return false
  
  console.log(`🚫 ANTIPRIVADO: Bloqueando ${m.sender}`)
  
  try {
    // Bloquear inmediatamente
    await m.conn.updateBlockStatus(m.sender, 'block')
    console.log(`✅ BLOQUEADO: ${m.sender}`)
    
    // Enviar mensaje (opcional)
    await m.conn.sendMessage(m.sender, {
      text: '🚫 Acceso bloqueado. No se permiten mensajes privados.'
    })
    
    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

handler.help = ['antiprivado <on/off/status>']
handler.tags = ['owner'] 
handler.command = ['antiprivado']
export default handler