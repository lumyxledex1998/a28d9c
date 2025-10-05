import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
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
            `⚠️ Debes esperar para reclamar otro personaje\n\n` +
            `⏱️ *Tiempo restante:* ${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}\n\n` +
            `📖 "La paciencia es una virtud, espera un poco más"`,
            m, ctxWarn
        )
    }

    if (m.quoted && m.quoted.sender === conn.user.jid) {
        try {
            const characters = await loadCharacters()
            const characterIdMatch = m.quoted.text.match(/✦ ID: \*(.+?)\*/)

            if (!characterIdMatch) {
                await conn.reply(m.chat, 
                    `🍙❌ *ITSUKI - ID No Encontrado*\n\n` +
                    `⚠️ No se pudo encontrar el ID del personaje\n\n` +
                    `📝 Asegúrate de citar un mensaje de personaje válido\n\n` +
                    `📚 "Verifica el mensaje citado"`,
                    m, ctxErr
                )
                return
            }

            const characterId = characterIdMatch[1]
            const character = characters.find(c => c.id === characterId)

            if (!character) {
                await conn.reply(m.chat, 
                    `🍙❌ *ITSUKI - Personaje Inválido*\n\n` +
                    `⚠️ El mensaje citado no corresponde a un personaje válido\n\n` +
                    `💡 Usa ${usedPrefix}roll para obtener personajes\n\n` +
                    `📚 "Este personaje no existe en la base de datos"`,
                    m, ctxErr
                )
                return
            }

            if (character.user && character.user !== userId) {
                await conn.reply(m.chat, 
                    `🍙💔 *ITSUKI - Ya Reclamado* 📚\n\n` +
                    `❌ Este personaje ya fue reclamado por @${character.user.split('@')[0]}\n\n` +
                    `👤 *Propietario:* @${character.user.split('@')[0]}\n` +
                    `🎴 *Personaje:* ${character.name}\n\n` +
                    `📖 "Intenta con otro personaje la próxima vez"`,
                    m, 
                    { ...ctxWarn, mentions: [character.user] }
                )
                return
            }

            character.user = userId
            character.status = "Reclamado"

            await saveCharacters(characters)

            await conn.reply(m.chat, 
                `🍙✅ *ITSUKI - Personaje Reclamado* 🎉📚\n\n` +
                `🎴 Has reclamado a *${character.name}* exitosamente\n\n` +
                `📊 *Detalles:*\n` +
                `• Personaje: ${character.name}\n` +
                `• Origen: ${character.source}\n` +
                `• Valor: ${character.value}\n` +
                `• Estado: Reclamado\n\n` +
                `⏰ *Cooldown:* 30 minutos\n\n` +
                `🍱 "¡Felicidades! Ahora es parte de tu colección" ✨`,
                m, ctxOk
            )
            cooldowns[userId] = now + 30 * 60 * 1000

        } catch (error) {
            await conn.reply(m.chat, 
                `🍙❌ *ITSUKI - Error al Reclamar*\n\n` +
                `⚠️ Ocurrió un error al procesar tu reclamo\n\n` +
                `📝 *Error:* ${error.message}\n\n` +
                `💡 Intenta nuevamente o contacta al owner\n\n` +
                `📚 "Algo salió mal en el proceso"`,
                m, ctxErr
            )
        }

    } else {
        await conn.reply(m.chat, 
            `🍙📝 *ITSUKI - Citar Personaje* 📚\n\n` +
            `❌ Debes citar un mensaje de personaje para reclamarlo\n\n` +
            `💡 *Cómo usar:*\n` +
            `1. Responde/cita un personaje\n` +
            `2. Escribe ${usedPrefix}${command}\n\n` +
            `📖 "Cita el mensaje del personaje que deseas reclamar"`,
            m, ctxWarn
        )
    }
}

handler.help = ['claim']
handler.tags = ['gacha']
handler.command = ['c', 'claim', 'reclamar']
handler.group = true

export default handler