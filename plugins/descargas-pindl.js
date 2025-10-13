import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  let user = global.db.data.users[m.sender];
  
  // Verificar si el usuario es premium
  if (!user.premium || user.premiumTime < Date.now()) {
    return conn.reply(m.chat, 
`╭━━━〔 🎀 𝐀𝐂𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 🎀 〕━━━⬣
│ ❌ *Comando Exclusivo Premium*
│ 
│ 💎 Descargas de Pinterest
│ solo para miembros premium
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Obtén tu membresía:*
│ ${usedPrefix}premium dia
│ ${usedPrefix}premium semana  
│ ${usedPrefix}premium mes

🌸 *¡Únete al club exclusivo de Itsuki!* (◕‿◕✿)`, 
    m, ctxErr);
  }

  if (!args[0]) {
    return conn.reply(m.chat,
`╭━━━〔 🎀 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐃𝐎𝐑 𝐏𝐈𝐍𝐓𝐄𝐑𝐄𝐒𝐓 🎀 〕━━━⬣
│ 📌 *Uso correcto:*
│ ${usedPrefix + command} <url_pinterest>
│ 
│ 🎯 *Ejemplo:*
│ ${usedPrefix + command} https://pinterest.com/pin/xxxxx
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki necesita un enlace válido...* 📥`, 
    m, ctxWarn);
  }

  await m.react('⏳');
  
  try {
    const url = args[0];
    
    // Mensaje de procesamiento
    await conn.reply(m.chat,
`╭━━━〔 🎀 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎 🎀 〕━━━⬣
│ 🔮 *Analizando enlace de Pinterest*
│ 
│ 📥 Paso 1: Verificando enlace
│ ⚡ Paso 2: Conectando API
│ 🎬 Paso 3: Extrayendo video
│ 💫 Paso 4: Preparando descarga
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki está trabajando en tu descarga...* 📌`, 
    m, ctxWarn);

    const res = await axios.get(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(url)}`);
    const json = res.data;

    if (!json.status || !json.data?.url) {
      return conn.reply(m.chat,
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Enlace no válido*
│ 
│ 📝 No se pudo obtener el video
│ Verifica que el enlace sea correcto
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki no pudo procesar este enlace...* (´･ω･\`)`, 
    m, ctxErr);
    }

    // Enviar video con estilo premium
    await conn.sendMessage(m.chat, {
      video: { url: json.data.url },
      caption: 
`╭━━━〔 🎀 𝐕𝐈𝐃𝐄𝐎 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐃𝐎 🎀 〕━━━⬣
│ ✅ *¡Descarga completada!*
│ 
│ 📌 *Plataforma:* Pinterest
│ 🆔 *ID:* ${json.data.id}
│ 📅 *Fecha:* ${json.data.created_at}
│ 💎 *Tipo:* Video Premium
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *¡Contenido descargado con éxito!* (◕‿◕✿)
🎀 *Beneficio exclusivo para miembros premium* 💫`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    
    await conn.reply(m.chat,
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 𝐂𝐑𝐈𝐓𝐈𝐂𝐎 🎀 〕━━━⬣
│ ❌ *Error en el proceso*
│ 
│ 📝 Detalles:
│ ${e.message}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki lo sentirá mucho...* (´；ω；\`)
🎀 *Por favor, intenta con otro enlace*`, 
    m, ctxErr);
  }
};

handler.command = ['pinvideo', 'pindl', 'pinterestdl'];
handler.register = true;
handler.help = ['pinvideo <url>'];
handler.tags = ['premium'];
handler.premium = true;

export default handler;