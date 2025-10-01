/*
██████╗░██╗░░░██╗███████╗███████╗
██╔══██╗╚██╗░██╔╝╚════██║██╔════╝
██████╔╝░╚████╔╝░░░███╔═╝█████╗░░
██╔══██╗░░╚██╔╝░░██╔══╝░░██╔══╝░░
██║░░██║░░░██║░░░███████╗███████╗
╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚══════╝
Creado - By AyeitsRyze
Contacto - https://wa.me/+15614809253
Copyright 2025 - All rights reserved
*/

/*♡❀˖⁺. ༶🐻✨Este bot es oficialmente  de RyzeMD-David|Nino Nakano-@xrljose🌻♡⛓ ⋆˙⊹❀♡
*.°•*.♡ ️ッ Prohibido  editar los creditos ☁✧•. • °
☆ Creador RyzeMD y @xrljose
˚ ༘♡ ·˚꒰Gracias por usar nuestro bot꒱ ₊˚ˑ༄
*/

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import { dirname } from 'path' 

// Define global.__dirname, que es necesario si estás migrando código que lo usa (como tu función ffmpeg).
global.__dirname = (url) => dirname(fileURLToPath(url));

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Owners / Mods / Prems
global.owner = [
   ['595972314588', '۪〬.࠭⤿ 👑 ⋅ 𝘿𝙖𝙫𝙞𝙙   𝙭𝙯𝙨𝙮', true],
   ['18493907272', '𝙇𝙚𝙤   𝙭𝙯𝙨𝙮  🦇🩸', true],
   ['15614809253', 'AyeitsRyze', true],
   ['5216641784469', 'BrayanOFC', true]
];

global.mods = ['18493907272', '595972314588', '', '']
global.suittag = ['18493907272', '595972314588', '']
global.prems = ['18493907272', '595972314588', '', '']

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Bot Info
global.libreria = 'Baileys'
global.baileys = 'V 6.7.9'
global.languaje = 'Español'
global.vs = '2.2.0'
global.vsJB = '5.0'
global.nameqr = 'Itsukiqr'
global.namebot = 'Itsuki-IA'
global.sessions = 'sessions'
global.jadi = 'jadibts'
global.Choso = true
global.prefix = ['.', '!', '/' , '#']

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Número del bot (se autocompleta tras vinculación si usas pairing code)
global.botNumber = '50671976915'
global.packname = 'La Mejor Bot De WhatsApp'
global.botname = '𝙄𝙩𝙨𝙪𝙠𝙞-𝙄𝘼 🌸'
global.wm = '© 𝐋𝐞𝐨  𝐗𝐬𝐳𝐲'
global.wm3 = '⫹⫺  multi-device'
global.author = 'made by @Leo Xzsy'
global.dev = '© powered by Leo Xzsy'
global.textbot = 'Itsuki|IA- Leo Xzsy'
global.etiqueta = '@Leo Xzsy'
global.gt = '© creado Por Leo Xzsy'
global.me = '𝐈𝐭𝐬𝐮𝐤𝐢-𝐖𝐀𝐁𝐎𝐓'
global.listo = '* Aqui tiene*'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Currency
global.moneda = 'Yenes'


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Links
global.gp1 = 'https://chat.whatsapp.com/EteP5pnrAZC14y9wReGF1V'
global.comunidad1 = 'https://chat.whatsapp.com/DeJvBuS7QgB3Ybp1BZulWL'
global.channel = 'https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M'
global.channel2 = 'https://whatsapp.com/channel/0029ValMlRS6buMFL9d0iQ0S'
global.md = 'https://github.com/xzzys26/Gaara-Ultra-MD'
global.correo = 'xzzysultra@gmail.com'


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// APIs & Keys (placeholders; replace as needed)
global.APIs = {
  ryzen: 'https://api.ryzendesu.vip',
  xteam: 'https://api.xteam.xyz',
  lol: 'https://api.lolhuman.xyz',
  delirius: 'https://delirius-apiofc.vercel.app',
  siputzx: 'https://api.siputzx.my.id' // usado como fallback para sugerencias IA
}

global.APIKeys = {
  'https://api.xteam.xyz': 'YOUR_XTEAM_KEY',
  'https://api.lolhuman.xyz': 'API_KEY',
  'https://api.betabotz.eu.org': 'API_KEY',
  // 'https://api.siputzx.my.id': 'API_KEY_OPCIONAL'
}


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Configurable: endpoint de IA (siputzx bard)
global.SIPUTZX_AI = {
  base: global.APIs?.siputzx || 'https://api.siputzx.my.id',
  bardPath: '/api/ai/bard',
  queryParam: 'query',
  headers: { accept: '*/*' }
}


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Misc
global.multiplier = 69
global.maxwarn = 3


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Expose libs
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
//Global En chats
global.chatDefaults = {
  isBanned: false,
  sAutoresponder: '',
  welcome: true,
  autolevelup: false,
  autoAceptar: false,
  autosticker: false,
  autoRechazar: false,
  autoresponder: false,
  detect: true,
  antiBot: false,
  antiBot2: false,
  modoadmin: false,
  antiLink: true,
  antiImg: false,
  reaction: false,
  nsfw: false,
  antifake: false,
  delete: false,
  expired: 0,
  antiLag: false,
  per: [],
  antitoxic: false
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  try { import(pathToFileURL(file).href + `?update=${Date.now()}`) } catch {}
})


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Export para consumidores que usan import default (index.js adaptado)
export default {
  prefix: global.prefix,
  owner: global.owner,
  sessionDirName: global.sessions,
  sessionName: global.sessions,
  botNumber: global.botNumber,
  chatDefaults: global.chatDefaults
}
