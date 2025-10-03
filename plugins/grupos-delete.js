let handler = async (m, { conn, isGroup }) => {
  if (!m.quoted)
    return conn.reply(m.chat, '❀ Cita el mensaje que deseas eliminar.', m)

  try {
    const botJid = conn.decodeJid(conn.user.id)
    const senderJid = conn.decodeJid(m.sender)
    const quoted = m.quoted
    const quotedJid = conn.decodeJid(quoted.sender)

    const stanzaId = quoted.id || m.message?.extendedTextMessage?.contextInfo?.stanzaId
    const participant = quotedJid || m.message?.extendedTextMessage?.contextInfo?.participant

    if (!stanzaId || !participant)
      return conn.reply(m.chat, '✧ No pude identificar el mensaje a eliminar.', m)

    if (quotedJid === botJid) {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: true,
          id: stanzaId
        }
      })
    } else {
      if (isGroup) {
        const { participants } = await conn.groupMetadata(m.chat)
        const isAdmin = jid => participants.some(p => p.id === jid && /admin|superadmin/i.test(p.admin || ''))

        if (!isAdmin(senderJid))
          return conn.reply(m.chat,${emoji} Solo los administradores pueden borrar mensajes de otros usuarios.', m)

        if (!isAdmin(botJid))
          return conn.reply(m.chat, handler.botAdmin, m)
      }

      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: stanzaId,
          participant: participant
        }
      })
    }
  } catch (err) {
    console.error('[*{emoji} ERROR delete]', err)
    conn.reply(m.chat, '${emoji} No se pudo eliminar el mensaje. WhatsApp podría estar limitando esta acción.', m)
  }
}

handler.help = ['delete']
handler.tags = ['group']
handler.command = ['del', 'delete']
handler.botAdmin = true
handler.admin = true

export default handler