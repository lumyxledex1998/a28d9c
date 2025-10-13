import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Verificar si el usuario es premium
  let user = global.db.data.users[m.sender];
  if (!user.premium || user.premiumTime < Date.now()) {
    return conn.reply(m.chat,
`╭━━━〔 🎀 𝐀𝐂𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 🎀 〕━━━⬣
│ ❌ *Comando Exclusivo Premium*
│ 
│ 💎 Edición de imágenes con IA
│ solo para miembros premium
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Obtén tu membresía:*
│ ${usedPrefix}premium dia
│ ${usedPrefix}premium semana  
│ ${usedPrefix}premium mes

🌸 *¡Únete al club exclusivo de Itsuki!* (◕‿◕✿)`, 
    m, ctxErr);
  }

  if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image/')) {
    return conn.reply(m.chat,
`╭━━━〔 🎀 𝐄𝐃𝐈𝐓𝐎𝐑 𝐀𝐈 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ ❌ *Debes responder a una imagen*
│ 
│ 📌 *Uso correcto:*
│ 1. Responde a una imagen con:
│ ${usedPrefix + command} <prompt>
│ 
│ 🎯 *Ejemplos:*
│ ${usedPrefix + command} hacerla estilo anime
│ ${usedPrefix + command} cambiar fondo a playa
│ ${usedPrefix + command} agregar efectos mágicos
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki necesita una imagen para editar...* 🖼️`, 
    m, ctxWarn);
  }

  if (!text) {
    return conn.reply(m.chat,
`╭━━━〔 🎀 𝐄𝐃𝐈𝐓𝐎𝐑 𝐀𝐈 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ ❌ *Debes escribir un prompt*
│ 
│ 📌 *Uso correcto:*
│ ${usedPrefix + command} <texto_de_edición>
│ 
│ 🎨 *Ejemplos creativos:*
│ • "hacerla estilo anime"
│ • "cambiar fondo a playa"
│ • "agregar efectos mágicos"
│ • "convertir en pintura al óleo"
│ • "hacer estilo cyberpunk"
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki necesita instrucciones para editar...* ✨`, 
    m, ctxWarn);
  }

  try {
    // Mensaje de procesamiento
    await conn.reply(m.chat,
`╭━━━〔 🎀 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎 🎀 〕━━━⬣
│ 🔮 *Editando imagen con IA*
│ 
│ 📥 Paso 1: Subiendo imagen
│ ⚡ Paso 2: Procesando prompt
│ 🎨 Paso 3: Aplicando edición
│ 💫 Paso 4: Generando resultado
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki está trabajando en tu edición...* 🖌️`, 
    m, ctxWarn);

    const buffer = await m.quoted.download()

    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, { filename: 'image.jpg' })

    const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    const url = data?.trim()
    if (!url || !url.startsWith('http')) {
      throw new Error('Error al subir la imagen')
    }

    const apiUrl = `https://mayapi.ooguy.com/photoeditor?image=${encodeURIComponent(url)}&q=${encodeURIComponent(text)}&apikey=may-f53d1d49`
    const res = await axios.get(apiUrl)
    const finalImg = res?.data?.result?.url
    
    if (!finalImg) {
      throw new Error('No se pudo generar la edición')
    }

    // Mensaje de éxito
    await conn.reply(m.chat,
`╭━━━〔 🎀 𝐄𝐃𝐈𝐂𝐈𝐎𝐍 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐃𝐀 🎀 〕━━━⬣
│ ✅ *¡Imagen editada con éxito!*
│ 
│ 🎨 *Prompt usado:* ${text}
│ 💎 *Calidad:* IA Premium
│ ⚡ *Estado:* Procesado
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki ha terminado tu edición...* 🎨`, 
    m, ctxOk);

    const imgBuffer = await axios.get(finalImg, { responseType: 'arraybuffer' }).then(res => res.data)
    await conn.sendFile(m.chat, imgBuffer, 'edit-premium.jpg', 
`╭━━━〔 🎀 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ ✅ *Edición IA completada*
│ 
│ 🎨 *Prompt:* ${text}
│ 💎 *Tipo:* Edición con IA
│ ⚡ *Calidad:* Premium
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *¡Disfruta tu imagen editada!* (◕‿◕✿)
🎀 *Beneficio exclusivo para miembros premium* 💫`, m)

    await m.react('✅')

  } catch (error) {
    console.error('❌ Error en edición AI:', error)
    await m.react('❌')

    await conn.reply(m.chat,
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 𝐃𝐄 𝐄𝐃𝐈𝐂𝐈𝐎𝐍 🎀 〕━━━⬣
│ ❌ *Error en el proceso*
│ 
│ 📝 *Detalles:* ${error.message}
│ 
│ 🔍 *Posibles causas:*
│ • Prompt muy complejo
│ • Imagen no compatible
│ • Error del servidor AI
│ • Intenta con otro prompt
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki lo sentirá mucho...* (´；ω；\`)
🎀 *Por favor, intenta con otra imagen o prompt*`, 
    m, ctxErr);
  }
}

handler.help = ['editai <prompt>']
handler.tags = ['premium']
handler.command = ['editai', 'iaedit', 'editia', 'aiimage']
handler.register = true
handler.premium = true

export default handler