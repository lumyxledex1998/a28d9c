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

// TODOS LOS CÓDIGOS DE PAÍS ÁRABES COMPLETOS
const arabCountryCodes = [
  // Península Arábiga
  '966', // Arabia Saudita
  '971', // Emiratos Árabes Unidos (UAE)
  '973', // Bahréin
  '974', // Qatar
  '965', // Kuwait
  '968', // Omán
  '967', // Yemen
  
  // Levante Mediterráneo
  '963', // Siria
  '962', // Jordania
  '961', // Líbano
  '970', // Palestina
  '964', // Irak
  
  // Norte de África
  '20',  // Egipto
  '212', // Marruecos
  '213', // Argelia
  '216', // Túnez
  '218', // Libia
  '249', // Sudán
  '252', // Somalia
  '253', // Yibuti
  '291', // Eritrea
  '967', // Yemen del Norte (antiguo)
  '969', // Yemen del Sur (antiguo)
  
  // África Subsahariana
  '222', // Mauritania
  '235', // Chad
  '249', // Sudán del Sur
  
  // Prefijos móviles específicos de Arabia Saudita
  '96650', '96651', '96652', '96653', '96654', '96655', '96656', '96657', '96658', '96659',
  
  // Prefijos móviles UAE
  '97150', '97152', '97154', '97155', '97156', '97158',
  
  // Prefijos móviles Qatar
  '97433', '97455', '97466', '97477',
  
  // Prefijos móviles Kuwait
  '96550', '96551', '96552', '96553', '96554', '96555', '96556', '96557', '96558', '96559',
  '96560', '96561', '96562', '96563', '96564', '96565', '96566', '96567', '96568', '96569',
  '96590', '96591', '96592', '96593', '96594', '96595', '96596', '96597', '96598', '96599',
  
  // Prefijos móviles Omán
  '96891', '96892', '96893', '96894', '96895', '96896', '96897', '96898', '96899',
  
  // Prefijos móviles Bahréin
  '9733', '9736', '9737',
  
  // Prefijos móviles Jordania
  '96277', '96278', '96279',
  
  // Prefijos móviles Líbano
  '9613', '9617', '9618', '9619',
  
  // Prefijos móviles Egipto
  '2010', '2011', '2012', '2015', '2016', '2017', '2018', '2019',
  '20100', '20101', '20102', '20103', '20104', '20105', '20106', '20107', '20108', '20109',
  
  // Prefijos móviles Marruecos
  '2126', '2127',
  
  // Prefijos móviles Argelia
  '2135', '2136', '2137',
  
  // Prefijos móviles Túnez
  '2162', '2164', '2165', '2169',
  
  // Prefijos móviles Libia
  '21891', '21892', '21893', '21894', '21895', '21896', '21897', '21898', '21899',
  
  // Prefijos móviles Sudán
  '2499', '24911', '24912', '24991', '24992', '24993', '24995', '24996', '24997', '24999',
  
  // Prefijos comunes en números internacionales
  '00966', '00971', '00973', '00974', '00965', '00968', '00967',
  '00963', '00962', '00961', '00970', '00964', '0020', '00212',
  '00213', '00216', '00218', '00249', '00252', '00253', '00291',
  '00222', '00235'
]

// Caracteres árabes completos
const arabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

// Nombres árabes comunes
const arabicNames = [
  'mohamed', 'mohammad', 'mohammed', 'ahmed', 'ali', 'omar', 'youssef', 'khaled',
  'abdul', 'abdullah', 'ibrahim', 'hassan', 'hussein', 'mahmoud', 'mustafa', 'osama',
  'yasin', 'zakaria', 'fatima', 'aisha', 'zainab', 'mariam', 'laila', 'nour',
  'al', 'el', 'bin', 'bint', 'abu', 'um', 'al-', 'el-',
  // Nombres adicionales
  'saeed', 'rashid', 'faisal', 'tariq', 'bilal', 'jamal', 'naser', 'saleh',
  'khalid', 'waleed', 'saad', 'badr', 'hamza', 'amir', 'malik', 'karim',
  'riad', 'samir', 'adnan', 'bashar', 'hisham', 'majid', 'nasser', 'qasim',
  'ramy', 'sami', 'tahir', 'younes', 'zayed', 'fahad', 'nawaf', 'turki'
]

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
    
    // Detección por nombres árabes
    const hasArabicNamePattern = arabicNames.some(name => 
      userName.toLowerCase().includes(name)
    )

    console.log(`🔍 Detección - Código país: ${isArabByCountryCode}, Nombre árabe: ${hasArabicName}, Bio árabe: ${hasArabicBio}, Patrón nombre: ${hasArabicNamePattern}`)

    // Si cumple algún criterio
    if (isArabByCountryCode || hasArabicName || hasArabicBio || hasArabicNamePattern) {
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