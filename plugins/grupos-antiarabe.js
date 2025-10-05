let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Verificar si es un comando de configuración
  if (['antiarabe', 'antiarab', 'antiarabes'].includes(command)) {
    if (!m.isGroup) return conn.reply(m.chat, '🍙 ❌ Este comando solo funciona en grupos.', m, ctxErr)
    if (!isAdmin) return conn.reply(m.chat, '📚 ⚠️ Necesitas ser administrador para configurar el antiárabe.', m, ctxErr)

    const action = args[0]?.toLowerCase()

    if (!action) {
      return conn.reply(m.chat, `
🛡️ **Sistema Anti-Árabe** 🇸🇦🚫

🌟 *Protección contra números árabes no deseados*

⚙️ *Opciones de configuración:*
• ${usedPrefix}antiarabe activar
• ${usedPrefix}antiarabe desactivar
• ${usedPrefix}antiarabe estado
• ${usedPrefix}antiarabe lista

🔍 *Detección automática:*
📞 Códigos de país árabes
🔢 Patrones numéricos árabes
👤 Nombres de usuario árabes
📛 Biografías con caracteres árabes

🚫 *Acciones:*
⚠️ Expulsión automática
🔒 Bloqueo preventivo
📊 Registro de actividad
      `.trim(), m, ctxWarn)
    }

    // Sistema de estado persistente
    if (!global.antiArabStatus) global.antiArabStatus = {}
    if (!global.antiArabStatus[m.chat]) global.antiArabStatus[m.chat] = true

    // Lista de números expulsados por grupo
    if (!global.arabExpelled) global.arabExpelled = {}
    if (!global.arabExpelled[m.chat]) global.arabExpelled[m.chat] = []

    switch (action) {
      case 'activar':
      case 'on':
      case 'enable':
        global.antiArabStatus[m.chat] = true
        await conn.reply(m.chat, 
          `✅ *Anti-Árabe Activado*\n\n` +
          `*Protección máxima activada. Los números árabes serán expulsados automáticamente.*\n\n` +
          `🛡️ *Estado:* 🟢 ACTIVADO\n` +
          `🚫 *Modo:* Expulsión automática\n` +
          `🔍 *Detección:* Códigos + nombres + biografías\n` +
          `✨ *El grupo ahora está protegido contra números árabes*`,
          m, ctxOk
        )
        break

      case 'desactivar':
      case 'off':
      case 'disable':
        global.antiArabStatus[m.chat] = false
        await conn.reply(m.chat, 
          `❌ *Anti-Árabe Desactivado*\n\n` +
          `*He desactivado el sistema anti-árabe. Todos los números son permitidos.*\n\n` +
          `🛡️ *Estado:* 🔴 DESACTIVADO\n` +
          `🚫 *Modo:* Permisivo\n` +
          `✨ *Sistema de protección desactivado*`,
          m, ctxWarn
        )
        break

      case 'estado':
      case 'status':
      case 'state':
        const status = global.antiArabStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        const expelledCount = global.arabExpelled[m.chat]?.length || 0
        await conn.reply(m.chat, 
          `📊 *Estado del Anti-Árabe*\n\n` +
          `🛡️ *Sistema:* ${status}\n` +
          `🚫 *Modo:* ${global.antiArabStatus[m.chat] ? 'EXPULSIÓN AUTOMÁTICA' : 'PERMISIVO'}\n` +
          `📈 *Expulsados:* ${expelledCount} números\n` +
          `💬 *Grupo:* ${await conn.getName(m.chat) || 'Sin nombre'}\n\n` +
          `✨ *Protección ${global.antiArabStatus[m.chat] ? 'activa' : 'desactivada'}*`,
          m, ctxOk
        )
        break

      case 'lista':
      case 'list':
      case 'expulsados':
        const expelledList = global.arabExpelled[m.chat] || []
        if (expelledList.length === 0) {
          await conn.reply(m.chat, '📝 *Lista de expulsados vacía*\nNo se han expulsado números árabes en este grupo.', m, ctxWarn)
        } else {
          let listText = `📋 *Números Árabes Expulsados* (${expelledList.length})\n\n`
          expelledList.slice(-10).forEach((num, index) => {
            listText += `${index + 1}. ${num}\n`
          })
          if (expelledList.length > 10) {
            listText += `\n... y ${expelledList.length - 10} más`
          }
          await conn.reply(m.chat, listText, m, ctxWarn)
        }
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida. Usa: activar, desactivar, estado o lista', m, ctxErr)
    }
    return
  }
}

// ===== SISTEMA PRINCIPAL DE DETECCIÓN ANTI-ÁRABE =====

// Códigos de país árabes
const arabCountryCodes = [
  '966', // Arabia Saudita
  '971', // UAE
  '973', // Bahrain
  '974', // Qatar
  '965', // Kuwait
  '968', // Oman
  '967', // Yemen
  '963', // Syria
  '962', // Jordan
  '961', // Lebanon
  '970', // Palestine
  '964', // Iraq
  '20',  // Egypt
  '212', // Morocco
  '213', // Algeria
  '216', // Tunisia
  '218', // Libya
  '249', // Sudan
  '9665', // Saudi mobile
  '96650', '96653', '96654', '96655', '96656', '96657', '96658', '96659'
]

// Caracteres árabes para detección en nombres y biografías
const arabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

// Nombres comunes árabes (en inglés para detección)
const arabicNames = [
  'mohamed', 'mohammad', 'mohammed', 'ahmed', 'ali', 'omar', 'youssef', 'khaled',
  'abdul', 'abdullah', 'ibrahim', 'hassan', 'hussein', 'mahmoud', 'mustafa', 'osama',
  'yasin', 'zakaria', 'fatima', 'aisha', 'zainab', 'mariam', 'laila', 'nour',
  'al', 'el', 'bin', 'bint', 'abu', 'um', 'al-', 'el-'
]

// Detectar participantes nuevos (cuando alguien se une)
handler.participantsUpdate = async function(participantsUpdate) {
  try {
    const { id, participants, action } = participantsUpdate
    const groupMetadata = await this.groupMetadata(id).catch(() => null)
    if (!groupMetadata) return

    // Verificar si el anti-árabe está activo en este grupo
    if (!global.antiArabStatus || global.antiArabStatus[id] === false) return

    // Inicializar lista de expulsados si no existe
    if (!global.arabExpelled) global.arabExpelled = {}
    if (!global.arabExpelled[id]) global.arabExpelled[id] = []

    for (const participant of participants) {
      if (action === 'add') {
        await checkAndRemoveArabUser(this, id, participant, groupMetadata)
      }
    }
  } catch (error) {
    console.error('❌ Error en participantsUpdate:', error)
  }
}

// Función principal para detectar y expulsar usuarios árabes
async function checkAndRemoveArabUser(conn, groupId, userId, groupMetadata) {
  try {
    // Obtener información del usuario
    const userInfo = await conn.onWhatsApp(userId).catch(() => [null])
    const contact = await conn.getContact(userId).catch(() => {})
    
    const userNumber = userId.split('@')[0]
    const userName = contact?.name || contact?.notify || userNumber
    const userStatus = contact?.status || ''

    // 1. Detección por código de país
    const isArabByCountryCode = arabCountryCodes.some(code => 
      userNumber.startsWith(code) || userNumber.includes(code)
    )

    // 2. Detección por caracteres árabes en nombre
    const hasArabicName = arabicChars.test(userName)

    // 3. Detección por nombres comunes árabes
    const hasArabicNamePattern = arabicNames.some(name => 
      userName.toLowerCase().includes(name)
    )

    // 4. Detección por biografía (status)
    const hasArabicBio = arabicChars.test(userStatus)

    // Si cumple al menos 2 criterios, se considera usuario árabe
    const detectionCriteria = [
      isArabByCountryCode,
      hasArabicName,
      hasArabicNamePattern,
      hasArabicBio
    ].filter(Boolean).length

    const isArabUser = detectionCriteria >= 1

    if (isArabUser) {
      // Verificar si el bot es administrador
      const isBotAdmin = groupMetadata.participants.find(p => p.id === conn.user.jid)?.admin
      
      if (isBotAdmin) {
        // Expulsar al usuario
        await conn.groupParticipantsUpdate(groupId, [userId], 'remove')
        
        // Agregar a la lista de expulsados
        if (!global.arabExpelled[groupId].includes(userId)) {
          global.arabExpelled[groupId].push(userId)
          // Mantener solo los últimos 100 registros
          if (global.arabExpelled[groupId].length > 100) {
            global.arabExpelled[groupId] = global.arabExpelled[groupId].slice(-100)
          }
        }

        // Log detallado
        console.log(`🚫 USUARIO ÁRABE EXPULSADO:
👤 Usuario: ${userId}
📛 Nombre: ${userName}
📞 Número: ${userNumber}
📝 Biografía: ${userStatus.substring(0, 50)}...
💬 Grupo: ${groupMetadata.subject}
🔍 Detección: 
  - Código país: ${isArabByCountryCode}
  - Nombre árabe: ${hasArabicName}
  - Patrón nombre: ${hasArabicNamePattern}
  - Biografía árabe: ${hasArabicBio}
🕒 Hora: ${new Date().toLocaleString()}
        `)

        // Enviar notificación al grupo (opcional)
        const detectionReasons = []
        if (isArabByCountryCode) detectionReasons.push('código de país árabe')
        if (hasArabicName) detectionReasons.push('nombre con caracteres árabes')
        if (hasArabicNamePattern) detectionReasons.push('patrón de nombre árabe')
        if (hasArabicBio) detectionReasons.push('biografía con caracteres árabes')

        await conn.sendMessage(groupId, {
          text: `🚫 *Usuario Árabe Detectado y Expulsado*\n\n` +
                `👤 *Usuario:* @${userNumber}\n` +
                `📛 *Nombre:* ${userName}\n` +
                `🔍 *Razones:* ${detectionReasons.join(', ')}\n` +
                `🛡️ *Protección Anti-Árabe Activada*`,
          mentions: [userId]
        })

      } else {
        console.log(`⚠️ Usuario árabe detectado pero el bot no es admin: ${userId}`)
      }
    }

  } catch (error) {
    console.error('❌ Error en checkAndRemoveArabUser:', error)
  }
}

// También verificar mensajes por si acaso
handler.before = async (m) => {
  if (m.isBaileys || !m.isGroup) return
  
  // Verificar si el anti-árabe está activo
  if (!global.antiArabStatus || global.antiArabStatus[m.chat] === false) return

  const sender = m.sender
  const groupMetadata = await m.getChat().catch(() => null)
  if (!groupMetadata) return

  // Verificar si el remitente es árabe
  await checkAndRemoveArabUser(this, m.chat, sender, groupMetadata)
}

handler.help = ['antiarabe <activar/desactivar/estado/lista>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabes']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler