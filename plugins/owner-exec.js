// 🌸 De BrayanOFC-Li para — Itsuki Nakano
import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
const exec = promisify(_exec).bind(cp)

const handler = async (m, { conn, isROwner, command, text }) => {
  if (!isROwner) return m.reply('⚠️ *Acceso denegado.* Solo mi creador puede usar este comando 💢')

  if (!global.conn?.user || !conn?.user) {
    console.log('⚠️ conn.user o global.conn.user no definidos todavía.')
  } else if (global.conn.user.jid !== conn.user.jid) return

  await m.reply('🌸 *Itsuki Nakano está ejecutando la orden...* ⏳')

  let o
  try {
    o = await exec(command.trimStart() + ' ' + text.trimEnd())
  } catch (e) {
    o = e
  } finally {
    const stdout = o?.stdout ?? ''
    const stderr = o?.stderr ?? ''

    if (stdout.trim()) await m.reply(`✅ *Resultado obtenido:*\n\`\`\`\n${stdout}\n\`\`\``)
    if (stderr.trim()) await m.reply(`⚠️ *Error detectado:*\n\`\`\`\n${stderr}\n\`\`\``)
  }
}

handler.help = ['$']
handler.tags = ['owner']
handler.customPrefix = /^[$] /
handler.command = new RegExp
handler.rowner = true

export default handler