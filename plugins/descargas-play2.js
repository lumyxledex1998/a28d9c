import yts from 'yt-search';
import fetch from 'node-fetch';

// Múltiples APIs como respaldo
const APIs = [
  {
    name: 'Sylphy',
    url: (url) => `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-fbb9`
  },
  {
    name: 'FG', 
    url: (url) => `https://api.fgmods.xyz/api/downloader/ytmp4?url=${encodeURIComponent(url)}&apikey=fg-dylux`
  },
  {
    name: 'Dylux',
    url: (url) => `https://api.dylux.xyz/downloader/ytmp4?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Aem',
    url: (url) => `https://aemt.me/download/ytmp4?url=${encodeURIComponent(url)}`
  }
];

async function downloadVideo(url) {
  let lastError = null;
  
  // Probar cada API hasta que una funcione
  for (const api of APIs) {
    try {
      console.log(`Probando API: ${api.name}`);
      const apiUrl = api.url(url);
      const res = await fetch(apiUrl, { timeout: 10000 });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      // Diferentes formatos de respuesta de APIs
      let videoUrl, title;
      
      if (api.name === 'Sylphy') {
        if (data.status && data.result?.url) {
          videoUrl = data.result.url;
          title = data.result.title;
        }
      } else if (api.name === 'FG') {
        if (data.result?.video) {
          videoUrl = data.result.video;
          title = data.result.title;
        }
      } else if (api.name === 'Dylux') {
        if (data.videoUrl) {
          videoUrl = data.videoUrl;
          title = data.title;
        }
      } else if (api.name === 'Aem') {
        if (data.result) {
          videoUrl = data.result;
          title = data.meta?.title;
        }
      }
      
      if (videoUrl) {
        console.log(`✅ API ${api.name} funcionó`);
        return { 
          url: videoUrl, 
          title: title || 'Video sin título',
          api: api.name 
        };
      }
      
    } catch (error) {
      console.log(`❌ API ${api.name} falló:`, error.message);
      lastError = error;
      continue; // Intentar con la siguiente API
    }
  }
  
  throw new Error(`Todas las APIs fallaron. Último error: ${lastError?.message}`);
}

let handler = async (m, { conn, text, usedPrefix }) => {
  const ctxErr = (global.rcanalx || {});
  const ctxWarn = (global.rcanalw || {});
  const ctxOk = (global.rcanalr || {});

  if (!text) {
    return conn.reply(m.chat, `
📹 **Descargar Video de YouTube**

📝 **Uso:**
• ${usedPrefix}play2 <nombre del video>

💡 **Ejemplos:**
• ${usedPrefix}play2 spy x family opening
• ${usedPrefix}play2 bad bunny

🎯 **Características:**
✅ Videos en alta calidad
✅ Búsqueda automática
✅ Múltiples APIs de respaldo
    `.trim(), m, ctxWarn);
  }

  try {
    await conn.reply(m.chat, '🔍 Buscando tu video en YouTube...', m, ctxOk);

    // Buscar en YouTube
    const searchResults = await yts(text);
    if (!searchResults.videos.length) {
      throw new Error('No se encontraron videos con ese nombre');
    }

    const video = searchResults.videos[0];
    await conn.reply(m.chat, `📥 Descargando: ${video.title}`, m, ctxOk);

    // Descargar video
    const { url: videoUrl, title, api } = await downloadVideo(video.url);

    const caption = `
🎬 **Video Descargado**

📝 **Título:** ${title}
⏱ **Duración:** ${video.timestamp}
👤 **Canal:** ${video.author.name}
📊 **Vistas:** ${video.views}
📅 **Subido:** ${video.ago}
🔗 **URL:** ${video.url}
⚡ **API:** ${api}

✅ ¡Descarga completada!
`.trim();

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`.replace(/[<>:"/\\|?*]/g, ''),
      caption
    }, { quoted: m });

  } catch (e) {
    console.error('Error en play2:', e);
    
    let errorMessage = '❌ Error al descargar el video\n\n';
    
    if (e.message.includes('No se encontraron videos')) {
      errorMessage += 'No se encontraron resultados para tu búsqueda.';
    } else if (e.message.includes('Todas las APIs fallaron')) {
      errorMessage += 'Los servidores de descarga están ocupados.\nIntenta de nuevo en unos minutos.';
    } else {
      errorMessage += e.message;
    }
    
    errorMessage += '\n\n💡 **Sugerencias:**\n';
    errorMessage += '• Verifica tu conexión a internet\n';
    errorMessage += '• Intenta con otro nombre de video\n';
    errorMessage += '• Espera unos minutos y vuelve a intentar';
    
    await conn.reply(m.chat, errorMessage, m, ctxErr);
  }
};

handler.help = ['play2 <nombre>'];
handler.tags = ['descargas'];
handler.command = ['play2', 'video', 'ytvideo'];

export default handler;