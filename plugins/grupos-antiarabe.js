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
    if (!global.antiArabStatus[m.chat]) global.antiArabStatus[m.chat] = false

    switch (action) {
      case 'activar':
      case 'on':
        global.antiArabStatus[m.chat] = true
        await conn.reply(m.chat, '✅ *Anti-Árabe Activado*\n\nEl bot expulsará automáticamente a números árabes.', m, ctxOk)
        break

      case 'desactivar':
      case 'off':
        global.antiArabStatus[m.chat] = false
        await conn.reply(m.chat, '❌ *Anti-Árabe Desactivado*', m, ctxWarn)
        break

      case 'estado':
      case 'status':
        const status = global.antiArabStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        await conn.reply(m.chat, `📊 *Estado Anti-Árabe:* ${status}`, m, ctxOk)
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: activar, desactivar o estado', m, ctxErr)
    }
    return
  }
}

// CÓDIGOS DE PAÍS ÁRABES PRINCIPALES
const arabCountryCodes = [
  '966', // Arabia Saudita
  '971', // Emiratos Árabes
  '973', // Bahréin
  '974', // Qatar
  '965', // Kuwait
  '968', // Omán
  '967', // Yemen
  '963', // Siria
  '962', // Jordania
  '961', // Líbano
  '970', // Palestina
  '964', // Irak
  '20',  // Egipto
  '212', // Marruecos
  '213', // Argelia
  '216', // Túnez
  '218', // Libia
  '249', // Sudán
  '252', // Somalia
  '253', // Yibuti
  '222', // Mauritania
  '235'  // Chad
]

// Caracteres árabes
const arabicChars = /[\u0600-\u06FF]/

// Nombres árabes comunes
const arabicNames = [
  'mohamed', 'mohammad', 'mohammed', 'ahmed', 'ali', 'omar', 'youssef', 'khaled',
  'abdul', 'abdullah', 'ibrahim', 'hassan', 'hussein', 'mahmoud', 'mustafa',
  'yasin', 'zakaria', 'fatima', 'aisha', 'zainab', 'mariam'
]

// Detectar cuando alguien se une al grupo
handler.participantsUpdate = async function(participantsUpdate) {
  try {
    const { id, participants, action } = participantsUpdate
    
    // Solo procesar cuando se agregan participantes
    if (action !== 'add') return

    console.log(`🔍 Anti-árabe: Detectado nuevo participante en grupo ${id}`)

    // Verificar si el anti-árabe está activo en este grupo
    if (!global.antiArabStatus || !global.antiArabStatus[id]) {
      console.log('❌ Anti-árabe desactivado en este grupo')
      return
    }

    // Obtener información del grupo
    const groupMetadata = await this.groupMetadata(id).catch(() => null)
    if (!groupMetadata) {
      console.log('❌ No se pudo obtener información del grupo')
      return
    }

    // Verificar si el bot es administrador
    const botParticipant = groupMetadata.participants.find(p => p.id === this.user.jid)
    if (!botParticipant || !['admin', 'superadmin'].includes(botParticipant.admin)) {
      console.log('❌ El bot no es administrador, no puede expulsar')
      return
    }

    // Procesar cada nuevo participante
    for (const participant of participants) {
      await processNewParticipant(this, id, participant, groupMetadata)
    }

  } catch (error) {
    console.error('❌ Error crítico en anti-árabe:', error)
  }
}

// Función para procesar nuevo participante
async function processNewParticipant(conn, groupId, userId, groupMetadata) {
  try {
    const userNumber = userId.split('@')[0]
    console.log(`🔍 Analizando usuario: ${userNumber}`)

    // Obtener información del contacto
    let userName = ''
    let userStatus = ''
    
    try {
      const contact = await conn.getContact(userId)
      userName = contact?.name || ''
      userStatus = contact?.status || ''
    } catch (e) {
      console.log('⚠️ No se pudo obtener información del contacto')
    }

    // 1. Detección por código de país
    const isArabByCountryCode = arabCountryCodes.some(code => 
      userNumber.startsWith(code)
    )

    // 2. Detección por caracteres árabes en nombre
    const hasArabicName = arabicChars.test(userName)

    // 3. Detección por nombres árabes
    const hasArabicNamePattern = arabicNames.some(name => 
      userName.toLowerCase().includes(name.toLowerCase())
    )

    console.log(`📊 Resultados detección para ${userNumber}:`)
    console.log(`   - Código país árabe: ${isArabByCountryCode}`)
    console.log(`   - Nombre con árabe: ${hasArabicName}`)
    console.log(`   - Patrón nombre árabe: ${hasArabicNamePattern}`)

    // Si cumple AL MENOS UN criterio, se expulsa
    if (isArabByCountryCode || hasArabicName || hasArabicNamePattern) {
      console.log(`🚫 USUARIO ÁRABE DETECTADO: ${userNumber}`)
      
      try {
        // Expulsar al usuario
        await conn.groupParticipantsUpdate(groupId, [userId], 'remove')
        console.log(`✅ Usuario árabe expulsado: ${userNumber}`)
        
        // Enviar mensaje de confirmación al grupo
        await conn.sendMessage(groupId, { 
          text: `🚫 Árabe Detectado y Eliminado\n📵 ${userNumber}`,
          mentions: [userId]
        })
        
      } catch (expelError) {
        console.error('❌ Error al expulsar usuario:', expelError)
      }
    } else {
      console.log(`✅ Usuario permitido: ${userNumber}`)
    }

  } catch (error) {
    console.error('❌ Error en processNewParticipant:', error)
  }
}

// Comando para probar la detección
handler.test = async (m, { conn, args }) => {
  if (!m.isGroup) return
  if (!isAdmin) return
  
  const testNumber = args[0] || '966551234567'
  const isArab = arabCountryCodes.some(code => testNumber.startsWith(code))
  
  await conn.reply(m.chat, 
    `🧪 *Prueba Anti-Árabe*\n\n` +
    `🔢 Número: ${testNumber}\n` +
    `🛡️ Detectado como árabe: ${isArab ? '✅ SÍ' : '❌ NO'}\n` +
    `📊 Estado sistema: ${global.antiArabStatus?.[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'}`,
    m
  )
}

handler.help = ['antiarabe <activar/desactivar/estado>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabes']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler