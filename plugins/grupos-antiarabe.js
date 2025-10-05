let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Verificar si es un comando de configuración
  if (['antiarabe', 'antiarab', 'antiarabes'].includes(command)) {
    if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
    if (!isAdmin) return conn.reply(m.chat, '⚠️ Necesitas ser administrador.', m, ctxErr)

    const action = args[0]?.toLowerCase()

    if (!action) {
      return conn.reply(m.chat, `
🛡️ **Anti-Árabe**

⚙️ *Opciones:*
• ${usedPrefix}antiarabe activar
• ${usedPrefix}antiarabe desactivar
• ${usedPrefix}antiarabe estado
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado
    if (!global.antiArabStatus) global.antiArabStatus = {}
    if (!global.antiArabStatus[m.chat]) global.antiArabStatus[m.chat] = true

    switch (action) {
      case 'activar':
      case 'on':
        global.antiArabStatus[m.chat] = true
        await conn.reply(m.chat, '✅ *Anti-Árabe Activado*', m, ctxOk)
        break

      case 'desactivar':
      case 'off':
        global.antiArabStatus[m.chat] = false
        await conn.reply(m.chat, '❌ *Anti-Árabe Desactivado*', m, ctxWarn)
        break

      case 'estado':
      case 'status':
        const status = global.antiArabStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, `📊 *Estado:* ${status}`, m, ctxOk)
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida', m, ctxErr)
    }
    return
  }
}

// Códigos de país árabes
const arabCountryCodes = [
  '966', '971', '973', '974', '965', '968', '967', '963', '962', '961',
  '970', '964', '20', '212', '213', '216', '218', '249'
]

// Caracteres árabes
const arabicChars = /[\u0600-\u06FF]/

// Detectar cuando alguien se une
handler.participantsUpdate = async function(participantsUpdate) {
  try {
    const { id, participants, action } = participantsUpdate
    if (action !== 'add') return

    console.log(`🔍 Anti-árabe: Verificando nuevo participante en ${id}`)

    if (!global.antiArabStatus || global.antiArabStatus[id] === false) {
      console.log('❌ Anti-árabe desactivado en este grupo')
      return
    }

    const groupMetadata = await this.groupMetadata(id).catch(() => null)
    if (!groupMetadata) {
      console.log('❌ No se pudo obtener metadata del grupo')
      return
    }

    for (const participant of participants) {
      await checkArabUser(this, id, participant, groupMetadata)
    }
  } catch (error) {
    console.error('❌ Error en participantsUpdate:', error)
  }
}

// Función para detectar y expulsar
async function checkArabUser(conn, groupId, userId, groupMetadata) {
  try {
    console.log(`🔍 Verificando usuario: ${userId}`)

    const userNumber = userId.split('@')[0]
    const contact = await conn.getContact(userId).catch(() => {})
    const userName = contact?.name || ''
    const userStatus = contact?.status || ''

    console.log(`📞 Número: ${userNumber}, Nombre: ${userName}`)

    // Detección por código de país
    const isArabByCountryCode = arabCountryCodes.some(code => 
      userNumber.startsWith(code)
    )

    // Detección por caracteres árabes en nombre
    const hasArabicName = arabicChars.test(userName)
    
    // Detección por caracteres árabes en biografía
    const hasArabicBio = arabicChars.test(userStatus)

    console.log(`🔍 Detección - Código país: ${isArabByCountryCode}, Nombre árabe: ${hasArabicName}, Bio árabe: ${hasArabicBio}`)

    // Si cumple algún criterio
    if (isArabByCountryCode || hasArabicName || hasArabicBio) {
      console.log(`🚫 Usuario árabe detectado: ${userNumber}`)
      
      const isBotAdmin = groupMetadata.participants.find(p => p.id === conn.user.jid)?.admin
      
      if (isBotAdmin) {
        console.log(`✅ Bot es admin, expulsando...`)
        
        // Expulsar al usuario
        await conn.groupParticipantsUpdate(groupId, [userId], 'remove')
        
        // Mensaje corto
        await conn.sendMessage(groupId, {
          text: `🚫 Árabe Detectado y Eliminado`,
          mentions: [userId]
        })

        console.log(`✅ Árabe expulsado exitosamente: ${userNumber}`)
      } else {
        console.log(`❌ Bot no es admin, no puede expulsar`)
      }
    } else {
      console.log(`✅ Usuario no es árabe: ${userNumber}`)
    }

  } catch (error) {
    console.error('❌ Error en checkArabUser:', error)
  }
}

// También verificar mensajes
handler.before = async (m) => {
  if (m.isBaileys || !m.isGroup) return
  
  console.log(`🔍 Anti-árabe: Verificando mensaje de ${m.sender}`)

  // Verificar si el anti-árabe está activo
  if (!global.antiArabStatus || global.antiArabStatus[m.chat] === false) {
    console.log('❌ Anti-árabe desactivado')
    return
  }

  const sender = m.sender
  const groupMetadata = await m.getChat().catch(() => null)
  if (!groupMetadata) {
    console.log('❌ No se pudo obtener metadata')
    return
  }

  // Verificar si el remitente es árabe
  await checkArabUser(this, m.chat, sender, groupMetadata)
}

handler.help = ['antiarabe <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabes']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler