import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply("❌ Ingresa un enlace de Facebook válido.");
  }

  try {
    const apiUrl = `https://mayapi.ooguy.com/facebook?url=${encodeURIComponent(args[0])}&apikey=may-f53d1d49`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.result?.url) {
      return m.reply(
        `🎀 *Itsuki-Nakano IA*\n\n❌ *Error en la descarga*\n\n✦ *Detalles:* Error en la API\n\n✦ *Posibles soluciones:*\n• Verifica que el enlace sea correcto\n• El video podría ser privado\n• Intenta con otro enlace\n\n🌸 *Itsuki lo intentará de nuevo...* (´；ω；`)\n\n🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n╰ Creado por: LeoXzzsy`
      );
    }

    const videoUrl = data.result.url;
    const filePath = path.join(__dirname, "fbvideo.mp4");

    const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, response.data);

    await conn.sendMessage(m.chat, {
      video: { url: filePath },
      caption: `🎀 *Itsuki-Nakano IA*\n\n✅ *¡Descarga completada!*\n\n📹 *Título:* ${data.result.title || "Sin título"}\n📦 *Calidad:* Automática\n🔗 *Fuente:* Facebook\n\n🌸 *¡Disfruta del video!* (´｡• ᵕ •｡`) ♡`,
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    return m.reply(
      `🎀 *Itsuki-Nakano IA*\n\n❌ *Error en la descarga*\n\n✦ *Detalles:* ${err.message}\n\n✦ *Posibles soluciones:*\n• Revisa tu conexión\n• Intenta de nuevo más tarde\n\n🌸 *Itsuki seguirá intentándolo...* (っ˘̩╭╮˘̩)っ`
    );
  }
};

handler.help = ["fb <url>"];
handler.tags = ["downloader"];
handler.command = /^fb$/i;

export default handler;
