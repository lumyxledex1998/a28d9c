let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
  if (!text) return m.reply(`🍙 Envía el enlace del grupo\n\nEjemplo: ${usedPrefix}${command} https://chat.whatsapp.com/xxx`)

  let [_, code] = text.match(linkRegex) || []

  if (!code) return m.reply('🍙 Enlace inválido')

  if (isOwner) {
    try {
      await conn.groupAcceptInvite(code)
      m.reply('✅ Me uní al grupo exitosamente')
    } catch (e) {
      m.reply('❌ Error: ' + e.message)
    }
  } else {
    const owner = (global.owner?.[0]?.[0] || '0')
    try {
      await conn.sendMessage(owner + '@s.whatsapp.net', { 
        text: `🍙 Nueva invitación de @${m.sender.split('@')[0]}\n\n${text}`, 
        mentions: [m.sender] 
      })
      m.reply('✅ Invitación enviada al owner')
    } catch (e) {
      m.reply('❌ Error al enviar: ' + e.message)
    }
  }
}

handler.command = ['invite', 'join']
handler.tags = ['owner']
handler.help = ['invite <link>']

export default handler