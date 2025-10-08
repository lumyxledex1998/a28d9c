/*
██████╗░██╗░░░██╗███████╗███████╗
██╔══██╗╚██╗░██╔╝╚════██║██╔════╝
██████╔╝░╚████╔╝░░░███╔═╝█████╗░░
██╔══██╗░░╚██╔╝░░██╔══╝░░██╔══╝░░
██║░░██║░░░██║░░░███████╗███████╗
╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚══════╝
*/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Jimp from 'jimp'
import { jidNormalizedUser } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }) } catch {} }

async function loadImageSmart(src) {
  if (!src) return null
  try {
    if (/^https?:\/\//i.test(src)) {
      const res = await fetch(src)
      if (!res.ok) throw new Error('fetch fail')
      const buf = Buffer.from(await res.arrayBuffer())
      return await Jimp.read(buf)
    }
    return await Jimp.read(src)
  } catch { return null }
}

export async function makeCard({ title = 'Bienvenida', subtitle = '', avatarUrl = '', bgUrl = '', badgeUrl = '' }) {
  const width = 900, height = 380
  const canvas = new Jimp(width, height, 0x000000FF)
  
  const radius = 30
  
  // Crear gradiente manualmente
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ratio = (x + y) / (width + height)
      const r = Math.floor(6 + (25 - 6) * ratio)
      const g = Math.floor(20 + (42 - 20) * ratio)
      const b = Math.floor(31 + (59 - 31) * ratio)
      canvas.setPixelColor(Jimp.rgbaToInt(r, g, b, 255), x, y)
    }
  }

  // Dibujar borde
  const borderColor = Jimp.rgbaToInt(25, 195, 255, 255)
  for (let i = 0; i < 12; i++) {
    // Bordes exteriores
    for (let x = i; x < width - i; x++) {
      canvas.setPixelColor(borderColor, x, i)
      canvas.setPixelColor(borderColor, x, height - 1 - i)
    }
    for (let y = i; y < height - i; y++) {
      canvas.setPixelColor(borderColor, i, y)
      canvas.setPixelColor(borderColor, width - 1 - i, y)
    }
  }

  // Fondo con imagen
  if (bgUrl) {
    try {
      const bg = await loadImageSmart(bgUrl)
      if (bg) {
        const pad = 18
        const bgWidth = width - pad * 2
        const bgHeight = height - pad * 2
        
        const resizedBg = bg.clone().resize(bgWidth, bgHeight)
        
        // Aplicar opacidad
        resizedBg.opacity(0.9)
        
        canvas.composite(resizedBg, pad, pad)
        
        // Capa oscura semi-transparente
        const darkOverlay = new Jimp(bgWidth, bgHeight, Jimp.rgbaToInt(0, 0, 0, 89))
        canvas.composite(darkOverlay, pad, pad)
      }
    } catch {}
  }

  let avatarUsedInCenter = false
  let centerR = 54
  let centerCX = Math.round(width / 2)
  let centerCY = 86
  
  try {
    const useCenterAvatar = !badgeUrl && !!avatarUrl
    centerR = useCenterAvatar ? 80 : 54
    centerCY = useCenterAvatar ? Math.round(height / 2) : 86
    const centerSrc = (badgeUrl && badgeUrl.trim()) ? badgeUrl : (avatarUrl || '')
    
    if (centerSrc) {
      const badge = await loadImageSmart(centerSrc)
      if (badge) {
        // Crear máscara circular
        const mask = new Jimp(centerR * 2, centerR * 2, 0x00000000)
        for (let y = 0; y < centerR * 2; y++) {
          for (let x = 0; x < centerR * 2; x++) {
            const dx = x - centerR
            const dy = y - centerR
            if (dx * dx + dy * dy <= centerR * centerR) {
              mask.setPixelColor(0xFFFFFFFF, x, y)
            }
          }
        }

        const resizedBadge = badge.clone().resize(centerR * 2, centerR * 2)
        resizedBadge.mask(mask, 0, 0)
        
        canvas.composite(resizedBadge, centerCX - centerR, centerCY - centerR)
        
        // Dibujar borde circular
        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
          const x = centerCX + Math.cos(angle) * (centerR + 4)
          const y = centerCY + Math.sin(angle) * (centerR + 4)
          for (let i = -3; i <= 3; i++) {
            for (let j = -3; j <= 3; j++) {
              const px = Math.round(x + i)
              const py = Math.round(y + j)
              if (px >= 0 && px < width && py >= 0 && py < height) {
                canvas.setPixelColor(borderColor, px, py)
              }
            }
          }
        }
        
        avatarUsedInCenter = useCenterAvatar
      }
    }
  } catch {}

  // Cargar fuente (usar fuente por defecto de Jimp)
  try {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
    const titleFont = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
    const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)

    // Dibujar título
    const titleY = avatarUsedInCenter ? 70 : 178
    canvas.print(titleFont, width / 2 - 200, titleY - 40, {
      text: title,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 400, 80)

    // Dibujar subtítulo
    const lines = Array.isArray(subtitle) ? subtitle : [subtitle]
    const subBaseY = avatarUsedInCenter ? (centerCY + centerR + 28) : 218
    
    lines.forEach((t, i) => {
      canvas.print(font, width / 2 - 300, subBaseY + i * 34 - 16, {
        text: String(t || ''),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      }, 600, 32)
    })

  } catch {
    // Fallback si falla la carga de fuentes
    console.log('Usando fuentes básicas')
  }

  // Avatar en esquina (si no se usó en el centro)
  if (avatarUrl && !avatarUsedInCenter) {
    try {
      const av = await loadImageSmart(avatarUrl)
      if (av) {
        const r = 64
        const x = width - 120
        const y = height - 120
        
        // Crear máscara circular para el avatar
        const avatarMask = new Jimp(r * 2, r * 2, 0x00000000)
        for (let ay = 0; ay < r * 2; ay++) {
          for (let ax = 0; ax < r * 2; ax++) {
            const dx = ax - r
            const dy = ay - r
            if (dx * dx + dy * dy <= r * r) {
              avatarMask.setPixelColor(0xFFFFFFFF, ax, ay)
            }
          }
        }

        const resizedAv = av.clone().resize(r * 2, r * 2)
        resizedAv.mask(avatarMask, 0, 0)
        
        canvas.composite(resizedAv, x - r, y - r)
        
        // Borde del avatar
        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
          const ax = x + Math.cos(angle) * (r + 3)
          const ay = y + Math.sin(angle) * (r + 3)
          for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
              const px = Math.round(ax + i)
              const py = Math.round(ay + j)
              if (px >= 0 && px < width && py >= 0 && py < height) {
                canvas.setPixelColor(borderColor, px, py)
              }
            }
          }
        }
      }
    } catch {}
  }

  return await canvas.getBufferAsync(Jimp.MIME_PNG)
}

// El resto del código se mantiene EXACTAMENTE igual
export async function sendWelcomeOrBye(conn, { jid, userName = 'Usuario', type = 'welcome', groupName = '', participant }) {
  const tmp = path.join(__dirname, '../temp')
  ensureDir(tmp)
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const normalizeNumberFromJid = (jidOrNum = '') => {
    const raw = String(jidOrNum || '')
    const justJid = raw.includes('@') ? raw.split('@')[0] : raw
    const justNoSuffix = justJid.split(':')[0]
    const onlyDigits = justNoSuffix.replace(/\D+/g, '')
    return onlyDigits
  }
  const BG_IMAGES = [
    'https://iili.io/KIShsKx.md.jpg',
    'https://iili.io/KIShLcQ.md.jpg',
    'https://iili.io/KISwzI1.md.jpg',
    'https://iili.io/KIShPPj.md.jpg',
    'https://iili.io/KISwREJ.md.jpg',
    'https://iili.io/KISw5rv.md.jpg',
    'https://iili.io/KISwY2R.md.jpg',
    'https://iili.io/KISwa7p.md.jpg',
    'https://iili.io/KISwlpI.md.jpg',
    'https://iili.io/KISw1It.md.jpg',
    'https://iili.io/KISwEhX.md.jpg',
    'https://iili.io/KISwGQn.md.jpg',
    'https://iili.io/KISwVBs.md.jpg',
    'https://iili.io/KISwWEG.md.jpg',
    'https://iili.io/KISwX4f.md.jpg'
  ]
  const WELCOME_TITLES = ['Bienvenido', 'Bienvenida', '¡Bienvenid@!', 'Saludos', '¡Hola!', 'Llegada', 'Nuevo miembro', 'Bienvenid@ al grupo', 'Que gusto verte', 'Bienvenido/a']
  const WELCOME_SUBS = [
    'Un placer tenerte aquí',
    'Que la pases bien con nosotros',
    'Esperamos que disfrutes el grupo',
    'Pásala bien y participa',
    'Aquí encontrarás buena onda',
    'Prepárate para la diversión',
    'Bienvenido, esperamos tus aportes',
    'Diviértete y sé respetuos@',
    'Gracias por unirte',
    'La comunidad te da la bienvenida'
  ]
  const BYE_TITLES = ['Adiós', 'Despedida', 'Hasta luego', 'Nos vemos', 'Salida', 'Bye', 'Chao', 'Nos vemos pronto', 'Que te vaya bien', 'Sayonara']
  const BYE_SUBS = [
    'Adiós, nadie te quiso',
    'No vuelvas más, eres feo',
    'Se fue sin dejar rastro',
    'Buena suerte en lo que siga',
    'Hasta nunca',
    'Que te vaya mejor (o no)',
    'Te extrañaremos (no tanto)',
    'Nos veremos en otra vida',
    'Adiós y cuídate',
    'Chao, fue un placer... quizá'
  ]
  const title = type === 'welcome' ? pick(WELCOME_TITLES) : pick(BYE_TITLES)
  const subtitle = type === 'welcome' ? [pick(WELCOME_SUBS)] : [pick(BYE_SUBS)]
  const badgeUrl = ''
  const bgUrl = pick(BG_IMAGES)
  let avatarUrl = ''
  try {
    if (participant) avatarUrl = await conn.profilePictureUrl(participant, 'image')
  } catch {}
  if (!avatarUrl) avatarUrl = 'https://files.catbox.moe/xr2m6u.jpg'
  const buff = await makeCard({ title, subtitle, avatarUrl, bgUrl, badgeUrl })
  const file = path.join(tmp, `${type}-${Date.now()}.png`)
  fs.writeFileSync(file, buff)
  const who = participant || ''
  let realJid = who
  try { if (typeof conn?.decodeJid === 'function') realJid = conn.decodeJid(realJid) } catch {}
  try { realJid = jidNormalizedUser(realJid) } catch {}
  const number = normalizeNumberFromJid(realJid)
  const taguser = number ? `@${number}` : (userName || 'Usuario')
  let meta = null
  try { meta = await conn.groupMetadata(jid) } catch {}
  const totalMembers = Array.isArray(meta?.participants) ? meta.participants.length : 0
  const groupSubject = meta?.subject || groupName || ''
  const tipo = type === 'welcome' ? 'Bienvenid@' : 'Despedida'
  const date = new Date().toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour12: false, hour: '2-digit', minute: '2-digit' })

  let fkontak = null
  try {
    const res = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    fkontak = { key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' }, message: { locationMessage: { name: `${tipo}`, jpegThumbnail: thumb2 } }, participant: '0@s.whatsapp.net' }
  } catch {}

  const productMessage = {
    product: {
      productImage: { url: file },
      productId: '24529689176623820',
      title: `${tipo}, ᴀʜᴏʀᴀ sᴏᴍᴏs ${totalMembers}`,
      description: '',
      currencyCode: 'USD',
      priceAmount1000: '100000',
      retailerId: 1677,
      url: `https://wa.me/${number}`,
      productImageCount: 1
    },
    businessOwnerJid: who || '0@s.whatsapp.net',
    caption: `*👤ᴜsᴜᴀʀɪᴏ*: ${taguser}\n*📚 ɢʀᴜᴘᴏ*: ${groupSubject}\n*👥 ᴍɪᴇᴍʙʀᴏs*: ${totalMembers}\n*📆 ғᴇᴄʜᴀ*: ${date}`.trim(),
    title: '',
    subtitle: '',
    footer: groupSubject || '',
    interactiveButtons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '🌸 ᴍᴇɴᴜ-ɴᴀᴋᴀɴᴏ 🌸',
          id: '.menunakano'
        })
      }
    ],
    mentions: who ? [who] : []
  }

  const mentionId = who ? [who] : []
  await conn.sendMessage(jid, productMessage, { quoted: fkontak || undefined, contextInfo: { mentionedJid: mentionId } })
  return file
}

export default { makeCard, sendWelcomeOrBye }