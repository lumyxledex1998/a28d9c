import { smsg } from './simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const sleep = ms => new Promise(res => setTimeout(res, Math.max(0, Number(ms) || 0)))

const localFail = (type, m, conn) => { try { return (typeof global.dfail === 'function' ? global.dfail : (()=>{}))(type, m, conn) } catch {} }

function contentHash(content = {}) {
  try {
    const txt = (content.text || content.caption || content.body || '').slice(0, 180)
    const key = [ content.text ? 't' : '', content.caption ? 'c' : '', Array.isArray(content.mentions) ? ('m' + content.mentions.length) : '', txt.replace(/\s+/g, ' ').trim() ].join('|')
    return key
  } catch { return '' }
}

const SPAM_CFG = {
  inbound: { windowMs: 10_000, maxPer10sDM: 4, maxPer10sGroup: 6, maxRepeatSameText: 2 },
  outbound: { windowMs: 60_000, maxPerChatPerMinGroup: 18, maxPerChatPerMinDM: 6, minReplyDelayMs: 250, maxReplyDelayMs: 900, maxTextLengthGroup: 700, maxMentionsGroup: 10 }
}

function ensureAntiSpamState(conn) {
  if (conn.__sbAntiSpamInit) return
  conn.__sbAnti = { processedIds: new Map(), inbound: new Map(), outPerChat: new Map() }
  if (typeof conn.sendMessage === 'function' && !conn._sbSendWrapped) {
    const orig = conn.sendMessage.bind(conn)
    conn.sendMessage = async (jid, content, options = {}) => {
      try {
        const chat = String(jid || '')
        const now = Date.now()
        const isGroup = /@g\.us$/.test(chat)
        const gate = conn.__sbAnti.outPerChat.get(chat) || { times: [], lastHash: '', lastSendAt: 0 }
        gate.times = gate.times.filter(t => now - t < SPAM_CFG.outbound.windowMs)
        const limit = isGroup ? SPAM_CFG.outbound.maxPerChatPerMinGroup : SPAM_CFG.outbound.maxPerChatPerMinDM
        if (gate.times.length >= limit) {
          const owners = (Array.isArray(global.owner) ? global.owner : []).map(v => Array.isArray(v) ? String(v[0]).replace(/[^0-9]/g,'') : String(v).replace(/[^0-9]/g,''))
          const senderCore = String(options?.quoted?.sender || options?.quoted?.participant || '').replace(/[^0-9]/g,'')
          const isOwner = owners.includes(senderCore)
          if (!isOwner) return
        }
        if (isGroup && content) {
          const text = String(content.text || content.caption || '')
          const mentions = Array.isArray(content.mentions) ? content.mentions.length : 0
          if (text.length > SPAM_CFG.outbound.maxTextLengthGroup || mentions > SPAM_CFG.outbound.maxMentionsGroup) return
        }
        const h = contentHash(content)
        if (h && h === gate.lastHash) return
        const jitter = SPAM_CFG.outbound.minReplyDelayMs + Math.floor(Math.random() * (SPAM_CFG.outbound.maxReplyDelayMs - SPAM_CFG.outbound.minReplyDelayMs + 1))
        await sleep(jitter)
        const res = await orig(jid, content, options)
        gate.times.push(now); gate.lastHash = h; gate.lastSendAt = now
        conn.__sbAnti.outPerChat.set(chat, gate)
        return res
      } catch (e) { try { return await orig(jid, content, options) } catch (err) { throw err } }
    }
    conn._sbSendWrapped = true
  }
  conn.__sbAntiSpamInit = true
}

function shouldDropInbound(conn, m) {
  try {
    const sender = String(m.sender || '')
    const chat = String(m.chat || '')
    if (!sender || !chat) return false
    const isGroup = /@g\.us$/.test(chat)
    const now = Date.now()
    const st = conn.__sbAnti.inbound.get(sender) || { times: [], lastText: '', repeats: 0, muteUntil: 0 }
    if (now < (st.muteUntil || 0)) return true
    const txt = typeof m.text === 'string' ? m.text.trim() : ''
    st.times = (st.times || []).filter(t => now - t < SPAM_CFG.inbound.windowMs)
    st.times.push(now)
    if (txt && st.lastText && st.lastText === txt) st.repeats = (st.repeats || 0) + 1
    else st.repeats = 0
    st.lastText = txt
    const limit = isGroup ? SPAM_CFG.inbound.maxPer10sGroup : SPAM_CFG.inbound.maxPer10sDM
    const overMsgRate = st.times.length > limit
    const overRepeats = st.repeats > SPAM_CFG.inbound.maxRepeatSameText
    const links = (txt.match(/https?:\/\//gi) || []).length
    const pings = (txt.match(/@\d+/g) || []).length
    const dmSpammy = !isGroup && (links >= 1 || pings >= 3)
    if (overMsgRate || overRepeats || dmSpammy) { st.muteUntil = now + 20_000; conn.__sbAnti.inbound.set(sender, st); return true }
    conn.__sbAnti.inbound.set(sender, st)
    return false
  } catch { return false }
}

export async function handler(chatUpdate) {
  this.uptime = this.uptime || Date.now()
  const conn = this
  ensureAntiSpamState(conn)
  if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) return
  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m) return
  const now = Date.now()
  const lifeTime = 9_000
  for (const [msgId, ts] of conn.__sbAnti.processedIds) { if (now - ts > lifeTime) conn.__sbAnti.processedIds.delete(msgId) }
  const id = m?.key?.id
  if (id) { if (conn.__sbAnti.processedIds.has(id)) return; conn.__sbAnti.processedIds.set(id, now) }
  try {
    m = smsg(conn, m)
    if (!m) return
    if (shouldDropInbound(conn, m)) return
    try { await conn.readMessages([m.key]) } catch {}

    if (global.db?.data == null && typeof global.loadDatabase === 'function') { try { await global.loadDatabase() } catch {} }
    m.exp = 0; m.coin = false
    const senderJid = m.sender
    global.db = global.db || { data: { users: {}, chats: {}, settings: {}, stats: {} } }
    global.db.data = global.db.data || { users: {}, chats: {}, settings: {}, stats: {} }
    global.db.data.users = global.db.data.users || {}
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.settings = global.db.data.settings || {}
    global.db.data.stats = global.db.data.stats || {}
    if (!global.db.data.users[senderJid]) {
      global.db.data.users[senderJid] = { exp: 0, coin: 10, joincount: 1, diamond: 3, lastadventure: 0, health: 100, lastclaim: 0, lastcofre: 0, lastdiamantes: 0, lastcode: 0, lastduel: 0, lastpago: 0, lastmining: 0, lastcodereg: 0, muto: false, registered: false, genre: '', birth: '', marry: '', description: '', packstickers: null, name: m.name, age: -1, regTime: -1, afk: -1, afkReason: '', banned: false, useDocument: false, bank: 0, level: 0, role: 'Nuv', premium: false, premiumTime: 0 }
    }
    const chatJid = m.chat
    if (!global.db.data.chats[chatJid]) {
      global.db.data.chats[chatJid] = { isBanned: false, sAutoresponder: '', welcome: true, autolevelup: false, autoresponder: false, autoresponder2: false, delete: false, autoAceptar: false, autoRechazar: false, detect: true, antiBot: false, modoadmin: false, antiLink: true, nsfw: false, expired: 0, per: [], subBanned: false }
    } else if (global.db.data.chats[chatJid].subBanned === undefined) { global.db.data.chats[chatJid].subBanned = false }
    const settingsJid = conn.user?.jid || 'bot'
    if (!global.db.data.settings[settingsJid]) { global.db.data.settings[settingsJid] = { self: false, restrict: true, jadibotmd: true, antiPrivate: false, autoread: false, soloParaJid: false, status: 0 } }
    const user = global.db.data.users[senderJid]
    const chat = global.db.data.chats[chatJid]
    const settings = global.db.data.settings[settingsJid]
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
    const ownerList = Array.isArray(global.owner) ? global.owner : []
    const rootOwners = ownerList.map(([number]) => String(number || '').replace(/[^0-9]/g, '') + detectwhat)
    const isROwner = rootOwners.includes(senderJid)
    const isOwner = isROwner || !!m.fromMe
    if (m.isBaileys || global.opts?.nyimak) return
    if (!isROwner && global.opts?.self) return
    if (global.opts?.swonly && m.chat !== 'status@broadcast') return
    if (typeof m.text !== 'string') m.text = ''
    const getLidFromJid = async (id) => { try { if (String(id).endsWith('@lid')) return id; const res = await conn.onWhatsApp(String(id)).catch(() => []); return res?.[0]?.lid || id } catch { return id } }
    const senderLid = await getLidFromJid(m.sender)
    const botLid = await getLidFromJid(conn.user?.jid)
    const botJid = conn.user?.jid
    const groupMetadata = m.isGroup ? (((conn.chats || {})[m.chat] || {}).metadata || await conn.groupMetadata(m.chat).catch(_ => null)) : {}
    const participants = m.isGroup ? (groupMetadata?.participants || []) : []
    const user2 = participants.find(p => p.id === senderLid || p.jid === senderJid) || {}
    const bot = participants.find(p => p.id === botLid || p.id === botJid) || {}
    const isRAdmin = user2?.admin === 'superadmin'
    const isAdmin = isRAdmin || user2?.admin === 'admin'
    const isBotAdmin = !!bot?.admin
    const lc = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '')
    const isBansub = ['bansub', 'subban'].includes(lc(m.text))
    const isUnbansub = ['unbansub', 'subunban'].includes(lc(m.text))
    if (m.isGroup && chat.subBanned && !isUnbansub) return
    if (m.isGroup && (isBansub || isUnbansub)) {
      global.comando = isBansub ? 'bansub' : 'unbansub'
      if (!m.isGroup) return localFail('group', m, conn)
      if (!isROwner && !isAdmin) return localFail('admin', m, conn)
      const emoji = typeof global.emoji === 'string' ? global.emoji : '🍉'
      if (isBansub) { if (chat.subBanned) { try { await conn.reply(m.chat, `${emoji} El baneo de subbots ya está activo en este grupo.`, m, global.rcanal) } catch {} } else { chat.subBanned = true; try { await conn.reply(m.chat, `${emoji} Baneo de subbots activado. El subbot dejará de ejecutar CUALQUIER comando hasta que uses /unbansub.`, m, global.rcanal) } catch {} } return }
      if (isUnbansub) { if (!chat.subBanned) { try { await conn.reply(m.chat, `${emoji} El baneo de subbots no está activo en este grupo.`, m, global.rcanal) } catch {} } else { chat.subBanned = false; try { await conn.reply(m.chat, `${emoji} Baneo de subbots desactivado. Los subbots responderán con normalidad.`, m, global.rcanal) } catch {} } return }
    }
    if (!m.isGroup) {
      const prefList = Array.isArray(global.prefixes) && global.prefixes.length ? global.prefixes : (Array.isArray(global.prefix) ? global.prefix : ['.', '!', '/'])
      const startsWithPrefix = prefList.some(p => m.text?.startsWith(p))
      if (!startsWithPrefix) return
    }
    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '../plugins')
    for (let name in global.plugins) {
      let plugin = global.plugins[name]
      if (!plugin || plugin.disabled) continue
      const __filename = join(___dirname, name)
      if (typeof plugin.all === 'function') { try { await plugin.all.call(conn, m, { chatUpdate, __dirname: ___dirname, __filename, conn, m }) } catch (e) { console.error(e) } }
      if (!global.opts?.restrict && plugin.tags && plugin.tags.includes('admin')) continue
      if (typeof plugin.before === 'function') {
        try { const stop = await plugin.before.call(conn, m, { conn, participants, groupMetadata, user, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: ___dirname, __filename }); if (stop) continue } catch (e) { console.error(e) }
      }
      if (typeof plugin !== 'function') continue
      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      let _prefix = plugin.customPrefix ? plugin.customPrefix : (conn.prefix ? conn.prefix : global.prefix)
      const currentMatch = (_prefix instanceof RegExp ? [[_prefix.exec(m.text), _prefix]] : Array.isArray(_prefix) ? _prefix.map(p => { const re = p instanceof RegExp ? p : new RegExp(str2Regex(p)); return [re.exec(m.text), re] }) : typeof _prefix === 'string' ? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] : [[[], new RegExp()]]).find(p => p[0])
      if (currentMatch) {
        const match = currentMatch
        const usedPrefix = match[0][0]
        const noPrefix = m.text.replace(usedPrefix, '')
        let [command, ...args] = noPrefix.trim().split(/\s+/).filter(v => v)
        const text = args.join(' ')
        command = (command || '').toLowerCase()
        const fail = plugin.fail || localFail
        const isAccept = plugin.command instanceof RegExp ? plugin.command.test(command) : Array.isArray(plugin.command) ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) : typeof plugin.command === 'string' ? (plugin.command === command) : false
        global.comando = command
        const settings = global.db.data.settings[conn.user.jid]
        if (settings?.soloParaJid && m.sender !== settings.soloParaJid) continue
        const chatID = m.chat
        const ID_GRUPO_RESTRINGIDO = '120363421094353744@g.us'
        const comandosPermitidos = ['code', 'qr', 'welcome', 'detect', 'kick', 'tag']
        if (chatID === ID_GRUPO_RESTRINGIDO) { if (!comandosPermitidos.includes(command)) continue }
        if (!isAccept) continue
        if (chat?.isBanned && !isROwner) return
        if (chat?.modoadmin && !isOwner && !isROwner && m.isGroup && !isAdmin) return
        const checkPermissions = (perm) => { const permissions = { rowner: isROwner, owner: isOwner, group: m.isGroup, botAdmin: isBotAdmin, admin: isAdmin, private: !m.isGroup, restrict: !global.opts?.restrict }; return permissions[perm] }
        const requiredPerms = ['rowner', 'owner', 'mods', 'premium', 'group', 'botAdmin', 'admin', 'private', 'restrict']
        for (const perm of requiredPerms) { if (plugin[perm] && !checkPermissions(perm)) { fail(perm, m, conn); return } }
        m.isCommand = true
        const xp = 'exp' in plugin ? parseInt(plugin.exp) : 10
        m.exp += xp
        await sleep(120 + Math.floor(Math.random() * 180))
        const extra = { match, usedPrefix, noPrefix, args, command, text, conn, participants, groupMetadata, user, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: ___dirname, __filename }
        try { m.plugin = name; await plugin.call(conn, m, extra) } catch (e) { m.error = e; console.error(e); try { let errorText = format(e); for (let key of Object.values(global.APIKeys || {})) errorText = errorText.replace(new RegExp(key, 'g'), 'Administrador'); const isGroup = /@g\.us$/.test(m.chat); if (!isGroup) await conn.reply(m.chat, errorText, m) } catch {} } finally { if (typeof plugin.after === 'function') { try { await plugin.after.call(conn, m, extra) } catch (e) { console.error(e) } } }
      }
    }
  } catch (e) { console.error(e) } finally {
    if (m) {
      const user = global.db.data.users[m.sender]
      if (user && user.muto) { try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {} }
      if (user) { user.exp += m.exp; user.coin -= m.coin * 1 }
      if (m.plugin) { const stats = global.db.data.stats; const now = Date.now(); if (!stats[m.plugin]) stats[m.plugin] = { total: 0, success: 0, last: 0, lastSuccess: 0 }; const stat = stats[m.plugin]; stat.total += 1; stat.last = now; if (!m.error) { stat.success += 1; stat.lastSuccess = now } }
    }
  }
}

const file = fileURLToPath(import.meta.url)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.magenta("Se actualizo 'sub-handler.js'"))
  try {
    if (global.conns && global.conns.length > 0) {
      const users = global.conns.filter((conn) => conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED)
      for (const user of users) { if (typeof user.subreloadHandler === 'function') { try { await user.subreloadHandler(false) } catch {} } }
    }
  } catch {}
})

export { handler as subBotHandler }