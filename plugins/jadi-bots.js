import ws from 'ws'

async function handler(m, { conn: stars, usedPrefix, command }) {
  let uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  let users = [...uniqueUsers.values()]

  let message = users.map((v, index) => 
    `❒ *${index + 1} »* ${v.user.name || 'Sin nombre~'}\n   ✎ wa.me/${v.user.jid.replace(/[^0-9]/g, '')}`
  ).join('\n\n')

  let replyMessage = message.length === 0 ? '' : message
  let totalUsers = users.length

  let responseMessage = `🌟 *L I S T A   D E   S U B - B O T S* 🌟\n\n`
  responseMessage += `📜 *Total de Sub-Bots activos »* ${totalUsers || '0'}\n\n`

  if (totalUsers === 0) {
    responseMessage += `🌱 No hay Sub-Bots conectados en este momento~\n\n`
    responseMessage += `🪷 *Tip:* Usa el comando para convertirte en Sub-Bot`
  } else {
    responseMessage += `${replyMessage.trim()}\n\n`
    responseMessage += `🌸 ¡Gracias por ser parte de nuestra familia!`
  }

  // Reacción al mensaje
  await m.react('🌱')

  // Enviar mensaje con imagen
  await stars.sendMessage(m.chat, { 
    image: { url: 'https://files.catbox.moe/begfgc.jpg' },
    caption: responseMessage.trim()
  }, { quoted: m })
}

handler.command = ['sockets', 'bots', 'listbots']
handler.help = ['bots', 'sockets', 'listbots']
handler.tags = ['jadibot']

export default handler