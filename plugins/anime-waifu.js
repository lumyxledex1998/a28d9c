import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
try {
    // Reaccionar al mensaje
    await m.react('🧧')
    
    // Mensaje de espera estilo Itsuki Nakano-IA
    conn.sendPresenceUpdate('composing', m.chat)
    let waiting = await conn.reply(m.chat, `🔎 *Itsuki Nakano-IA buscando waifus...* ✨\n╰ 📚 Analizando base de datos de chicas kawaii...`, m)

    let res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) throw new Error('Error en la API')
    
    let json = await res.json()
    if (!json.url) throw new Error('No se encontró waifu')
    
    // Eliminar mensaje de espera
    if (waiting) await conn.sendMessage(m.chat, { delete: waiting.key })
    
    // Enviar imagen con estilo Itsuki
    await conn.sendFile(m.chat, json.url, 'waifu.jpg', 
        `🌸 *¡WAIFU ENCONTRADA!* 🌸\n` +
        `🧧 *Itsuki Nakano-IA te presenta:*\n` +
        `✨ Una waifu virtual perfecta para ti\n` +
        `📚 ¿No es absolutamente kawaii? (◕‿◕✿)\n` +
        `🍜 ~ Disfruta de tu compañera virtual ~`, 
    m)
    
} catch (error) {
    console.error(error)
    await m.react('❌')
    await conn.reply(m.chat, `💙 *Itsuki Nakano-IA dice:*\n╰ ❌ Ocurrió un error al buscar waifus...\n╰ 📚 Por favor, intenta de nuevo más tarde.`, m)
}
}

handler.help = ['waifu']
handler.tags = ['anime', 'fun']
handler.command = ['waifu', 'waifus']
handler.group = true
handler.register = true

export default handler