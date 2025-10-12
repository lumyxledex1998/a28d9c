import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters[1].json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('🧧 No se pudo cargar el archivo characters.json.')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('🧧 No se pudo guardar el archivo characters.json.')
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
        throw new Error('🧧 No se pudo guardar el archivo harem.json.')
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    // Reaccionar al mensaje del usuario inmediatamente
    await conn.sendMessage(m.chat, {
        react: {
            text: '⏳',
            key: m.key
        }
    })

    // Tiempo reducido de 15 minutos a 3 minutos
    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        await conn.reply(m.chat, `《🌟》Debes esperar *${minutes} minutos y ${seconds} segundos* para usar *#rw* de nuevo.`, m)
        
        // Reacción de error por cooldown
        await conn.sendMessage(m.chat, {
            react: {
                text: '❎️',
                key: m.key
            }
        })
        return
    }

    try {
        const characters = await loadCharacters()
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

        const harem = await loadHarem()
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)
        const statusMessage = randomCharacter.user 
            ? `Reclamado por @${randomCharacter.user.split('@')[0]}` 
            : 'Libre'

                const message = 
`╭━━━〔 🌸 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐉𝐄 𝐀𝐋𝐄𝐀𝐓𝐎𝐑𝐈𝐎 🌸 〕━━━⬣
│ 🎴 *Nombre* ➪ ${randomCharacter.name}
│ ⚧️ *Género* ➪ ${randomCharacter.gender}
│ 💎 *Valor* ➪ ${randomCharacter.value}
│ 🎯 *Estado* ➪ ${statusMessage}
│ 📚 *Fuente* ➪ ${randomCharacter.source}
│ 🪪 *ID* ➪ ${randomCharacter.id}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🍜 *¡Personaje encontrado con éxito!* 🎀
📖 *¡Que tengas mucha suerte con él!* (´｡• ᵕ •｡\`)`

        const mentions = userEntry ? [userEntry.userId] : []

        // Enviar el mensaje con el personaje
        await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })

        // Reacción de éxito al mensaje del usuario
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅️',
                key: m.key
            }
        })

        if (!randomCharacter.user) {
            await saveCharacters(characters)
        }

        // Cooldown reducido de 15 minutos a 3 minutos (180 segundos)
        cooldowns[userId] = now + 3 * 60 * 1000

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al cargar el personaje: ${error.message}`, m)
        // Reacción de error por excepción
        await conn.sendMessage(m.chat, {
            react: {
                text: '❎️',
                key: m.key
            }
        })
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = true

export default handler