/*let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  // Comando de configuración
  if (m.text && ['!antiarabe', '!antiarab', '!antiarabic'].includes(m.text.toLowerCase().split(' ')[0])) {
    if (!m.isGroup) return m.reply('❌ Solo en grupos.')
    if (!isAdmin) return m.reply('⚠️ Necesitas ser admin.')

    let action = m.text.toLowerCase().split(' ')[1]
    if (!global.antiArab) global.antiArab = {}

    if (action === 'activar' || action === 'on') {
      global.antiArab[m.chat] = true
      m.reply('✅ Anti-árabe activado')
    } else if (action === 'desactivar' || action === 'off') {
      global.antiArab[m.chat] = false
      m.reply('❌ Anti-árabe desactivado')
    } else if (action === 'estado') {
      let status = global.antiArab[m.chat] ? 'ACTIVADO' : 'DESACTIVADO'
      m.reply(`📊 Estado: ${status}`)
    } else {
      m.reply('❌ Usa: !antiarabe activar/desactivar/estado')
    }
    return
  }

  // Detección de texto árabe - FUNCIONA CON CUALQUIER MENSAJE
  if (m.isGroup && m.text && !m.text.startsWith('!')) {
    if (!global.antiArab || !global.antiArab[m.chat]) return

    let text = m.text
    let arabic = /[\u0600-\u06FF]/.test(text)
    
    if (arabic && !isAdmin && m.sender !== conn.user.jid && isBotAdmin) {
      console.log('🚫 EXPULSANDO POR TEXTO ÁRABE:', m.sender)
      
      try {
        // Eliminar mensaje
        if (m.key) {
          await conn.sendMessage(m.chat, { 
            delete: { 
              remoteJid: m.chat, 
              fromMe: false, 
              id: m.key.id, 
              participant: m.sender 
            } 
          })
        }
        
        // Expulsar usuario
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        m.reply('🚫 Usuario expulsado por texto árabe')
        
      } catch (e) {
        console.error('Error:', e)
        m.reply('❌ Error al expulsar')
      }
    }
  }
}

handler.help = ['antiarabe <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabic']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler/*