// 🚨PROHIBIDO EDITAR 🚨
// Este codigo fue creado Por Félix Creador de Deymoon Club 
// Github: https://github.com/FELIX-OFC
// Sistema creado para Itsuki IA
const currency = 'Coins'; // Cambia esto si tu moneda es diferente

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
const cofres = [ "Has encontrado un cofre antiguo en un barco hundido.",
"Descubriste un cofre decorado con intrincados grabados en una isla desierta.",
"Te topaste con un cofre mágico que se abre con una palabra secreta.",
"Encontraste un cofre de madera desgastada lleno de monedas de oro.",
"Desenterraste un cofre cubierto de lianas en una selva espesa.",
"Te adentraste en una cueva y hallaste un cofre lleno de joyas brillantes.",
"Un cofre misterioso apareció en la playa, lleno de tesoros de otro tiempo.",
"Descubriste un cofre escondido detrás de una cascada, rebosante de piedras preciosas.",
"Te topaste con un cofre encantado que guarda la historia de antiguos aventureros.",
"Encontraste un cofre de hierro forjado, custodiado por un viejo dragón.",
"Desenterraste un cofre en una tumba antigua que contenía reliquias sagradas.",
"Te encontraste con un cofre que, al abrirlo, libera una nube de polvo dorado.",
"Hallaste un cofre en el fondo de un lago, cubierto de algas y misterios.",
"Te topaste con un cofre que emana una luz mágica en la oscuridad.",
"Descubriste un cofre de cristal tallado, lleno de artefactos de poder.",
"Encontraste un cofre en un desván polvoriento, repleto de cartas y recuerdos.",
"Te adentraste en una fortaleza y hallaste un cofre lleno de armas antiguas.",
"Desenterraste un cofre en un campo de batalla, lleno de tesoros de guerreros caídos.",
"Te topaste con un cofre que se abre solo al resolver un enigma.",
"Encontraste un cofre de madera noble, lleno de joyas de culturas perdidas."
]

// --- SISTEMA DE ACTIVACIÓN/DESACTIVACIÓN ---

let handler = async (m, { conn, args, command, isAdmin, isBotAdmin, usedPrefix }) => {
  // Solo para grupos
  if (!m.isGroup) return

  // Normaliza comando (soporta #economy y #economia)
  if (command === 'economy' || command === 'economia') {
    // Solo admins pueden usar on/off
    if (!isAdmin)
      return m.reply('☆ Este comando solo puede ser usado por admins')

    if (!db.data.chats[m.chat].economy) db.data.chats[m.chat].economy = true // fallback

    const estado = db.data.chats[m.chat].economy ? 'activados' : 'desactivados'

    if (args[0] === 'on') {
      if (db.data.chats[m.chat].economy)
        return m.reply('☆ Los comandos de economía ya estaban activados')
      db.data.chats[m.chat].economy = true
      return m.reply('☆ Los comandos de economía han sido activados en este grupo.')
    } else if (args[0] === 'off') {
      if (!db.data.chats[m.chat].economy)
        return m.reply('☆ Los comandos de economía ya estaban desactivados')
      db.data.chats[m.chat].economy = false
      return m.reply('☆ Los comandos de economía han sido desactivados en este grupo.')
    } else {
      return m.reply(`☆ Estado de los comandos de economía: [${estado}]`)
    }
  }
}
handler.help = ['economy <on/off>', 'economia <on/off>']
handler.tags = ['rpg']
handler.command = ['economy', 'economia']
handler.group = true

export default handler

// --- COMANDO: BALTOP ---
let baltop = async (m, { conn, args, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`💜 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
  }
  const users = [...new Map(Object.entries(global.db.data.users).map(([jid, data]) => [jid, { ...data, jid }])).values()]
  const sorted = users.sort((a, b) => ((b.coin || 0) + (b.bank || 0)) - ((a.coin || 0) + (a.bank || 0)))
  const totalPages = Math.ceil(sorted.length / 10)
  const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
  const startIndex = (page - 1) * 10
  const endIndex = startIndex + 10
  let text = `「✿」Los usuarios con más *${currency}* son:\n\n`
  const slice = sorted.slice(startIndex, endIndex)
  for (let i = 0; i < slice.length; i++) {
    const { jid, coin, bank } = slice[i]
    const total = (coin || 0) + (bank || 0)
    let name = await (async () => global.db.data.users[jid].name?.trim() || (await conn.getName(jid).then(n => typeof n === 'string' && n.trim() ? n : jid.split('@')[0]).catch(() => jid.split('@')[0])))()
    text += `✰ ${startIndex + i + 1} » *${name}:*\n`
    text += `\t\t Total→ *¥${total.toLocaleString()} ${currency}*\n`
  }
  text += `\n> • Página *${page}* de *${totalPages}*`
  await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) })
}
baltop.help = ['baltop']
baltop.tags = ['rpg']
baltop.command = ['baltop', 'eboard', 'economyboard']
baltop.group = true

export { baltop }

// --- COMANDO: BAL / BALANCE ---
let bal = async (m, { conn, args, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`💜 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
  }
  let mentionedJid = await m.mentionedJid
  let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : m.sender
  let name = await (async () => global.db.data.users[who]?.name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
  if (!(who in global.db.data.users)) return m.reply(`ꕥ El usuario no se encuentra en mi base de datos.`)
  let user = global.db.data.users[who]
  let coin = user.coin || 0
  let bank = user.bank || 0
  let total = (user.coin || 0) + (user.bank || 0)
  const texto = `ᥫ᭡ Informacion -  Balance ❀
 
ᰔᩚ Usuario » *${name}*   
⛀ Cartera » *¥${coin.toLocaleString()} ${currency}*
⚿ Banco » *¥${bank.toLocaleString()} ${currency}*
⛁ Total » *¥${total.toLocaleString()} ${currency}*

> *Para proteger tu dinero, ¡depósitalo en el banco usando #deposit!*`
  await conn.reply(m.chat, texto, m)
}
bal.help = ['bal']
bal.tags = ['rpg']
bal.command = ['bal', 'balance', 'bank']
bal.group = true

export { bal }

// --- COMANDO: COFRE ---
let cofre = async (m, { conn, usedPrefix, command }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`💜 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
  }
  let user = global.db.data.users[m.sender]
  let now = Date.now()
  let gap = 86400000
  user.lastcofre = user.lastcofre || 0
  = user.exp || 0
  if (now < user.lastcofre) {
    let wait = formatTime(Math.floor((user.lastcofre - now) / 1000))
    return conn.reply(m.chat, `ꕥ Debes esperar *${wait}* para usar *${usedPrefix + command}* de nuevo.`, m)
  }
  let reward = Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000
  let expGain = Math.floor(Math.random() * (111)) + 50
  user.coin += reward
  user.exp += expGain
  user.lastcofre = now + gap
  conn.reply(m.chat, `「✿」 ${pickRandom(cofres)}\n> Has recibido *¥${reward.toLocaleString()} ${currency}*.`, m)
}
cofre.help = ['cofre']
cofre.tags = ['economía']
cofre.command = ['coffer', 'cofre', 'abrircofre', 'cofreabrir']
cofre.group = true

export { cofre }

// --- COMANDO: DAILY ---
let daily = async (m, { conn, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup)
    return m.reply(`💜 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
  let user = global.db.data.users[m.sender]
  let now = Date.now()
  let gap = 86400000
  let maxStreak = 200
  user.streak = user.streak || 0
  user.lastDailyGlobal = user.lastDailyGlobal || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0
  user.lastDaily = user.lastDaily || 0
  if (now < user.lastDaily) {
    let wait = formatTime(Math.floor((user.lastDaily - now) / 1000))
    return conn.reply(m.chat, `ꕥ Ya has reclamado tu *Daily >= 1 && now - user.lastDailyGlobal > gap * 1.5
  if (lost) user.streak = 0
  let canClaimGlobal = now - user.lastDailyGlobal >= gap
  if (canClaimGlobal) {
    user.streak = Math.min(user.streak + 1, maxStreak)
    user.lastDailyGlobal = now
  }
  let reward = Math.min(20000 + (user.streak - 1) * 5000, 1015000)
  let expRandom = Math.floor(Math.random() * (100 - 20 + 1)) + 20
  user.coin += reward
  user.exp += expRandom
  user.lastDaily = now + gap
  let nextReward = Math.min(20000 + user.streak * 5000, 1015000).toLocaleString()
  let msg = `> Día *${user.streak + 1}* » *+¥${nextReward}*`
  if (lost) msg += `\n> ☆ ¡Has perdido tu racha de días!`
  conn.reply(m.chat, `「✿」Has reclamado tu recompensa diaria de *¥${reward.toLocaleString()} ${currency}*! (Día *${user.streak}*)\n${msg}`, m)
}
daily.help = ['daily']
daily.tags = ['rpg']
daily.command = ['daily', 'diario']
daily.group = true

export { daily }
