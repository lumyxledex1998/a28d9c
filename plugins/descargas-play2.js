import yts from 'yt-search';
import fetch from 'node-fetch';

async function apiAdonix(url) {
  const apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  if (!data.status || !data.result?.url) throw new Error('API Adonix no devolvió datos válidos');
  return { url: data.result.url, title: data.result.title || 'Video sin título' };
}

async function apiFallback(url) {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  if (!videoId) throw new Error('ID de video no encontrado');

  const init = await (await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Date.now()}`)).json();
  const convert = await (await fetch(`${init.convertURL}&v=${videoId}&f=mp4&_=${Date.now()}`)).json();

  let info;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(convert.progressURL);
    info = await res.json();
    if (info.progress === 3) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!info || !convert.downloadURL) throw new Error('API fallback no devolvió datos');
  return { url: convert.downloadURL, title: info.title || 'Video sin título' };
}

async function ytdl(url) {
  try {
    return await apiAdonix(url);
  } catch {
    return await apiFallback(url);
  }
}

let handler = async (m, { conn, text, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {});
  const ctxWarn = (global.rcanalw || {});
  const ctxOk = (global.rcanalr || {});

  if (!text) {
    return conn.reply(m.chat, `
🌸📹 Itsuki Nakano - Descargar Video

📝 Uso:
• ${usedPrefix}play2 <nombre de la canción>

💡 Ejemplo:
• ${usedPrefix}play2 spy x family opening

🎯 Formato:
🎥 Video MP4 de alta calidad

🍱 ¡Disfruta tus videos con Itsuki Nakano! 🌸
    `.trim(), m, ctxWarn);
  }

  try {
    await conn.reply(m.chat, '🌸🎬 Itsuki está buscando tu video...', m, ctxOk);

    const searchResults = await yts(text);
    if (!searchResults.videos.length) throw new Error('No se encontraron resultados');

    const video = searchResults.videos[0];
    const { url, title } = await ytdl(video.url);

    const caption = `
🌸✨ ¡Itsuki Nakano trae tu video! ✨🌸
💖 Título: *${title}*
⏱ Duración: ${video.timestamp}
👤 Autor: ${video.author.name}
🔗 URL: ${video.url}

🌷 ¡Disfruta y no olvides sonreír! 🌷
🍱 Gracias por elegirme para tus descargas 💕
╰─☆ Itsuki Nakano te lo entrega con cariño ☆─╯
`.trim();

    const buffer = await fetch(url).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption
    }, { quoted: m });

    await conn.reply(m.chat, `🌸✅ ¡Video descargado con éxito! Disfrútalo 🌸`, m, ctxOk);

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, `❌ Error: ${e.message}`, m, ctxErr);
  }
};

handler.help = ['play2 <nombre>'];
handler.tags = ['descargas'];
handler.command = ['play2'];

export default handler;