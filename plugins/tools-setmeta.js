// Codigo de yuki suou adaptado para itsuki-ia

let handler = async (m, { conn, text, usedPrefix, command }) => {
const userId = m.sender
const ctxErr = (global.rcanalx || {})
const ctxWarn = (global.rcanalw || {})
const ctxOk = (global.rcanalr || {})
if (command === 'setmeta') {
const packParts = text.split(/[\u2022|]/).map(part => part.trim())

if (packParts.length < 2) {
return conn.reply(m.chat, `🌟 *Envia un texto para que itsuki asigne el pack y el autor*.\n> Ejemplo: *${usedPrefix + command} Istuki • Leo*`, m, ctxErr) 
}
const packText1 = packParts[0]
const packText2 = packParts[1]
if (!global.db.data.users[userId]) {
global.db.data.users[userId] = {}
}
const packstickers = global.db.data.users[userId]
packstickers.text1 = packText1
packstickers.text2 = packText2
await global.db.write()
return conn.reply(m.chat, `🍓 *Se actualizo el pack y autor por defecto para tus stickers*`, m, ctxErr) 
}
if (command === 'delmeta') {
if (!global.db.data.users[userId] || (!global.db.data.users[userId].text1 && !global.db.data.users[userId].text2)) {
return conn.reply(m.chat, `🌟 *No tienes establecido un pack de stickers*`, m,  ctxErr)
}
const packstickers = global.db.data.users[userId]
delete packstickers.text1
delete packstickers.text2
await global.db.write()
return conn.reply(m.chat, `🍓 *Se restablecio el pack y autor por defecto para tus stickers*`, m, ctxErr)
}}

handler.help = ['setmeta', 'delmeta']
handler.tags = ['tools']
handler.command = ['setmeta', 'delmeta']

export default handler