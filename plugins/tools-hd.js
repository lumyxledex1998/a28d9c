import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn, usedPrefix, command }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  let user = global.db.data.users[m.sender];
  
  // Verificar si el usuario es premium
  if (!user.premium || user.premiumTime < Date.now()) {
    return conn.reply(m.chat, 
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Acceso Premium Requerido*
│ 
│ 💎 Este comando es exclusivo para
│ usuarios premium
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Obtén premium con:*
│ ${usedPrefix}premium <plan>
│ 
│ *Planes disponibles:*
│ • día - ¥50,000
│ • semana - ¥250,000  
│ • mes - ¥750,000

🌸 *Itsuki te espera en el club premium...* (◕‿◕✿)`, 
    m, ctxErr);
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  // Validación de archivo
  if (!mime || !/image\/(png|jpe?g)/.test(mime)) {
    return conn.reply(m.chat, 
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Formato no válido*
│ 
│ 📸 Solo imágenes PNG o JPG
│ Responde a una imagen para mejorarla
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki necesita una imagen válida...* (´･ω･\`)`, 
    m, ctxErr);
  }

  await m.react("⏳"); // Espera inicial

  try {
    // Mensaje de procesamiento
    await conn.reply(m.chat, 
`╭━━━〔 🎀 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎 🎀 〕━━━⬣
│ ✨ *Mejorando imagen...*
│ 
│ 🖼️ Descargando imagen
│ ⚡ Preparando upscale
│ 💎 Procesando en HD
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki está trabajando en tu imagen...* 📸`, 
    m, ctxWarn);

    // Descarga de la imagen
    let media = await q.download();

    if (!media) throw new Error("No se pudo descargar la imagen.");

    // Subida a Catbox
    let link = await catbox(media);

    if (!link || !link.startsWith("http")) {
      throw new Error("Error al subir la imagen a Catbox.");
    }

    // Procesando con API upscale
    let upscaleApi = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(link)}&scale=2`;
    let res = await fetch(upscaleApi);
    let data = await res.json();

    if (!data.status || !data.result) {
      throw new Error(data.message || "La API de upscale no devolvió un resultado válido.");
    }

    // Envío de imagen mejorada
    await conn.sendMessage(m.chat, {
      image: { url: data.result },
      caption: 
`╭━━━〔 🎀 𝐈𝐌𝐀𝐆𝐄𝐍 𝐇𝐃 🎀 〕━━━⬣
│ ✅ *Mejora completada*
│ 
│ 📊 *Resolución mejorada*
│ 🎨 *Calidad aumentada*
│ 💎 *Exclusivo Premium*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🔗 *Enlace HD:* ${data.result}

🌸 *¡Imagen mejorada con éxito!* (◕‿◕✿)
🎀 *Gracias por usar tu beneficio premium* 💫`
    }, { quoted: m });

    await m.react("✅"); // Reacción de éxito

  } catch (e) {
    console.error(e);
    await m.react("❌");
    
    await conn.reply(m.chat, 
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Error en el proceso*
│ 
│ 📝 Detalles:
│ ${e.message}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)`, 
    m, ctxErr);
  }
};

handler.help = ['hd', 'upscale'];
handler.tags = ['premium'];
handler.command = ['hd', 'upscale', 'mejorarimagen', 'imagenhd']; 
handler.register = true;
handler.limit = true;
handler.premium = true;

export default handler;

// ─── Funciones auxiliares ───
async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}