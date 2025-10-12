const fs = require('fs');
const path = require('path');

// Archivo para guardar el estado de los comandos
const statusFile = path.join(__dirname, '../data/commandStatus.json');

// Asegurar que existe la carpeta data
if (!fs.existsSync(path.dirname(statusFile))) {
    fs.mkdirSync(path.dirname(statusFile), { recursive: true });
}

// Cargar o crear el archivo de estado
function loadStatus() {
    if (fs.existsSync(statusFile)) {
        return JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    }
    return {};
}

// Guardar el estado
function saveStatus(status) {
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
}

let commandStatus = loadStatus();

// Verificar si el comando está bloqueado
function checkCommandStatus(commandName, m, conn) {
    const status = commandStatus[commandName];
    
    if (status === 'mantenimiento') {
        conn.sendMessage(m.chat, {
            text: `╭━━━〔 🔧 MANTENIMIENTO 🔧 〕━━━⬣
│
│ *Comando:* ${commandName}
│ *Estado:* En Mantenimiento
│
│ 🔧 Este comando está siendo mejorado
│ 💫 Volverá pronto más optimizado
│ ⏰ Disculpa las molestias
│
│ _Por favor, intenta más tarde~_
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`
        });
        return false; // Bloquear ejecución
    }
    
    if (status === 'beta') {
        conn.sendMessage(m.chat, {
            text: `╭━━━〔 🧪 FASE BETA 🧪 〕━━━⬣
│
│ *Comando:* ${commandName}
│ *Estado:* En Pruebas
│
│ ⚠️ Este comando está en fase beta
│ 🔬 Puede presentar errores
│ 💡 Tu feedback es importante
│
│ _Ejecutando comando..._
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`
        });
        // Permitir ejecución pero con advertencia
    }
    
    return true; // Permitir ejecución
}

// Exportar para usar en otros comandos
global.commandStatus = commandStatus;
global.checkCommandStatus = checkCommandStatus;

// ========== COMANDO MANT ==========
let handler = async (m, { conn, usedPrefix, command, args, isOwner }) => {
    const ctxErr = (global.rcanalx || {})
    const ctxWarn = (global.rcanalw || {})
    const ctxOk = (global.rcanalr || {})
    
    if (!isOwner) {
        return conn.reply(m.chat, `╭━━━〔 ⚠️ ACCESO DENEGADO ⚠️ 〕━━━⬣
│
│ ❌ Este comando es solo para el owner
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxErr);
    }

    const targetCommand = args[0]?.toLowerCase();

    // Uso: .mant <comando> (pone en mantenimiento directamente)
    if (!targetCommand) {
        return conn.reply(m.chat, `╭━━━〔 🔧 SISTEMA DE MANTENIMIENTO 🔧 〕━━━⬣
│
│ *Uso:*
│
│ ▸ ${usedPrefix}mant <comando>
│   _Pone un comando en mantenimiento_
│
│ ▸ ${usedPrefix}demant <comando>
│   _Quita un comando de mantenimiento_
│
│ ▸ ${usedPrefix}mant lista
│   _Muestra todos los comandos bloqueados_
│
│ ▸ ${usedPrefix}mant estado <comando>
│   _Consulta el estado de un comando_
│
│ ━━━━━━━━━━━━━━━━━━━━
│
│ *Ejemplos:*
│ ${usedPrefix}mant menu
│ ${usedPrefix}demant menu
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxWarn);
    }

    // Comandos especiales
    if (targetCommand === 'lista' || targetCommand === 'list') {
        let lista = `╭━━━〔 📋 LISTA DE ESTADOS 📋 〕━━━⬣\n│\n`;

        if (Object.keys(commandStatus).length === 0) {
            lista += `│ ✅ Todos los comandos están activos\n│\n`;
        } else {
            for (const [cmd, stat] of Object.entries(commandStatus)) {
                const icon = stat === 'mantenimiento' ? '🔧' : '🧪';
                const texto = stat === 'mantenimiento' ? 'Mantenimiento' : 'Beta';
                lista += `│ ${icon} *${cmd}* - ${texto}\n`;
            }
            lista += `│\n`;
        }

        lista += `╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n*Itsuki Nakano IA* 🌸`;

        return conn.reply(m.chat, lista, m, ctxOk);
    }

    if (targetCommand === 'estado' || targetCommand === 'est') {
        const cmd = args[1]?.toLowerCase();
        
        if (!cmd) {
            return conn.reply(m.chat, `╭━━━〔 ℹ️ USO ℹ️ 〕━━━⬣
│
│ *Uso:* ${usedPrefix}mant estado <comando>
│
│ *Ejemplo:*
│ ${usedPrefix}mant estado menu
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxWarn);
        }

        const status = commandStatus[cmd] || 'activo';
        let statusIcon = '✅';
        let statusText = 'ACTIVO';
        let description = '✅ Comando funcionando\n│ 💫 Disponible para todos';

        if (status === 'mantenimiento') {
            statusIcon = '🔧';
            statusText = 'EN MANTENIMIENTO';
            description = '🔧 Comando en mantenimiento\n│ ⏰ No disponible temporalmente';
        } else if (status === 'beta') {
            statusIcon = '🧪';
            statusText = 'EN BETA';
            description = '🧪 Comando en fase beta\n│ ⚠️ Puede tener errores';
        }

        return conn.reply(m.chat, `╭━━━〔 ${statusIcon} ESTADO ${statusIcon} 〕━━━⬣
│
│ *Comando:* ${cmd}
│ *Estado:* ${statusText}
│
│ ━━━━━━━━━━━━━━━━━━━━
│
│ ${description}
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxOk);
    }

    // Poner en mantenimiento
    commandStatus[targetCommand] = 'mantenimiento';
    saveStatus(commandStatus);

    await conn.reply(m.chat, `╭━━━〔 ✅ ACTUALIZADO ✅ 〕━━━⬣
│
│ *Comando:* ${targetCommand}
│ *Nuevo Estado:* 🔧 MANTENIMIENTO
│
│ ━━━━━━━━━━━━━━━━━━━━
│
│ ✅ El comando ha sido desactivado
│ 🔒 Los usuarios no podrán usarlo
│ ⏰ Hasta que sea reactivado
│
│ *Para reactivar:*
│ ${usedPrefix}demant ${targetCommand}
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxOk);
}

handler.help = ['mant'];
handler.tags = ['owner'];
handler.command = /^(mant|mantenimiento)$/i;
handler.owner = true;

module.exports = handler;

// ========== COMANDO DEMANT ==========
module.exports.demant = {
    async handler(m, { conn, usedPrefix, args, isOwner }) {
        const ctxErr = (global.rcanalx || {})
        const ctxOk = (global.rcanalr || {})
        const ctxWarn = (global.rcanalw || {})
        
        if (!isOwner) {
            return conn.reply(m.chat, `╭━━━〔 ⚠️ ACCESO DENEGADO ⚠️ 〕━━━⬣
│
│ ❌ Este comando es solo para el owner
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxErr);
        }

        const targetCommand = args[0]?.toLowerCase();

        if (!targetCommand) {
            return conn.reply(m.chat, `╭━━━〔 ℹ️ USO ℹ️ 〕━━━⬣
│
│ *Uso:* ${usedPrefix}demant <comando>
│
│ *Ejemplo:*
│ ${usedPrefix}demant menu
│ ${usedPrefix}demant play
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxWarn);
        }

        delete commandStatus[targetCommand];
        saveStatus(commandStatus);

        await conn.reply(m.chat, `╭━━━〔 ✅ REACTIVADO ✅ 〕━━━⬣
│
│ *Comando:* ${targetCommand}
│ *Nuevo Estado:* ✅ ACTIVO
│
│ ━━━━━━━━━━━━━━━━━━━━
│
│ ✅ El comando ha sido reactivado
│ 🔓 Funciona sin restricciones
│ 💫 Los usuarios pueden usarlo
│
╰━━━━━━━━━━━━━━━━━━━━━━⬣

*Itsuki Nakano IA* 🌸`, m, ctxOk);
    },
    help: ['demant'],
    tags: ['owner'],
    command: /^(demant)$/i,
    owner: true
};