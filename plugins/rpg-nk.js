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
            recompensas: {},
            razas: {
                'Humano': { 
                    vida: 10, ataque: 8, defensa: 7, energia: 6,
                    habilidad: 'Adaptabilidad - +10% EXP en todas las actividades'
                },
                'Elfo': { 
                    vida: 7, ataque: 9, defensa: 6, energia: 9,
                    habilidad: 'Precisión Élfica - +15% de daño crítico'
                },
                'Mago': { 
                    vida: 6, ataque: 12, defensa: 5, energia: 10,
                    habilidad: 'Poder Arcano - +20% de daño mágico'
                },
                'Brujo': { 
                    vida: 8, ataque: 10, defensa: 8, energia: 8,
                    habilidad: 'Alquimia Oscura - +15% de vida al usar pociones'
                },
                'Demonio': { 
                    vida: 12, ataque: 11, defensa: 9, energia: 7,
                    habilidad: 'Furia Infernal - +25% de daño cuando vida < 30%'
                }
            },
            objetos: {
                armas: {
                    'Espada Básica': { ataque: 15, precio: 100, tipo: 'fisica' },
                    'Bastón Mágico': { ataque: 25, precio: 300, tipo: 'magica' },
                    'Arco de Itsuki': { ataque: 35, precio: 500, tipo: 'fisica' },
                    'Grimorio Oscuro': { ataque: 40, precio: 700, tipo: 'magica' },
                    'Guadaña Demoníaca': { ataque: 45, precio: 900, tipo: 'demoníaca' }
                },
                armaduras: {
                    'Túnica Básica': { defensa: 10, precio: 80 },
                    'Armadura de Acero': { defensa: 20, precio: 250 },
                    'Manto de Itsuki': { defensa: 30, precio: 400 },
                    'Túnica Élfica': { defensa: 25, precio: 350 },
                    'Armadura Demoníaca': { defensa: 35, precio: 600 }
                },
                consumibles: {
                    'Poción de Vida': { vida: 50, precio: 50 },
                    'Poción de Energía': { energia: 30, precio: 40 },
                    'Onigiri Mágico': { vida: 100, energia: 50, precio: 100 },
                    'Elixir de Fuerza': { ataque: 10, duracion: 3, precio: 150 },
                    'Poción de Defensa': { defensa: 8, duracion: 3, precio: 120 }
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

            // RAZA Y CLASE
            raza: 'Humano',
            clase: 'Novato',
            titulo: 'Estudiante Primerizo',

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

            // BATALLAS
            victorias: 0,
            derrotas: 0,
            misionesCompletadas: 0,

            // ECONOMÍA
            coin: 1000,

            // RECOMPENSAS
            recompensasRecibidas: [],
            ultimaRecompensa: 0
        }
    }

    const user = global.nkRPG.users[m.sender]
    const userName = conn.getName(m.sender) || 'Aventurero'
    const args = text ? text.split(' ') : []
    const subCommand = args[0]?.toLowerCase()

    // 🎯 COMANDO PRINCIPAL: nkrpg
    if (command === 'nkrpg' || command === 'rpgitsuki' || command === 'nkia') {
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

        // 👤 RAZAS
        if (subCommand === 'razas' || subCommand === 'races') {
            return mostrarRazas()
        }

        // 🎁 RECOMPENSA
        if (subCommand === 'recompensa' || subCommand === 'reward') {
            return reclamarRecompensa()
        }
    }

    // 🧬 COMANDO ELEGIR RAZA
    if (command === 'elegirraza' || command === 'selectrace') {
        return elegirRaza(text)
    }

    // 🛍️ COMANDO COMPRAR
    if (command === 'comprar' || command === 'buy') {
        return comprarObjeto(text)
    }

    // FUNCIONES PRINCIPALES
    async function mostrarMenuPrincipal() {
        const progreso = Math.min((user.exp / user.expNecesaria) * 100, 100)
        const barra = '█'.repeat(Math.floor(progreso / 10)) + '░'.repeat(10 - Math.floor(progreso / 10))

        const menu = 
`╭━━━〔 👑 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐍𝐊-𝐈𝐀 𝐑𝐏𝐆 🔥 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ 🧬 *Raza:* ${user.raza} | ${user.clase}
│ ⭐ *Nivel:* ${user.nivel} 
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

🧬 *Razas:*
• ${usedPrefix}nkrpg razas

🎁 *Recompensa:*
• ${usedPrefix}nkrpg recompensa

🎯 *Entrenar:*
• ${usedPrefix}nkrpg entrenar

🛍️ *Comprar:*
• ${usedPrefix}comprar espada
• ${usedPrefix}comprar pocion

🧬 *Elegir Raza:*
• ${usedPrefix}elegirraza humano
• ${usedPrefix}elegirraza elfo

⚔️ *¡Itsuki te guiará en esta aventura!* ✨️`

        return conn.reply(m.chat, menu, m, ctxOk)
    }

    async function elegirRaza(razaTexto) {
        if (!razaTexto) {
            return conn.reply(m.chat,
`╭━━━〔 🧬 𝐄𝐋𝐄𝐆𝐈𝐑 𝐑𝐀𝐙𝐀 💫 〕━━━⬣
│ ❌ *Debes especificar una raza*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}elegirraza <raza>
│ 
│ 🎯 *Razas disponibles:*
│ • humano
│ • elfo
│ • mago
│ • brujo
│ • demonio
│ 
│ 💡 *Solo disponible en nivel 1*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxWarn)
        }

        if (user.nivel > 1) {
            return conn.reply(m.chat, '❌ *Solo puedes elegir raza en nivel 1*', m, ctxErr)
        }

        const raza = razaTexto.toLowerCase()
        const razasDisponibles = {
            'humano': 'Humano',
            'elfo': 'Elfo', 
            'mago': 'Mago',
            'brujo': 'Brujo',
            'demonio': 'Demonio'
        }

        if (!razasDisponibles[raza]) {
            return conn.reply(m.chat, '❌ *Raza no válida. Usa:* ' + usedPrefix + 'nkrpg razas *para ver las razas disponibles*', m, ctxErr)
        }

        const razaElegida = razasDisponibles[raza]
        const statsRaza = global.nkRPG.razas[razaElegida]

        // Aplicar stats de la raza
        user.raza = razaElegida
        user.stats.vidaMax += statsRaza.vida
        user.stats.vida = user.stats.vidaMax
        user.stats.ataque += statsRaza.ataque
        user.stats.defensa += statsRaza.defensa
        user.stats.energiaMax += statsRaza.energia
        user.stats.energia = user.stats.energiaMax

        return conn.reply(m.chat,
`╭━━━〔 🧬 𝐑𝐀𝐙𝐀 𝐄𝐋𝐄𝐆𝐈𝐃𝐀 💫 〕━━━⬣
│ 🎉 *¡Felicidades!*
│ 🧬 *Raza seleccionada:* ${razaElegida}
│ 
│ 📊 *BONUS DE RAZA:*
│ ❤️ Vida: +${statsRaza.vida}
│ 🗡️ Ataque: +${statsRaza.ataque}
│ 🛡️ Defensa: +${statsRaza.defensa}
│ ⚡ Energía: +${statsRaza.energia}
│ 
│ 💫 *HABILIDAD ESPECIAL:*
│ ${statsRaza.habilidad}
│ 
│ 🎯 *¡Comienza tu aventura!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxOk)
    }

    async function comprarObjeto(objetoTexto) {
        if (!objetoTexto) {
            return conn.reply(m.chat,
`╭━━━〔 🛍️ 𝐂𝐎𝐌𝐏𝐑𝐀𝐑 𝐎𝐁𝐉𝐄𝐓𝐎𝐒 🏪 〕━━━⬣
│ ❌ *Debes especificar un objeto*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}comprar <objeto>
│ 
│ 🎯 *Objetos disponibles:*
│ • espada
│ • baston
│ • arco
│ • grimorio
│ • guadaña
│ • tunica
│ • armadura
│ • manto
│ • tunicaelfica
│ • armadurademonio
│ • pocionvida
│ • pocionenergia
│ • onigiri
│ • elixir
│ • pociondefensa
│ 
│ 💡 *Usa:* ${usedPrefix}nkrpg tienda
│ *Para ver precios*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxWarn)
        }

        const objeto = objetoTexto.toLowerCase()
        const objetosDisponibles = {
            // Armas
            'espada': 'Espada Básica',
            'baston': 'Bastón Mágico',
            'arco': 'Arco de Itsuki',
            'grimorio': 'Grimorio Oscuro',
            'guadaña': 'Guadaña Demoníaca',
            
            // Armaduras
            'tunica': 'Túnica Básica',
            'armadura': 'Armadura de Acero',
            'manto': 'Manto de Itsuki',
            'tunicaelfica': 'Túnica Élfica',
            'armadurademonio': 'Armadura Demoníaca',
            
            // Consumibles
            'pocionvida': 'Poción de Vida',
            'pocionenergia': 'Poción de Energía',
            'onigiri': 'Onigiri Mágico',
            'elixir': 'Elixir de Fuerza',
            'pociondefensa': 'Poción de Defensa'
        }

        if (!objetosDisponibles[objeto]) {
            return conn.reply(m.chat, '❌ *Objeto no encontrado. Usa:* ' + usedPrefix + 'nkrpg tienda *para ver objetos disponibles*', m, ctxErr)
        }

        const nombreObjeto = objetosDisponibles[objeto]
        let statsObjeto = null
        let tipo = ''

        // Buscar en armas
        if (global.nkRPG.objetos.armas[nombreObjeto]) {
            statsObjeto = global.nkRPG.objetos.armas[nombreObjeto]
            tipo = 'arma'
        }
        // Buscar en armaduras
        else if (global.nkRPG.objetos.armaduras[nombreObjeto]) {
            statsObjeto = global.nkRPG.objetos.armaduras[nombreObjeto]
            tipo = 'armadura'
        }
        // Buscar en consumibles
        else if (global.nkRPG.objetos.consumibles[nombreObjeto]) {
            statsObjeto = global.nkRPG.objetos.consumibles[nombreObjeto]
            tipo = 'consumible'
        }

        if (!statsObjeto) {
            return conn.reply(m.chat, '❌ *Error al encontrar el objeto*', m, ctxErr)
        }

        // Verificar si tiene suficiente dinero
        if (user.coin < statsObjeto.precio) {
            return conn.reply(m.chat, `❌ *No tienes suficiente dinero. Necesitas ${statsObjeto.precio}¥ y tienes ${user.coin}¥*`, m, ctxErr)
        }

        // Comprar objeto
        user.coin -= statsObjeto.precio

        if (tipo === 'consumible') {
            // Agregar al inventario
            if (!user.inventario[nombreObjeto]) {
                user.inventario[nombreObjeto] = 0
            }
            user.inventario[nombreObjeto] += 1
        } else {
            // Equipar automáticamente
            if (tipo === 'arma') {
                user.equipo.arma = nombreObjeto
                user.stats.ataque += statsObjeto.ataque
            } else if (tipo === 'armadura') {
                user.equipo.armadura = nombreObjeto
                user.stats.defensa += statsObjeto.defensa
            }
        }

        let mensajeObjeto = ''
        if (tipo === 'arma') {
            mensajeObjeto = `🗡️ *Arma equipada:* ${nombreObjeto} (+${statsObjeto.ataque} ataque)`
        } else if (tipo === 'armadura') {
            mensajeObjeto = `🛡️ *Armadura equipada:* ${nombreObjeto} (+${statsObjeto.defensa} defensa)`
        } else {
            mensajeObjeto = `🎒 *Objeto agregado:* ${nombreObjeto} x1`
        }

        return conn.reply(m.chat,
`╭━━━〔 🛍️ 𝐂𝐎𝐌𝐏𝐑𝐀 𝐄𝐗𝐈𝐓𝐎𝐒𝐀 ✅ 〕━━━⬣
│ 🎉 *¡Compra realizada!*
│ ${mensajeObjeto}
│ 
│ 💰 *PAGO:*
│ Precio: ${statsObjeto.precio}¥
│ Saldo anterior: ${user.coin + statsObjeto.precio}¥
│ Saldo actual: ${user.coin}¥
│ 
│ 🎯 *¡Disfruta tu compra!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxOk)
    }

    // ... (las demás funciones se mantienen igual: mostrarPerfil, mostrarRazas, reclamarRecompensa, iniciarBatalla, mostrarInventario, mostrarTienda, mostrarMisiones, entrenar, verificarNivel)
    // [Aquí van todas las demás funciones que ya tenías...]
}

handler.help = ['nkrpg', 'elegirraza <raza>', 'comprar <objeto>']
handler.tags = ['rpg']
handler.command = ['nkrpg', 'rpgitsuki', 'elegirraza', 'comprar']
handler.register = true

export default handler