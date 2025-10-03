// 🚨PROHIBIDO EDITAR 🚨
// Este codigo fue creado Por Félix Creador de Deymoon Club 
// Github: https://github.com/FELIX-OFC
// Sistema creado para Itsuki IA

const currency = 'Coins';

function formatTime(totalSec) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const txt = []
  if (h > 0) txt.push(`${h} hora${h !== 1 ? 's' : ''}`)
  if (m > 0 || h > 0) txt.push(`${m} minuto${m !== 1 ? 's' : ''}`)
  txt.push(`${s} segundo${s !== 1 ? 's' : ''}`)
  return txt.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const cofres = [
  "🌸 Has encontrado un cofre antiguo decorado con flores de cerezo.",
  "🎀 Descubriste un cofre mágico de Itsuki Nakano lleno de tesoros.",
  "📚 Te topaste con un cofre de estudio con monedas para libros.",
  "🍱 Encontraste un cofre de bento especial con recompensas.",
  "✨ Un cofre brillante apareció con regalos de Itsuki."
]

// ==================== SISTEMA DE ACTIVACIÓN ====================
let handler = async (m, { conn, args, command, isAdmin, isBotAdmin, usedPrefix }) => {
  if (!m.isGroup) return m.reply('🌸 ❌ Este comando solo funciona en grupos.')

  if (command === 'economy' || command === 'economia') {
    if (!isAdmin) return m.reply('📚 ⚠️ Necesitas ser administrador.')

    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    
    if (!global.db.data.chats[m.chat].economy) global.db.data.chats[m.chat].economy = true

    const estado = global.db.data.chats[m.chat].economy ? 'activados' : 'desactivados'

    if (args[0] === 'on') {
      if (global.db.data.chats[m.chat].economy) return m.reply('🌸 Los comandos de economía ya estaban activados')
      global.db.data.chats[m.chat].economy = true
      return m.reply('🌸✅ *Sistema de Economía Activado*\n\n📚 *"¡Ahora pueden disfrutar del sistema económico en este grupo!"* 🍙')
    } 
    
    else if (args[0] === 'off') {
      if (!global.db.data.chats[m.chat].economy) return m.reply('🌸 Los comandos de economía ya estaban desactivados')
      global.db.data.chats[m.chat].economy = false
      return m.reply('🌸❌ *Sistema de Economía Desactivado*\n\n📚 *"He desactivado el sistema económico en este grupo."* 🍙')
    } 
    
    else {
      return m.reply(`🌸📊 *Estado del Sistema Económico:* ${estado.toUpperCase()}`)
    }
  }
}

handler.help = ['economy <on/off>', 'economia <on/off>']
handler.tags = ['group']
handler.command = ['economy', 'economia']
handler.group = true
handler.admin = true

export default handler

// ==================== COMANDO: BALTOP ====================
let baltopHandler = async (m, { conn, args, usedPrefix }) => {
  if (!global.db.data.chats?.[m.chat]?.economy && m.isGroup) {
    return m.reply(`🌸❌ *Sistema Económico Desactivado*\n\n📚 Un administrador puede activarlo con:\n${usedPrefix}economy on`)
  }

  if (!global.db.data.users) global.db.data.users = {}

  const users = Object.entries(global.db.data.users)
    .map(([jid, data]) => ({ jid, ...data }))
    .filter(user => user.coin || user.bank)

  const sorted = users.sort((a, b) => {
    const totalA = (a.coin || 0) + (a.bank || 0)
    const totalB = (b.coin || 0) + (b.bank || 0)
    return totalB - totalA
  })

  const totalPages = Math.ceil(sorted.length / 10) || 1
  const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
  const startIndex = (page - 1) * 10
  const endIndex = startIndex + 10

  let text = `🌸📊 **TOP 10 - USUARIOS MÁS RICOS** 🍙\n\n`

  const slice = sorted.slice(startIndex, endIndex)
  
  for (let i = 0; i < slice.length; i++) {
    const { jid, coin = 0, bank = 0 } = slice[i]
    const total = coin + bank
    
    let name = 'Usuario'
    try {
      name = global.db.data.users[jid]?.name || (await conn.getName(jid)) || jid.split('@')[0]
    } catch {
      name = jid.split('@')[0]
    }

    text += `${i + 1}. 🎯 *${name}*\n`
    text += `   💰 Total: *¥${total.toLocaleString()} ${currency}*\n\n`
  }

  text += `📄 Página *${page}* de *${totalPages}*`

  await conn.reply(m.chat, text, m)
}

baltopHandler.help = ['baltop']
baltopHandler.tags = ['economy']
baltopHandler.command = ['baltop', 'top', 'ricos']
baltopHandler.group = true

export { baltopHandler }

// ==================== COMANDO: BALANCE ====================
let balanceHandler = async (m, { conn, args, usedPrefix }) => {
  if (!global.db.data.chats?.[m.chat]?.economy && m.isGroup) {
    return m.reply(`🌸❌ *Sistema Económico Desactivado*\n\n📚 Un administrador puede activarlo con:\n${usedPrefix}economy on`)
  }

  if (!global.db.data.users) global.db.data.users = {}

  let mentionedJid = m.mentionedJid || []
  let who = mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)

  if (!global.db.data.users[who]) {
    global.db.data.users[who] = { coin: 0, bank: 0, exp: 0 }
  }

  let user = global.db.data.users[who]
  let name = 'Usuario'
  
  try {
    name = user.name || (await conn.getName(who)) || who.split('@')[0]
  } catch {
    name = who.split('@')[0]
  }

  const coin = user.coin || 0
  const bank = user.bank || 0
  const total = coin + bank

  const texto = `🌸📊 **BALANCE DE ${name.toUpperCase()}** 🍙\n\n` +
    `💼 *Cartera:* ¥${coin.toLocaleString()} ${currency}\n` +
    `🏦 *Banco:* ¥${bank.toLocaleString()} ${currency}\n` +
    `💰 *Total:* ¥${total.toLocaleString()} ${currency}\n\n` +
    `📚 *"¡Sigue esforzándote en tus estudios!"* ✨`

  await conn.reply(m.chat, texto, m)
}

balanceHandler.help = ['balance', 'bal']
balanceHandler.tags = ['economy']
balanceHandler.command = ['balance', 'bal', 'dinero', 'bank']
balanceHandler.group = true

export { balanceHandler }

// ==================== COMANDO: COFRE ====================
let cofreHandler = async (m, { conn, usedPrefix, command }) => {
  if (!global.db.data.chats?.[m.chat]?.economy && m.isGroup) {
    return m.reply(`🌸❌ *Sistema Económico Desactivado*\n\n📚 Un administrador puede activarlo con:\n${usedPrefix}economy on`)
  }

  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { coin: 0, bank: 0, exp: 0, lastcofre: 0 }
  }

  let user = global.db.data.users[m.sender]
  let now = Date.now()
  let gap = 86400000 // 24 horas

  user.lastcofre = user.lastcofre || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0

  if (now < user.lastcofre + gap) {
    let wait = formatTime(Math.floor((user.lastcofre + gap - now) / 1000))
    return conn.reply(m.chat, `🌸⏰ *Debes esperar*\n\n📚 ${wait} para abrir otro cofre.`, m)
  }

  let reward = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000
  let expGain = Math.floor(Math.random() * (50 - 10 + 1)) + 10

  user.coin += reward
  user.exp += expGain
  user.lastcofre = now

  const mensaje = `🌸🎁 **¡COFRE ENCONTRADO!** 🍙\n\n` +
    `${pickRandom(cofres)}\n\n` +
    `💰 *Recompensa:* ¥${reward.toLocaleString()} ${currency}\n` +
    `⭐ *Experiencia:* +${expGain} EXP\n\n` +
    `📚 *"¡Buen trabajo encontrando este tesoro!"* ✨`

  await conn.reply(m.chat, mensaje, m)
}

cofreHandler.help = ['cofre']
cofreHandler.tags = ['economy']
cofreHandler.command = ['cofre', 'coffer', 'abrircofre']
cofreHandler.group = true

export { cofreHandler }

// ==================== COMANDO: DAILY ====================
let dailyHandler = async (m, { conn, usedPrefix }) => {
  if (!global.db.data.chats?.[m.chat]?.economy && m.isGroup) {
    return m.reply(`🌸❌ *Sistema Económico Desactivado*\n\n📚 Un administrador puede activarlo con:\n${usedPrefix}economy on`)
  }

  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { coin: 0, bank: 0, exp: 0, lastDaily: 0, streak: 0 }
  }

  let user = global.db.data.users[m.sender]
  let now = Date.now()
  let gap = 86400000 // 24 horas

  user.lastDaily = user.lastDaily || 0
  user.streak = user.streak || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0

  if (now < user.lastDaily + gap) {
    let wait = formatTime(Math.floor((user.lastDaily + gap - now) / 1000))
    return conn.reply(m.chat, `🌸⏰ *Ya reclamaste tu daily*\n\n📚 Vuelve en ${wait}`, m)
  }

  // Verificar si perdió la racha (más de 36 horas)
  const lostStreak = (now - user.lastDaily) > (gap * 1.5)
  if (lostStreak) {
    user.streak = 0
  }

  // Incrementar racha
  user.streak += 1
  if (user.streak > 200) user.streak = 200

  // Calcular recompensa
  let baseReward = 20000
  let streakBonus = Math.min((user.streak - 1) * 1000, 100000)
  let reward = baseReward + streakBonus
  let expGain = Math.floor(Math.random() * (30 - 10 + 1)) + 10

  user.coin += reward
  user.exp += expGain
  user.lastDaily = now

  const mensaje = `🌸🎉 **RECOMPENSA DIARIA** 🍙\n\n` +
    `💰 *Monedas:* ¥${reward.toLocaleString()} ${currency}\n` +
    `⭐ *Experiencia:* +${expGain} EXP\n` +
    `📅 *Racha:* Día ${user.streak}\n\n` +
    (lostStreak ? `⚠️ *¡Perdiste tu racha anterior!*\n\n` : '') +
    `📚 *"¡Sigue así todos los días!"* ✨`

  await conn.reply(m.chat, mensaje, m)
}

dailyHandler.help = ['daily']
dailyHandler.tags = ['economy']
dailyHandler.command = ['daily', 'diario', 'recompensa']
dailyHandler.group = true

export { dailyHandler }