/*let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  if (['antiarabe', 'antiarab', 'antiarabes'].includes(command)) {
    if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m, ctxErr)
    if (!isAdmin) return conn.reply(m.chat, '⚠️ Necesitas ser administrador.', m, ctxErr)

    const action = args[0]?.toLowerCase()

    if (!action) {
      return conn.reply(m.chat, `
🛡️ **Anti-Árabe EXTREMO** 🇸🇦🚫

⚙️ *Opciones:*
• ${usedPrefix}antiarabe activar
• ${usedPrefix}antiarabe desactivar
• ${usedPrefix}antiarabe estado
• ${usedPrefix}antiarabe lista

🔍 *Detección hiper-agresiva:*
📞 TODOS los códigos árabes
🔤 Nombres + caracteres árabes
📱 WhatsApp mod/business
🔄 Comando "apk" detectado
📛 Biografías árabes
🎯 Expulsión inmediata
      `.trim(), m, ctxWarn)
    }

    if (!global.antiArabStatus) global.antiArabStatus = {}
    if (!global.antiArabStatus[m.chat]) global.antiArabStatus[m.chat] = false
    
    if (!global.arabExpelled) global.arabExpelled = {}
    if (!global.arabExpelled[m.chat]) global.arabExpelled[m.chat] = []

    switch (action) {
      case 'activar':
      case 'on':
        global.antiArabStatus[m.chat] = true
        await conn.reply(m.chat, 
          '✅ *ANTI-ÁRABE EXTREMO ACTIVADO*\n\n' +
          '🛡️ *Protección máxima activada*\n' +
          '📞 Detección por código de país\n' +
          '🔤 Detección por nombres árabes\n' +
          '📱 Detección WhatsApp mod\n' +
          '🔄 Bloqueo comando "apk"\n' +
          '🚫 EXPULSIÓN INMEDIATA',
          m, ctxOk
        )
        break

      case 'desactivar':
      case 'off':
        global.antiArabStatus[m.chat] = false
        await conn.reply(m.chat, '❌ *Anti-Árabe DESACTIVADO*', m, ctxWarn)
        break

      case 'estado':
      case 'status':
        const status = global.antiArabStatus[m.chat] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        const expelledCount = global.arabExpelled[m.chat]?.length || 0
        await conn.reply(m.chat, 
          `📊 *Estado Anti-Árabe EXTREMO*\n\n` +
          `🛡️ Sistema: ${status}\n` +
          `🚫 Expulsados: ${expelledCount} árabes\n` +
          `💬 Grupo: ${await conn.getName(m.chat) || 'Sin nombre'}`,
          m, ctxOk
        )
        break
        
      case 'lista':
      case 'list':
        const expelledList = global.arabExpelled[m.chat] || []
        if (expelledList.length === 0) {
          await conn.reply(m.chat, '📝 No se han expulsado árabes en este grupo.', m, ctxWarn)
        } else {
          let listText = `📋 *Árabes Expulsados* (${expelledList.length})\n\n`
          expelledList.slice(-20).forEach((num, index) => {
            const cleanNum = num.replace('@s.whatsapp.net', '')
            listText += `${index + 1}. ${cleanNum}\n`
          })
          await conn.reply(m.chat, listText, m, ctxWarn)
        }
        break

      default:
        await conn.reply(m.chat, '❌ Opción no válida', m, ctxErr)
    }
    return
  }
}

// ===== SISTEMA EXTREMO DE DETECCIÓN =====

// TODOS los códigos árabes COMPLETOS Y MÁS
const arabCountryCodes = [
  // Arabia Saudita (COMPLETO)
  '966', '96650', '96651', '96652', '96653', '96654', '96655', '96656', '96657', '96658', '96659',
  // Emiratos Árabes (COMPLETO)
  '971', '97150', '97152', '97154', '97155', '97156', '97158', '9712', '9713', '9714', '9715', '9716', '9717',
  // Qatar (COMPLETO)
  '974', '97433', '97455', '97466', '97477', '9743', '9745', '9746', '9747',
  // Kuwait (COMPLETO)
  '965', '9655', '9656', '9659', '96550', '96551', '96552', '96553', '96554', '96555', '96556', '96557', '96558', '96559',
  '96560', '96561', '96562', '96563', '96564', '96565', '96566', '96567', '96568', '96569',
  '96590', '96591', '96592', '96593', '96594', '96595', '96596', '96597', '96598', '96599',
  // Omán (COMPLETO)
  '968', '9689', '96891', '96892', '96893', '96894', '96895', '96896', '96897', '96898', '96899',
  // Bahréin (COMPLETO)
  '973', '9733', '9736', '9737', '97332', '97333', '97334', '97335', '97336', '97337', '97338', '97339',
  // Yemen
  '967', '9677', '9671', '9672', '9673',
  // Siria
  '963', '9639', '96395', '96396', '96399', '9631', '9632', '9633',
  // Jordania
  '962', '96277', '96278', '96279', '9627', '9626', '9625',
  // Líbano
  '961', '9613', '9617', '9618', '9619', '9611', '9614',
  // Palestina
  '970', '9705', '97059', '97056', '97057',
  // Irak
  '964', '9647', '96475', '96476', '96477', '96478', '96479',
  // Egipto (COMPLETO)
  '20', '2010', '2011', '2012', '2015', '2016', '2017', '2018', '2019', '20100', '20101', '20102', '20103', '20104', '20105', '20106', '20107', '20108', '20109',
  '200', '201', '202', '203', '204', '205', '206', '207', '208', '209',
  // Norte de África
  '212', '2126', '2127', '21261', '21262', '21263', '21264', '21265', '21266', '21267', '21268', '21269',
  '213', '2135', '2136', '2137', '21355', '21366', '21377',
  '216', '2162', '2164', '2165', '2169', '21620', '21621', '21622', '21623', '21624', '21625', '21626', '21627', '21628', '21629',
  '218', '21891', '21892', '21893', '21894', '21895', '21896', '21897', '21898', '21899',
  '249', '2499', '24911', '24912', '24991', '24992', '24993', '24995', '24996', '24997', '24999',
  '252', '2526', '2527', '2529',
  '253', '2537', '2538', '2539',
  '222', '2222', '2223', '2224',
  '235', '2356', '2357', '2359',
  // Formatos internacionales
  '00966', '00971', '00973', '00974', '00965', '00968', '00967',
  '00963', '00962', '00961', '00970', '00964', '0020', '00212',
  '00213', '00216', '00218', '00249', '00252', '00253', '00222', '00235'
]

// Caracteres árabes COMPLETOS
const arabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

// Nombres árabes HIPER-COMPLETOS
const arabicNames = [
  'mohamed', 'mohammad', 'mohammed', 'ahmed', 'ali', 'omar', 'youssef', 'khaled',
  'abdul', 'abdullah', 'ibrahim', 'hassan', 'hussein', 'mahmoud', 'mustafa', 'osama',
  'yasin', 'zakaria', 'fatima', 'aisha', 'zainab', 'mariam', 'laila', 'nour',
  'al', 'el', 'bin', 'bint', 'abu', 'um', 'al-', 'el-',
  // Nombres adicionales EXTENSOS
  'saeed', 'rashid', 'faisal', 'tariq', 'bilal', 'jamal', 'naser', 'saleh',
  'khalid', 'waleed', 'saad', 'badr', 'hamza', 'amir', 'malik', 'karim',
  'riad', 'samir', 'adnan', 'bashar', 'hisham', 'majid', 'nasser', 'qasim',
  'ramy', 'sami', 'tahir', 'younes', 'zayed', 'fahad', 'nawaf', 'turki',
  // Variantes de nombres
  'mohamad', 'mohamoud', 'ahmad', 'hussain', 'husein', 'yousif', 'yusuf',
  'khalil', 'farid', 'hadi', 'jamil', 'nabil', 'sabri', 'wassim',
  // Nombres cortos comunes
  'mhd', 'mhmd', 'ahm', 'aly', 'omr', 'yus', 'khl', 'abd', 'has', 'hus',
  'mah', 'mus', 'oss', 'yas', 'zak', 'fat', 'ais', 'zai', 'mar', 'lai', 'nor'
]

// Palabras clave que usan los árabes (incluyendo "apk")
const arabicKeywords = [
  'apk', 'app', 'mod', 'whatsapp mod', 'gb whatsapp', 'fm whatsapp',
  'yowa', 'aero', 'gb', 'fm', 'mods', 'تطبيق', 'تطبيقات', 'تعديل',
  'version', 'update', 'تحميل', 'تنزيل', 'برنامج', 'برامج'
]

// Detectar participantes nuevos - VERSIÓN EXTREMA
handler.participantsUpdate = async function(participantsUpdate) {
  try {
    const { id, participants, action } = participantsUpdate

    if (action !== 'add') return

    console.log(`🛡️ ANTI-ÁRABE EXTREMO: Nuevo participante en grupo ${id}`)

    if (!global.antiArabStatus || !global.antiArabStatus[id]) {
      console.log('❌ Anti-árabe desactivado')
      return
    }

    const groupMetadata = await this.groupMetadata(id).catch(() => null)
    if (!groupMetadata) return

    const isBotAdmin = groupMetadata.participants.find(p => p.id === this.user.jid)?.admin
    if (!isBotAdmin) {
      console.log('❌ Bot no es administrador')
      return
    }

    for (const participant of participants) {
      await extremeArabDetection(this, id, participant, groupMetadata)
    }

  } catch (error) {
    console.error('❌ Error en anti-árabe extremo:', error)
  }
}

// ===== DETECCIÓN DE MENSAJES CON "apk" =====
handler.before = async (m) => {
  if (m.isBaileys || !m.isGroup) return

  // Verificar si el anti-árabe está activo
  if (!global.antiArabStatus || !global.antiArabStatus[m.chat]) return

  const sender = m.sender
  const groupMetadata = await m.getChat().catch(() => null)
  if (!groupMetadata) return

  const messageText = (m.text || m.caption || '').toLowerCase()
  
  // 1. Primero verificar si el mensaje contiene "apk" u otras palabras clave
  const hasArabKeyword = arabicKeywords.some(keyword => 
    messageText.includes(keyword.toLowerCase())
  )

  // 2. Verificar si el usuario es árabe
  const isArabUser = await checkIfArabUser(this, sender)
  
  // Si es árabe Y envía "apk" o palabras clave → EXPULSAR INMEDIATAMENTE
  if (isArabUser && hasArabKeyword) {
    console.log(`🚫🚫🚫 ÁRABE ENVIANDO APK DETECTADO: ${sender}`)
    
    try {
      // Eliminar el mensaje primero
      if (m.key) {
        await this.sendMessage(m.chat, { 
          delete: { 
            remoteJid: m.chat, 
            fromMe: false, 
            id: m.key.id, 
            participant: sender 
          } 
        }).catch(() => {})
      }
      
      // Expulsar al usuario
      await this.groupParticipantsUpdate(m.chat, [sender], 'remove')
      
      // Mensaje de expulsión por APK
      await this.sendMessage(m.chat, {
        text: `🚫 *ÁRABE ELIMINADO POR ENVIAR APK*\n\n` +
              `📵 Usuario: @${sender.split('@')[0]}\n` +
              `🔍 Razón: Envío de APK/WhatsApp modificado\n` +
              `🛡️ Protección Anti-Árabe Extremo Activada`,
        mentions: [sender]
      })
      
      console.log(`✅✅✅ ÁRABE EXPULSADO POR APK: ${sender}`)
      
    } catch (error) {
      console.error('❌ Error al expulsar por APK:', error)
    }
    return true // Detener el procesamiento del mensaje
  }

  // 3. Si no es por APK, verificar normalmente si es árabe
  await extremeArabDetection(this, m.chat, sender, groupMetadata)
}

// Función EXTREMA de detección árabe
async function extremeArabDetection(conn, groupId, userId, groupMetadata) {
  try {
    const userNumber = userId.split('@')[0]
    console.log(`🔍 ANALIZANDO USUARIO: ${userNumber}`)

    // Obtener información COMPLETA
    let userName = ''
    let userStatus = ''
    let isBusiness = false

    try {
      const contact = await conn.getContact(userId)
      userName = contact?.name || ''
      userStatus = contact?.status || ''
      isBusiness = contact?.isBusiness || false
    } catch (e) {
      console.log('⚠️ No se pudo obtener info del contacto')
    }

    // ===== DETECCIÓN HIPER-AGRESIVA =====
    
    // 1. Código de país (MUY AGRESIVA)
    const isArabByCountryCode = arabCountryCodes.some(code => 
      userNumber.startsWith(code)
    )

    // 2. Caracteres árabes en nombre
    const hasArabicName = arabicChars.test(userName)

    // 3. Nombres árabes (MUY AGRESIVA)
    const hasArabicNamePattern = arabicNames.some(name => {
      const lowerName = userName.toLowerCase()
      return lowerName.includes(name.toLowerCase()) || 
             lowerName.split(' ').some(word => word === name.toLowerCase()) ||
             lowerName.startsWith(name.toLowerCase()) ||
             lowerName.endsWith(name.toLowerCase())
    })

    // 4. Biografía árabe
    const hasArabicBio = arabicChars.test(userStatus)

    // 5. WhatsApp Business árabe
    const isArabBusiness = isBusiness && (isArabByCountryCode || hasArabicName)

    // 6. Palabras clave en biografía
    const hasArabKeywordsInBio = arabicKeywords.some(keyword =>
      userStatus.toLowerCase().includes(keyword.toLowerCase())
    )

    console.log(`📊 DETECCIÓN EXTREMA PARA ${userNumber}:`)
    console.log(`   📞 Código país: ${isArabByCountryCode}`)
    console.log(`   🔤 Nombre árabe: ${hasArabicName}`)
    console.log(`   📛 Patrón nombre: ${hasArabicNamePattern}`)
    console.log(`   📝 Bio árabe: ${hasArabicBio}`)
    console.log(`   💼 Business: ${isArabBusiness}`)
    console.log(`   🔑 Keywords bio: ${hasArabKeywordsInBio}`)

    // SI CUMPLE AL MENOS UN CRITERIO → EXPULSAR
    const isArabDetected = isArabByCountryCode || hasArabicName || 
                          hasArabicNamePattern || hasArabicBio || 
                          isArabBusiness || hasArabKeywordsInBio

    if (isArabDetected) {
      console.log(`🚫🚫🚫 ÁRABE DETECTADO: ${userNumber} 🚫🚫🚫`)
      
      try {
        // EXPULSIÓN INMEDIATA
        await conn.groupParticipantsUpdate(groupId, [userId], 'remove')
        console.log(`✅✅✅ ÁRABE EXPULSADO: ${userNumber}`)

        // Registrar en lista
        if (!global.arabExpelled[groupId].includes(userId)) {
          global.arabExpelled[groupId].push(userId)
        }

        // Mensaje de expulsión
        const detectionReasons = []
        if (isArabByCountryCode) detectionReasons.push('código árabe')
        if (hasArabicName) detectionReasons.push('nombre árabe')
        if (hasArabicNamePattern) detectionReasons.push('patrón nombre')
        if (hasArabicBio) detectionReasons.push('biografía árabe')
        if (isArabBusiness) detectionReasons.push('whatsapp business')
        if (hasArabKeywordsInBio) detectionReasons.push('keywords sospechosas')

        await conn.sendMessage(groupId, {
          text: `🚫 *ÁRABE DETECTADO Y ELIMINADO*\n\n` +
                `📵 *Número:* ${userNumber}\n` +
                `🔍 *Detección:* ${detectionReasons.join(', ')}\n` +
                `🛡️ *Protección Anti-Árabe Extremo*`,
          mentions: [userId]
        })

      } catch (expelError) {
        console.error('❌ ERROR al expulsar:', expelError)
      }
    } else {
      console.log(`✅ Usuario permitido: ${userNumber}`)
    }

  } catch (error) {
    console.error('❌ Error en detección extrema:', error)
  }
}

// Función auxiliar para verificar si es usuario árabe
async function checkIfArabUser(conn, userId) {
  try {
    const userNumber = userId.split('@')[0]
    
    let userName = ''
    try {
      const contact = await conn.getContact(userId)
      userName = contact?.name || ''
    } catch (e) {}
    
    return arabCountryCodes.some(code => userNumber.startsWith(code)) ||
           arabicChars.test(userName) ||
           arabicNames.some(name => userName.toLowerCase().includes(name.toLowerCase()))
  } catch (error) {
    return false
  }
}

handler.help = ['antiarabe <activar/desactivar/estado/lista>']
handler.tags = ['group']
handler.command = ['antiarabe', 'antiarab', 'antiarabes']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler*/