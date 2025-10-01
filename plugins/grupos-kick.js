import fetch from 'node-fetch'

async function makeFkontak() {
  try {
    const res = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'Expulsar', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return undefined
  }
}

let handler = async (m, { conn, text, participants, parseUserTargets, getUserInfo, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})
  
  if (!m.isGroup) return conn.reply(m.chat, '🌟 ¡Esto solo funciona en grupos! Como tutora, debo mantener el orden aquí.', m, ctxErr)
  if (!isAdmin) return conn.reply(m.chat, '👑 Necesitas ser administrador para esto. ¡Las reglas son importantes!', m, ctxErr)
  if (!isBotAdmin) return conn.reply(m.chat, '🌸 ¡Necesito permisos de administradora para poder expulsar!', m, ctxErr)

  if (!m.mentionedJid?.length && !m.quoted && !text?.trim()) {
    return conn.reply(m.chat, `
📝 **Forma correcta de usar el comando:**

➪ *kick @usuario*
➪ *kick* (respondiendo a un mensaje)
➪ *kick 123456789* (número específico)

*😤¡Solo puedo ocuparme de una persona a la vez! No soy como mis hermanas que hacen varias cosas a la vez...*
    `.trim(), m, ctxWarn)
  }

  let targets = []
  try {
    targets = await parseUserTargets(m, text, participants, conn)
  } catch {}
  
  if (Array.isArray(targets) && targets.length > 1) targets = [targets[0]]
  if (!targets.length) return conn.reply(m.chat, '❌ No pude identificar al usuario. ¡Debo estudiar más!', m, ctxErr)
  
  const target = targets[0]

  if (target === m.sender) return conn.reply(m.chat, '🤨 ¡No puedes expulsarte a ti mismo! Eso no tiene sentido...', m, ctxErr)
  if (target === conn.user.jid) return conn.reply(m.chat, '😑 ¡No puedo expulsarme a mí misma! ¡Todavía tengo que ayudar con los estudios!', m, ctxErr)

  const info = await getUserInfo(target, participants, conn)
  if (!info.exists) return conn.reply(m.chat, '🪷 Este usuario ya no está en el grupo... ¿se fue antes de que yo actuara?', m, ctxErr)
  if (info.isAdmin || info.isSuperAdmin) return conn.reply(m.chat, '⚠️ ¡No puedo expulsar a otro administrador! Eso sería una falta de respeto.', m, ctxErr)

  let groupName = (await conn.groupMetadata(m.chat))?.subject || 'Grupo'
  let usuario = '@' + m.sender.split('@')[0]
  let newName = info.name || target.split('@')[0]

  let pp = ''
  try {
    pp = await conn.profilePictureUrl(target, 'image')
  } catch {
    try {
      pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      pp = 'https://i.postimg.cc/PrMRZC2C/image.jpg'
    }
  }

  let groupUrl = 'https://whatsapp.com'
  try { 
    if (isBotAdmin) { 
      const code = await conn.groupInviteCode(m.chat); 
      groupUrl = 'https://chat.whatsapp.com/' + code 
    } 
  } catch {}

  // Mensaje estilo Itsuki
  const nombre = `🚫 *Itsuki Nakano - Reporte de Expulsión*

❀ 👤 *Usuario expulsado:* ${newName}
❀ 🎯 *Expulsado por:* ${usuario}
❀ 📄 *Razón:* Comportamiento inapropiado en el grupo

*"Como futura maestra, debo mantener el orden y la disciplina en este grupo. ¡Las reglas existen por una razón!😹*`

  await conn.reply(m.chat, '⏳ Preparando la expulsión... ¡Un momento por favor!', m, ctxWarn)

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    const fancyQuoted = await makeFkontak().catch(() => null)
    
    await conn.sendMessage(
      m.chat,
      {
        text: nombre,
        contextInfo: {
          mentionedJid: [m.sender, target],
          externalAdReply: {
            title: '⛔ Itsuki Nakano - Expulsión',
            body: '¡Mantengamos el orden en el grupo!',
            thumbnailUrl: pp,
            sourceUrl: groupUrl,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: fancyQuoted || m }
    )
  } catch (e) {
    return conn.reply(m.chat, `❌ ¡No pude completar la expulsión! Error: ${e?.message || e}\n\n*¡Tendré que estudiar más para mejorar!*🥹`, m, ctxErr)
  }
}

handler.help = ['kick @usuario | responder | numero']
handler.tags = ['group']
handler.command = ['kick', 'ban', 'expulsar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler