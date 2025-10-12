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

let handler = async (m, { conn, usedPrefix }) => {
    const userId = m.sender
    const now = Date.now()

    // Reaccionar al mensaje del usuario inmediatamente
    await conn.sendMessage(m.chat, {
        react: {
            text: '⏳',
            key: m.key
        }
    })

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        
        await conn.reply(m.chat, 
            `╭━━━〔 🎀 𝐂𝐎𝐎𝐋𝐃𝐎𝐖𝐍 🎀 〕━━━⬣\n│ ⏰ *Tiempo de espera:*\n│ ${minutes} minutos y ${seconds} segundos\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Itsuki te pide paciencia...* (´･ω･\`)`, 
        m)

        await conn.sendMessage(m.chat, {
            react: {
                text: '❎',
                key: m.key
            }
        })
        return
    }

    if (m.quoted && m.quoted.sender === conn.user.jid) {
        try {
            const characters = await loadCharacters()
            const harem = await loadHarem()
            
            // Buscar el ID en el formato correcto
            const characterIdMatch = m.quoted.text.match(/🪪 ID: \*(.+?)\*/)
            
            if (!characterIdMatch) {
                await conn.reply(m.chat, 
                    `╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣\n│ ❌ No se pudo encontrar el ID del personaje\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Itsuki necesita que cites un personaje válido...* (´･ω･\`)`, 
                m)
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❎',
                        key: m.key
                    }
                })
                return
            }

            const characterId = characterIdMatch[1]
            const character = characters.find(c => c.id === characterId)

            if (!character) {
                await conn.reply(m.chat, 
                    `╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣\n│ ❌ Personaje no encontrado\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Itsuki no reconoce este personaje...* (´；ω；\`)`, 
                m)
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❎',
                        key: m.key
                    }
                })
                return
            }

            // Verificar si ya está en el harem
            const existingInHarem = harem.find(entry => 
                entry.characterId === characterId && entry.userId === userId
            )

            if (existingInHarem) {
                await conn.reply(m.chat, 
                    `╭━━━〔 🎀 𝐀𝐕𝐈𝐒𝐎 🎀 〕━━━⬣\n│ ℹ️ Ya tienes este personaje\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Itsuki recuerda que ya posees a ${character.name}...* (´｡• ᵕ •｡\`)`, 
                m)
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: 'ℹ️',
                        key: m.key
                    }
                })
                return
            }

            // Verificar si otro usuario ya lo reclamó
            const claimedByOther = harem.find(entry => 
                entry.characterId === characterId && entry.userId !== userId
            )

            if (claimedByOther) {
                await conn.reply(m.chat, 
                    `╭━━━〔 🎀 𝐎𝐂𝐔𝐏𝐀𝐃𝐎 🎀 〕━━━⬣\n│ ❌ Ya reclamado por otro usuario\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Este personaje ya tiene dueño...* (´･ω･\`)`, 
                m, { mentions: [claimedByOther.userId] })
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❎',
                        key: m.key
                    }
                })
                return
            }

            // Agregar al harem
            harem.push({
                userId: userId,
                characterId: characterId,
                characterName: character.name,
                claimedAt: new Date().toISOString()
            })

            await saveHarem(harem)

            await conn.reply(m.chat, 
                `╭━━━〔 🎀 𝐅𝐄𝐋𝐈𝐂𝐈𝐃𝐀𝐃𝐄𝐒 🎀 〕━━━⬣\n│ ✅ *${character.name} reclamado*\n│ 💎 Valor: ${character.value}\n│ 🪪 ID: ${characterId}\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *¡Itsuki te felicita por tu nuevo personaje!* (◕‿◕✿)\n🎀 *¡Cuídalo mucho!* 🍥`, 
            m)

            // Reacción de éxito
            await conn.sendMessage(m.chat, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })

            // Cooldown de 5 minutos
            cooldowns[userId] = now + 5 * 60 * 1000

        } catch (error) {
            await conn.reply(m.chat, 
                `╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣\n│ ❌ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)`, 
            m)
            
            await conn.sendMessage(m.chat, {
                react: {
                    text: '❎',
                    key: m.key
                }
            })
        }

    } else {
        await conn.reply(m.chat, 
            `╭━━━〔 🎀 𝐈𝐍𝐒𝐓𝐑𝐔𝐂𝐂𝐈𝐎𝐍𝐄𝐒 🎀 〕━━━⬣\n│ 📝 Cita un personaje para reclamar\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n🌸 *Usa el comando así:*\n${usedPrefix}c (respondiendo a un personaje)\n\n🎀 *Itsuki te guiará...* (◕‿◕✿)`, 
        m)
        
        await conn.sendMessage(m.chat, {
            react: {
                text: 'ℹ️',
                key: m.key
            }
        })
    }
}

handler.help = ['claim', 'reclamar']
handler.tags = ['gacha']
handler.command = ['c', 'claim', 'reclamar']
handler.group = true

export default handler