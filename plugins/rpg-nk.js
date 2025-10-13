// rpg-nk-ia.js - SISTEMA RPG COMPLETO ITSUNI-NK
let handler = async (m, { conn, text, usedPrefix, command, isOwner, mentionedJid }) => {
    const ctxErr = global.rcanalx || {}
    const ctxWarn = global.rcanalw || {}
    const ctxOk = global.rcanalr || {}

    // INICIALIZAR SISTEMA RPG
    if (!global.nkRPG) {
        global.nkRPG = {
            users: {},
            batallas: {},
            misiones: {},
            objetos: {
                armas: {
                    'Espada Básica': { ataque: 15, precio: 100 },
                    'Bastón Mágico': { ataque: 25, precio: 300 },
                    'Arco de Itsuki': { ataque: 35, precio: 500 }
                },
                armaduras: {
                    'Túnica Básica': { defensa: 10, precio: 80 },
                    'Armadura de Acero': { defensa: 20, precio: 250 },
                    'Manto de Itsuki': { defensa: 30, precio: 400 }
                },
                consumibles: {
                    'Poción de Vida': { vida: 50, precio: 50 },
                    'Poción de Energía': { energia: 30, precio: 40 },
                    'Onigiri Mágico': { vida: 100, energia: 50, precio: 100 }
                }
            }
        }
    }

    // INICIALIZAR USUARIO
    if (!global.nkRPG.users[m.sender]) {
        global.nkRPG.users[m.sender] = {
            // PROGRESIÓN
            nivel: 1,
            exp: 0,
            expNecesaria: 100,
            puntos: 0,

            // STATS BASE
            stats: {
                vida: 100,
                vidaMax: 100,
                energia: 50,
                energiaMax: 50,
                ataque: 10,
                defensa: 10,
                velocidad: 5
            },

            // EQUIPAMIENTO
            equipo: {
                arma: null,
                armadura: null
            },

            // INVENTARIO
            inventario: {
                'Poción de Vida': 3,
                'Poción de Energía': 2
            },

            // CLASE Y TÍTULO
            clase: 'Novato',
            titulo: 'Estudiante Primerizo',

            // BATALLAS
            victorias: 0,
            derrotas: 0,
            misionesCompletadas: 0,

            // ECONOMÍA
            coin: 1000
        }
    }

    const user = global.nkRPG.users[m.sender]
    const userName = conn.getName(m.sender) || 'Aventurero'
    const args = text ? text.split(' ') : []
    const subCommand = args[0]?.toLowerCase()

    // 🎯 COMANDO PRINCIPAL: nkrpg
    if (!subCommand) {
        return mostrarMenuPrincipal()
    }

    // 📊 PERFIL RPG
    if (subCommand === 'perfil' || subCommand === 'profile') {
        return mostrarPerfil()
    }

    // ⚔️ BATALLA PVP
    if (subCommand === 'batalla' || subCommand === 'battle') {
        return iniciarBatalla()
    }

    // 🎒 INVENTARIO
    if (subCommand === 'inventario' || subCommand === 'inventory') {
        return mostrarInventario()
    }

    // 🏪 TIENDA
    if (subCommand === 'tienda' || subCommand === 'shop') {
        return mostrarTienda()
    }

    // 📜 MISIONES
    if (subCommand === 'misiones' || subCommand === 'quests') {
        return mostrarMisiones()
    }

    // 🎮 ENTRENAR
    if (subCommand === 'entrenar' || subCommand === 'train') {
        return entrenar()
    }

    // FUNCIONES PRINCIPALES
    async function mostrarMenuPrincipal() {
        const progreso = Math.min((user.exp / user.expNecesaria) * 100, 100)
        const barra = '█'.repeat(Math.floor(progreso / 10)) + '░'.repeat(10 - Math.floor(progreso / 10))

        const menu = 
`╭━━━〔 👑 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐍𝐊-𝐈𝐀 𝐑𝐏𝐆 🔥 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ ⭐ *Nivel:* ${user.nivel} | ${user.clase}
│ 📊 *EXP:* [${barra}] ${progreso.toFixed(1)}%
│ 🏷️ *Título:* ${user.titulo}
│ 
│ ❤️ *Vida:* ${user.stats.vida}/${user.stats.vidaMax}
│ ⚡ *Energía:* ${user.stats.energia}/${user.stats.energiaMax}
│ 🗡️ *Ataque:* ${user.stats.ataque}
│ 🛡️ *Defensa:* ${user.stats.defensa}
│ 
│ ⚔️  *Batallas:* ${user.victorias}🏆 ${user.derrotas}💀
│ 📜 *Misiones:* ${user.misionesCompletadas}
│ 💰 *Yenes:* ${user.coin}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🎮 *𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒:*

⚔️ *Batalla:* 
• ${usedPrefix}nkrpg batalla @usuario

📊 *Perfil:*
• ${usedPrefix}nkrpg perfil

🎒 *Inventario:*
• ${usedPrefix}nkrpg inventario

🏪 *Tienda:*
• ${usedPrefix}nkrpg tienda

📜 *Misiones:*
• ${usedPrefix}nkrpg misiones

🎯 *Entrenar:*
• ${usedPrefix}nkrpg entrenar

⚔️ *¡Itsuki te guiará en esta aventura!* ✨️`

        return conn.reply(m.chat, menu, m, ctxOk)
    }

    async function mostrarPerfil() {
        const armamento = user.equipo.arma ? `🗡️ ${user.equipo.arma}` : 'Sin arma'
        const proteccion = user.equipo.armadura ? `🛡️ ${user.equipo.armadura}` : 'Sin armadura'

        const perfil = 
`╭━━━〔 📋 𝐏𝐄𝐑𝐅𝐈𝐋 𝐍𝐊-𝐈𝐀 ⚔️ 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ ⭐ *Nivel:* ${user.nivel}
│ 📊 *EXP:* ${user.exp}/${user.expNecesaria}
│ 🎯 *Clase:* ${user.clase}
│ 🏷️ *Título:* ${user.titulo}
│ 
│ ⚔️ *EQUIPAMIENTO:*
│ ${armamento}
│ ${proteccion}
│ 
│ ❤️ *VIDA:* ${user.stats.vida}/${user.stats.vidaMax}
│ ⚡ *ENERGÍA:* ${user.stats.energia}/${user.stats.energiaMax}
│ 🗡️ *ATAQUE:* ${user.stats.ataque}
│ 🛡️ *DEFENSA:* ${user.stats.defensa}
│ 🏃 *VELOCIDAD:* ${user.stats.velocidad}
│ 
│ 📈 *PUNTOS DISPONIBLES:* ${user.puntos}
│ 💰 *YENES:* ${user.coin}
│ 
│ ⚔️ *RÉCORD:* ${user.victorias}🏆 ${user.derrotas}💀
│ 📜 *MISIONES:* ${user.misionesCompletadas}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💡 *Usa:* ${usedPrefix}nkrpg entrenar
*Para mejorar tus stats*`

        return conn.reply(m.chat, perfil, m, ctxOk)
    }

    async function iniciarBatalla() {
        const mencionado = m.mentionedJid?.[0]

        if (!mencionado) {
            return conn.reply(m.chat,
`╭━━━〔 🛡 𝐁𝐀𝐓𝐀𝐋𝐋𝐀 𝐏𝐕𝐏 ⚔️ 〕━━━⬣
│ ❌ *Debes mencionar a un jugador*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}nkrpg batalla @usuario
│ 
│ 💡 *Ejemplo:*
│ ${usedPrefix}nkrpg batalla @${m.sender.split('@')[0]}
│ 
│ ⚠️ *Requisitos:*
│ • Ambos deben tener energía
│ • No puedes batallar contigo mismo
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxWarn)
        }

        if (mencionado === m.sender) {
            return conn.reply(m.chat, '❌ *No puedes batallar contra ti mismo*', m, ctxErr)
        }

        // Verificar si el objetivo existe en el RPG
        if (!global.nkRPG.users[mencionado]) {
            return conn.reply(m.chat, '❌ *El usuario mencionado no está registrado en el RPG*', m, ctxErr)
        }

        const objetivo = global.nkRPG.users[mencionado]
        const nombreObjetivo = conn.getName(mencionado) || 'Oponente'

        // Verificar energía
        if (user.stats.energia < 10) {
            return conn.reply(m.chat, '❌ *No tienes suficiente energía para batallar*', m, ctxErr)
        }

        if (objetivo.stats.energia < 10) {
            return conn.reply(m.chat, `❌ *${nombreObjetivo} no tiene suficiente energía*`, m, ctxErr)
        }

        // Iniciar batalla
        user.stats.energia -= 10
        objetivo.stats.energia -= 10

        // Calcular daño
        const dañoJugador = Math.max(1, user.stats.ataque - objetivo.stats.defensa / 2)
        const dañoObjetivo = Math.max(1, objetivo.stats.ataque - user.stats.defensa / 2)

        // Determinar ganador
        let ganador = user
        let perdedor = objetivo
        let nombreGanador = userName
        let nombrePerdedor = nombreObjetivo

        if (Math.random() < 0.4) { // 40% de chance para el objetivo
            ganador = objetivo
            perdedor = user
            nombreGanador = nombreObjetivo
            nombrePerdedor = userName
        }

        // Actualizar records
        ganador.victorias++
        perdedor.derrotas++

        // Recompensas
        const expGanada = 25
        const yenesGanados = 50

        ganador.exp += expGanada
        user.exp += expGanada // Ambos ganan EXP
        ganador.coin += yenesGanados

        // Verificar subida de nivel
        await verificarNivel(ganador)
        await verificarNivel(user)

        const resultadoBatalla = 
`╭━━━〔 ⚔️ 𝐁𝐀𝐓𝐀𝐋𝐋𝐀 𝐅𝐈𝐍𝐀𝐋𝐈𝐙𝐀𝐃𝐀 🗡 〕━━━⬣
│ ⚔️ *COMBATIENTES:*
│ 🎯 ${userName} vs ${nombreObjetivo}
│ 
│ 💥 *DAÑOS:*
│ 🗡️ ${userName}: ${dañoJugador} de daño
│ 🗡️ ${nombreObjetivo}: ${dañoObjetivo} de daño
│ 
│ 🏆 *GANADOR:* ${nombreGanador}
│ 💀 *PERDEDOR:* ${nombrePerdedor}
│ 
│ 🎁 *RECOMPENSAS:*
│ ⭐ EXP: +${expGanada} para ambos
│ 💰 Yenes: +${yenesGanados} para ${nombreGanador}
│ ⚡ Energía: -10 para ambos
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤗 *¡Batalla épica finalizada!* ✨️`

        return conn.reply(m.chat, resultadoBatalla, m, ctxOk)
    }

    async function mostrarInventario() {
        let inventarioTexto = '🎒 *INVENTARIO VACÍO*'

        const items = Object.entries(user.inventario).filter(([_, cantidad]) => cantidad > 0)
        if (items.length > 0) {
            inventarioTexto = items.map(([item, cantidad]) => 
                `• ${item} x${cantidad}`
            ).join('\n')
        }

        const inventario = 
`╭━━━〔 🎒 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 🎒 〕━━━⬣
│ 👤 *Jugador:* ${userName}
│ 
│ 📦 *OBJETOS:*
│ ${inventarioTexto}
│ 
│ ⚔️ *EQUIPADO:*
│ 🗡️ Arma: ${user.equipo.arma || 'Ninguna'}
│ 🛡️ Armadura: ${user.equipo.armadura || 'Ninguna'}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💡 *Usa:* ${usedPrefix}nkrpg tienda
*Para comprar objetos*`

        return conn.reply(m.chat, inventario, m, ctxOk)
    }

    async function mostrarTienda() {
        const tienda = 
`╭━━━〔 🏪 𝐓𝐈𝐄𝐍𝐃𝐀 𝐍𝐊-𝐈𝐀 🏪 〕━━━⬣
│ 👤 *Jugador:* ${userName}
│ 💰 *Yenes:* ${user.coin || 0}
│ 
│ ⚔️ *ARMAS:*
${Object.entries(global.nkRPG.objetos.armas).map(([nombre, stats]) => 
    `│ 🗡️ ${nombre} - Ataque: ${stats.ataque} | Precio: ${stats.precio}¥`
).join('\n')}
│ 
│ 🛡️ *ARMADURAS:*
${Object.entries(global.nkRPG.objetos.armaduras).map(([nombre, stats]) => 
    `│ 🛡️ ${nombre} - Defensa: ${stats.defensa} | Precio: ${stats.precio}¥`
).join('\n')}
│ 
│ 🧪 *CONSUMIBLES:*
${Object.entries(global.nkRPG.objetos.consumibles).map(([nombre, stats]) => 
    `│ 🧪 ${nombre} - Vida: +${stats.vida || 0} | Energía: +${stats.energia || 0} | Precio: ${stats.precio}¥`
).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💡 *Usa:* ${usedPrefix}comprar <objeto>
*Para comprar objetos*`

        return conn.reply(m.chat, tienda, m, ctxOk)
    }

    async function mostrarMisiones() {
        const misiones = 
`╭━━━〔 🎯 𝐌𝐈𝐒𝐈𝐎𝐍𝐄𝐒 🎯 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ 📜 *Completadas:* ${user.misionesCompletadas}
│ 
│ 🎯 *MISIONES DISPONIBLES:*
│ 
│ 🌟 *Misión Diaria:*
│ • Batallar 3 veces
│ • Recompensa: 100 EXP, 50¥
│ 
│ ⚔️ *Misión de Combate:*
│ • Ganar 5 batallas
│ • Recompensa: 200 EXP, 100¥
│ 
│ 📈 *Misión de Nivel:*
│ • Alcanzar nivel 10
│ • Recompensa: 500 EXP, Arma especial
│ 
│ 🎪 *Misión Especial:*
│ • Completar todas las misiones diarias
│ • Recompensa: Título exclusivo
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤗 *¡Itsuki tiene misiones especiales para ti!* ✨️`

        return conn.reply(m.chat, misiones, m, ctxOk)
    }

    async function entrenar() {
        if (user.stats.energia < 5) {
            return conn.reply(m.chat, '❌ *No tienes suficiente energía para entrenar*', m, ctxErr)
        }

        user.stats.energia -= 5
        const expGanada = 10 + Math.floor(Math.random() * 10)
        user.exp += expGanada

        // Posibilidad de ganar puntos de stat
        let mensajeExtra = ''
        if (Math.random() < 0.3) { // 30% de chance
            user.puntos += 1
            mensajeExtra = '\n🎁 *¡+1 Punto de Stat!*'
        }

        await verificarNivel(user)

        const entrenamiento = 
`╭━━━〔 ⚡️ 𝐄𝐍𝐓𝐑𝐄𝐍𝐀𝐌𝐈𝐄𝐍𝐓𝐎 ⚡️ 〕━━━⬣
│ 👤 *Entrenando:* ${userName}
│ 
│ 📈 *RESULTADOS:*
│ ⭐ EXP: +${expGanada}
│ ⚡ Energía: -5
│ ${mensajeExtra}
│ 
│ 📊 *PROGRESO:*
│ Nivel: ${user.nivel}
│ EXP: ${user.exp}/${user.expNecesaria}
│ Puntos: ${user.puntos}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤗 *¡Itsuki está orgullosa de tu dedicación!* ✨️`

        return conn.reply(m.chat, entrenamiento, m, ctxOk)
    }

    // FUNCIÓN AUXILIAR: Verificar nivel
    async function verificarNivel(jugador) {
        while (jugador.exp >= jugador.expNecesaria) {
            jugador.exp -= jugador.expNecesaria
            jugador.nivel++
            jugador.expNecesaria = Math.floor(jugador.expNecesaria * 1.5)
            jugador.puntos += 2

            // Mejorar stats al subir de nivel
            jugador.stats.vidaMax += 10
            jugador.stats.energiaMax += 5
            jugador.stats.ataque += 2
            jugador.stats.defensa += 1

            // Restaurar stats
            jugador.stats.vida = jugador.stats.vidaMax
            jugador.stats.energia = jugador.stats.energiaMax

            // Actualizar clase y título
            if (jugador.nivel >= 10) jugador.clase = 'Experto'
            if (jugador.nivel >= 25) jugador.clase = 'Maestro'
            if (jugador.nivel >= 50) jugador.clase = 'Leyenda'
        }
    }

}

handler.help = ['nkrpg [opción]']
handler.tags = ['rpg']
handler.command = ['nkrpg', 'nkrpg', 'nkia', 'rpgitsuki']
handler.register = true

export default handler