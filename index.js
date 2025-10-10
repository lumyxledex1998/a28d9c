const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

let rtx =  "🌱 S U B - B O T   I T S U K I 🌱\n\n";
rtx +=     "➺ *Paso 1:* Abre WhatsApp en tu otro dispositivo\n";
rtx +=     "➺ *Paso 2:* Ve a ⋮ y selecciona *WhatsApp Web*\n";
rtx +=     "➺ *Paso 3:* Escanea este código QR con amor ♡\n\n";
rtx +=     "⏰ *Expira en 15 segundos*\n";
rtx +=     "📝 *Nota de Itsuki:* Úsame con cariño y responsabilidad~";

let rtx2 =  "🌟 V I N C U L A R   C Ó D I G O 🌟\n\n";
rtx2 +=     "➺ *Paso 1:* Dirígete a ⋮ y luego a *Dispositivos*\n";
rtx2 +=     "➺ *Paso 2:* Selecciona la opción *Vincular dispositivo*\n";
rtx2 +=     "➺ *Paso 3:* Ingresa este código especial:\n\n";
rtx2 +=     "💌 *Tu código:* 8 dígitos mágicos\n";
rtx2 +=     "⏰ *Válido por poco segundos*\n";
rtx2 +=     "📝 *Consejo de Itsuki:* Copia y pega rápidito~";

let imagenUrl = 'https://files.catbox.moe/9cbbyf.jpg';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const subBotOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
        const settings = globalThis?.db?.data?.settings || {}
        const jid = conn?.user?.jid
        if (!jid || !settings[jid]?.jadibotmd) {
                return conn.reply(m.chat, `🌸 Lo siento mucho~ Este comando está temporalmente desactivado por mi creador.\n\n✨ Uso: ${usedPrefix + command}`, m, (typeof rcanalx !== 'undefined' ? rcanalx : (typeof rcanal !== 'undefined' ? rcanal : {})))
        }

        // Aviso inicial
        try { await conn.reply(m.chat, '✨ Preparando tu conexión especial...', m, typeof rcanalw !== 'undefined' ? rcanalw : (typeof rcanal !== 'undefined' ? rcanal : {})) } catch {}

        // Cooldown para evitar spam
        const COOLDOWN_MS = 120000
        const last = Number(global.db?.data?.users?.[m.sender]?.Subs || 0)
        const now = Date.now()
        const remain = last + COOLDOWN_MS - now
        if (remain > 0) {
                return conn.reply(m.chat, `🌸 Por favor espera ${msToTime(remain)} antes de usar este comando nuevamente, ¿sí?`, m, (typeof rcanalx !== 'undefined' ? rcanalx : (typeof rcanal !== 'undefined' ? rcanal : {})))
        }

        // Límite de Sub-Bots
        const MAX_SUBBOTS = Number(global.maxSubBots || 20)
        const subBots = [...new Set([...global.conns.filter((c) => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)])]
        if (subBots.length >= MAX_SUBBOTS) {
                return conn.reply(m.chat, `💝 Lo siento mucho~ No hay espacios disponibles para nuevos Sub-Bots en este momento. Límite: ${MAX_SUBBOTS}`, m, (typeof rcanalx !== 'undefined' ? rcanalx : (typeof rcanal !== 'undefined' ? rcanal : {})))
        }

        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        let id = `${who.split('@')[0]}`

        // Limpiar conexiones muertas primero
        try {
                global.conns = global.conns.filter(s => {
                        try {
                                return s?.user && s?.ws?.socket && s.ws.socket.readyState !== ws.CLOSED
                        } catch {
                                return false
                        }
                })
        } catch {}

        // Verificar si hay una conexión activa válida
        try {
                const existingConn = global.conns.find(s => s?.user?.jid?.startsWith(id))
                if (existingConn) {
                        // Verificar si realmente está conectada
                        if (existingConn.ws?.socket?.readyState === ws.OPEN) {
                                return conn.reply(m.chat, `🌸 ¡Oh! Este número ya está conectado como Sub-Bot~`, m, (typeof rcanalr !== 'undefined' ? rcanalr : (typeof rcanal !== 'undefined' ? rcanal : {})))
                        } else {
                                // Si la conexión está muerta, limpiarla
                                try {
                                        existingConn.ws?.close()
                                } catch {}

                                const index = global.conns.indexOf(existingConn)
                                if (index > -1) {
                                        global.conns.splice(index, 1)
                                }

                                // Limpiar carpeta de sesión huérfana si existe
                                const baseDir = (global.jadi || 'jadibts')
                                let oldSubBotPath = path.join(`./${baseDir}/`, id)
                                if (fs.existsSync(oldSubBotPath)) {
                                        try {
                                                fs.rmSync(oldSubBotPath, { recursive: true, force: true })
                                        } catch {}
                                }
                        }
                }
        } catch {}

        const baseDir = (global.jadi || 'jadibts')
        let subBotPath = path.join(`./${baseDir}/`, id)
        if (!fs.existsSync(subBotPath)){
                fs.mkdirSync(subBotPath, { recursive: true })
        }

        subBotOptions.subBotPath = subBotPath
        subBotOptions.m = m
        subBotOptions.conn = conn
        subBotOptions.args = args
        subBotOptions.usedPrefix = usedPrefix
        subBotOptions.command = command
        subBotOptions.fromCommand = true

        startSubBot(subBotOptions)
        global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function startSubBot(options) {
        let { subBotPath, m, conn, args, usedPrefix, command } = options;

        if (!subBotPath && options.pathjadibts) {
            subBotPath = options.pathjadibts;
        }

        if (typeof args === 'string') {
            args = args.split(' ').filter(Boolean);
        } else if (!Array.isArray(args)) {
            args = [];
        }

        if (command === 'code') {
                command = 'qr';
                args.unshift('code')
        }

        const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
        let txtCode, codeBot, txtQR

        if (mcode) {
                args[0] = args[0].replace(/^--code$|^code$/, "").trim()
                if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
                if (args[0] == "") args[0] = undefined
        }

        const pathCreds = path.join(subBotPath, "creds.json")
        if (!fs.existsSync(subBotPath)){
                fs.mkdirSync(subBotPath, { recursive: true })
        }

        try {
                if (args[0] && args[0] !== undefined) {
                        const decoded = Buffer.from(args[0], "base64").toString("utf-8")
                        fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(decoded), null, '\t'))
                }
        } catch (e) {
                conn.reply(m.chat, `🌸 Por favor usa correctamente el comando » ${usedPrefix + command} code`, m, (typeof rcanalx !== 'undefined' ? rcanalx : (typeof rcanal !== 'undefined' ? rcanal : {})))
                return
        }

        const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
        exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
                const drmer = Buffer.from(drm1 + drm2, "base64")

                let { version, isLatest } = await fetchLatestBaileysVersion()
                const msgRetry = (MessageRetryMap) => { }
                const msgRetryCache = new NodeCache()
                const { state, saveState, saveCreds } = await useMultiFileAuthState(subBotPath)

                const connectionOptions = {
                        logger: pino({ level: "fatal" }),
                        printQRInTerminal: false,
                        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
                        msgRetry,
                        msgRetryCache,
                        browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : [`${global.botname || 'Itsuki-Bot'} Sub-Bot`, 'Chrome','2.0.0'],
                        version: version,
                        generateHighQualityLinkPreview: true
                };

                let sock = makeWASocket(connectionOptions)
                sock.isInit = false
                let isInit = true

                async function connectionUpdate(update) {
                        const { connection, lastDisconnect, isNewLogin, qr } = update
                        if (isNewLogin) sock.isInit = false

                        sock.reconnectAttempts = sock.reconnectAttempts || 0;
                        if (connection === 'close') {
                                sock.reconnectAttempts++;
                        } else if (connection === 'open') {
                                sock.reconnectAttempts = 0;
                                sock.lastPing = Date.now();
                        }

                        if (connection === 'open' && !sock.pingInterval) {
                                sock.pingInterval = setInterval(async () => {
                                        const isConnected = await checkConnection(sock);
                                        if (!isConnected) {
                                                console.log(chalk.yellow(`[${path.basename(subBotPath)}] 🌸 Conexión inestable detectada, intentando recuperar...`));
                                                await creloadHandler(true).catch(console.error);
                                        }
                                        sock.lastPing = Date.now();
                                }, 30000);
                        }

                        if (qr && !mcode) {
                                if (m?.chat) {
                                        txtQR = await conn.sendMessage(
                                                m.chat,
                                                { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim(), ...(typeof rcanalr === 'object' ? rcanalr : {}) },
                                                { quoted: m }
                                        )
                                } else {
                                        return
                                }
                                if (txtQR && txtQR.key) {
                                        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
                                }
                                return
                        }

                        if (qr && mcode) {
                                let secret = await sock.requestPairingCode((m.sender.split('@')[0]))
                                secret = secret.match(/.{1,4}/g)?.join("-")
                                txtCode = await conn.sendMessage(
                                        m.chat,
                                        { image: { url: imagenUrl }, caption: rtx2, ...(typeof rcanalr === 'object' ? rcanalr : {}) },
                                        { quoted: m }
                                );
                                codeBot = await conn.reply(m.chat, ` ${secret}`, m);
                                console.log(secret)
                        }

                        if (txtCode && txtCode.key) {
                                setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
                        }
                        if (codeBot && codeBot.key) {
                                setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
                        }

                        const endSesion = async (loaded) => {
                                if (!loaded) {
                                        try {
                                                sock.ws.close()
                                        } catch {
                                        }
                                        sock.ev.removeAllListeners()
                                        let i = global.conns.indexOf(sock)
                                        if (i < 0) return
                                        delete global.conns[i]
                                        global.conns.splice(i, 1)
                                }
                        }

                        const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode

                        if (connection === 'close') {
                                if (sock.pingInterval) {
                                        clearInterval(sock.pingInterval);
                                        sock.pingInterval = null;
                                }

                                const shouldReconnect = await reconnectWithBackoff(sock.reconnectAttempts);
                                if (!shouldReconnect) {
                                        console.log(chalk.red(`[${path.basename(subBotPath)}] 💔 Máximo de intentos de reconexión alcanzado.`));
                                        return endSesion(false);
                                }

                                if (reason === 428) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 La conexión (+${path.basename(subBotPath)}) se cerró inesperadamente. Intento ${sock.reconnectAttempts}/5...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        await creloadHandler(true).catch(console.error)
                                }
                                if (reason === 408) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 La conexión (+${path.basename(subBotPath)}) se perdió. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        await creloadHandler(true).catch(console.error)
                                }
                                if (reason === 440) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 La conexión (+${path.basename(subBotPath)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        try {
                                                if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(subBotPath)}@s.whatsapp.net`, {text : '🌸 HE DETECTADO UNA NUEVA SESIÓN, POR FAVOR BORRA LA NUEVA SESIÓN PARA CONTINUAR~\n\n💝 SI HAY ALGÚN PROBLEMA VUELVE A CONECTARTE' }, { quoted: m || null }) : ""
                                        } catch (error) {
                                                console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(subBotPath)}`))
                                        }
                                }
                                if (reason == 405 || reason == 401) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 La sesión (+${path.basename(subBotPath)}) fue cerrada. Credenciales no válidas.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        try {
                                                if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(subBotPath)}@s.whatsapp.net`, {text : '💔 SESIÓN PENDIENTE\n\n🌸 POR FAVOR INTENTA NUEVAMENTE VOLVER A SER SUB-BOT' }, { quoted: m || null }) : ""
                                        } catch (error) {
                                                console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(subBotPath)}`))
                                        }
                                        try { fs.rmSync(subBotPath, { recursive: true, force: true }) } catch {}
                                }
                                if (reason === 500) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 Conexión perdida en la sesión (+${path.basename(subBotPath)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(subBotPath)}@s.whatsapp.net`, {text : '💔 CONEXIÓN PERDIDA\n\n🌸 INTENTA MANUALMENTE VOLVER A SER SUB-BOT' }, { quoted: m || null }) : ""
                                        return creloadHandler(true).catch(console.error)
                                }
                                if (reason === 515) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 Reinicio automático para la sesión (+${path.basename(subBotPath)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        await creloadHandler(true).catch(console.error)
                                }
                                if (reason === 403) {
                                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮\n│ 🌸 Sesión cerrada para (+${path.basename(subBotPath)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✨ • ✨ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯`))
                                        try { fs.rmSync(subBotPath, { recursive: true, force: true }) } catch {}
                                }
                        }

                        if (global.db.data == null) loadDatabase()
                        if (connection == 'open') {
                                if (!global.db.data?.users) loadDatabase()
                                let userName, userJid
                                userName = sock.authState.creds.me.name || 'Anónimo'
                                userJid = sock.authState.creds.me.jid || `${path.basename(subBotPath)}@s.whatsapp.net`
                                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【✨ ITSUKI SUB-BOT ✨】⸺⸺⸺⸺❒\n│\n│ 🌸 ${userName} (+${path.basename(subBotPath)}) conectado exitosamente.\n│\n❒⸺⸺⸺【💝 CONECTADO 💝】⸺⸺⸺❒`))
                                sock.isInit = true
                                global.conns.push(sock)
                                await joinChannels(sock)

                                m?.chat ? await conn.sendMessage(
                                        m.chat,
                                        { text: args[0] ? `@${m.sender.split('@')[0]}, ¡ya estás conectada conmigo! Leyendo mensajes entrantes~ ✨` : `@${m.sender.split('@')[0]}, ¡qué alegría! Ya eres parte de nuestra linda familia de Sub-Bots 🌸💝`, mentions: [m.sender], ...(typeof rcanalr === 'object' ? rcanalr : {}) },
                                        { quoted: m }
                                ) : ''
                        }
                }

                setInterval(async () => {
                        if (!sock.user) {
                                try { sock.ws.close() } catch (e) {
                                }
                                sock.ev.removeAllListeners()
                                let i = global.conns.indexOf(sock)
                                if (i < 0) return
                                delete global.conns[i]
                                global.conns.splice(i, 1)
                        }
                }, 60000)

                let handler = await (global.queuedImport ? global.queuedImport('../handler.js') : import('../handler.js'))
                let creloadHandler = async function (restatConn) {
                        try {
                                const Handler = await (global.queuedImport ? global.queuedImport(`../handler.js?update=${Date.now()}`) : import(`../handler.js?update=${Date.now()}`)).catch(console.error)
                                if (Object.keys(Handler || {}).length) handler = Handler
                        } catch (e) {
                                console.error('⚠️ Nuevo error: ', e)
                        }
                        if (restatConn) {
                                const oldChats = sock.chats
                                try { sock.ws.close() } catch { }
                                sock.ev.removeAllListeners()
                                sock = makeWASocket(connectionOptions, { chats: oldChats })
                                isInit = true
                        }
                        if (!isInit) {
                                sock.ev.off("messages.upsert", sock.handler)
                                sock.ev.off("connection.update", sock.connectionUpdate)
                                sock.ev.off('creds.update', sock.credsUpdate)
                        }

                        sock.handler = handler.handler.bind(sock)
                        sock.connectionUpdate = connectionUpdate.bind(sock)
                        sock.credsUpdate = saveCreds.bind(sock, true)
                        sock.ev.on("messages.upsert", sock.handler)
                        sock.ev.on("connection.update", sock.connectionUpdate)
                        sock.ev.on("creds.update", sock.credsUpdate)
                        isInit = false
                        return true
                }
                creloadHandler(false)
        })
}

export const jadibts = startSubBot;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function reconnectWithBackoff(attempt, maxAttempts = 5) {
        const baseDelay = 1000;
        const maxDelay = 60000;
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        if (attempt < maxAttempts) {
                await sleep(delay);
                return true;
        }
        return false;
}

async function checkConnection(sock) {
        try {
                await sock.sendPresenceUpdate('available');
                return true;
        } catch (error) {
                return false;
        }
}

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
        hours = (hours < 10) ? '0' + hours : hours
        minutes = (minutes < 10) ? '0' + minutes : minutes
        seconds = (seconds < 10) ? '0' + seconds : seconds
        return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
        try {
                if (global.ch && typeof global.ch === 'object') {
                        for (const channelId of Object.values(global.ch)) {
                                await conn.newsletterFollow(channelId).catch(() => {})
                        }
                }
                await conn.newsletterFollow('120363377833048768@newsletter').catch(() => {})
        } catch {}
}