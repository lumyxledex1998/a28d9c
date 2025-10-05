import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters[1].json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('No se pudo cargar el archivo characters.json.')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('No se pudo guardar el archivo characters.json.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('No se pudo guardar el archivo harem.json.')
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    const ctxErr = global.rcanalx || {}
    const ctxWarn = global.rcanalw || {}
    const ctxOk = global.rcanalr || {}

    const userId = m.sender
    const now = Date.now()

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(m.chat, 
            `🍙⏰ *ITSUKI - Tiempo de Espera* 📚\n\n` +
            `⚠️ Debes esperar para obtener otro personaje\n\n` +
            `⏱️ *Tiempo restante:* ${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}\n\n` +
            `📖 "La paciencia es importante, espera un poco más"`,
            m, ctxWarn
        )
    }

    try {
        const characters = await loadCharacters()
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

        const harem = await loadHarem()
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)
        const statusMessage = randomCharacter.user 
            ? `Reclamado por @${randomCharacter.user.split('@')[0]}` 
            : '🟢 Libre'

        const message = 
            `🍙🎴 *ITSUKI - Personaje Aleatorio* 📚✨\n\n` +
            `📖 *Nombre:* ${randomCharacter.name}\n` +
            `⚥ *Género:* ${randomCharacter.gender}\n` +
            `💎 *Valor:* ${randomCharacter.value}\n` +
            `📊 *Estado:* ${statusMessage}\n` +
            `🎬 *Fuente:* ${randomCharacter.source}\n` +
            `🆔 *ID:* ${randomCharacter.id}\n\n` +
            `${!randomCharacter.user ? `💡 Usa ${usedPrefix}claim para reclamarlo\n\n` : ''}` +
            `📚 "Cita este mensaje y usa .claim para reclamar" ✨`

        const mentions = randomCharacter.user ? [randomCharacter.user] : []
        await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { ...ctxOk, mentions })

        if (!randomCharacter.user) {
            await saveCharacters(characters)
        }

        cooldowns[userId] = now + 15 * 60 * 1000

    } catch (error) {
        await conn.reply(m.chat, 
            `🍙❌ *ITSUKI - Error al Cargar*\n\n` +
            `⚠️ No se pudo cargar el personaje\n\n` +
            `📝 *Error:* ${error.message}\n\n` +
            `💡 Intenta nuevamente o contacta al owner\n\n` +
            `📚 "Verifica que los archivos de base de datos existan"`,
            m, ctxErr
        )
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['rpg']
handler.command = ['ver', 'rw', 'rollwaifu', 'roll']
handler.group = true

export default handler