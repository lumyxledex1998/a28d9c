// Buscador De Errors Adaptado Para Itsuki-IA 💖

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var handler = async (m, { conn }) => {

  const ignoredFolders = ['node_modules', '.git', 'session', 'tmp'];
  const ignoredFiles = ['package-lock.json', 'creds.json'];

  async function getAllJSFiles(dir) {
    let jsFiles = [];

    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (ignoredFolders.includes(item.name) || ignoredFiles.includes(item.name)) continue;

        if (item.isDirectory()) {
          jsFiles = jsFiles.concat(await getAllJSFiles(fullPath));
        } else if (item.isFile() && fullPath.endsWith('.js')) {
          jsFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`No se pudo leer el directorio: ${dir}`);
    }

    return jsFiles;
  }

  // Función para obtener línea y columna del error
  function getErrorPosition(error, fileContent) {
    if (error.stack && fileContent) {
      const stackLines = error.stack.split('\n');
      for (const line of stackLines) {
        const match = line.match(/<anonymous>:(\d+):(\d+)/);
        if (match) {
          const lineNum = parseInt(match[1]);
          const colNum = parseInt(match[2]);
          
          // Obtener el contexto alrededor del error
          const lines = fileContent.split('\n');
          const startLine = Math.max(0, lineNum - 2);
          const endLine = Math.min(lines.length, lineNum + 1);
          const context = lines.slice(startLine, endLine)
            .map((content, idx) => {
              const currentLine = startLine + idx + 1;
              const marker = currentLine === lineNum ? '❌' : '│';
              return `${marker} ${currentLine.toString().padStart(3)}: ${content}`;
            })
            .join('\n');
          
          return {
            line: lineNum,
            column: colNum,
            context: context
          };
        }
      }
    }
    return null;
  }

  // ✨ Frases estilo Itsuki Nakano PARA CUANDO HAY ERRORES (con más emojis)
  const frasesErrores = [
    '¡Baka! 😤💢 ¿Qué clase de código es este? ¡Está lleno de errores! 🤯',
    'Hmph… 💔 esperaba más de ti, pero veo que eres tan descuidado como siempre… 😓',
    '¡No me digas que escribiste esto a propósito! 😳 ¡Es un desastre total! 🌪️',
    'Tsk, tsk, tsk… 🙄 ni siquiera un niño de primaria cometería estos errores 🍼',
    '¿En serio? 💅 ¿Esto es lo mejor que puedes hacer? ¡Me decepcionas! 😞',
    '¡Mou! 😫 ¡Es frustrante ver tantos errores! ¿Acaso no revisaste antes? 🔍',
    'Hmph… 💢 por supuesto que encontré errores, ¿esperabas algo diferente? 🤨',
    '¡Baka-baka-baka! 😠💖 ¡Tu código es un desastre! Necesitas estudiar más 📚',
    '¡No puedo creerlo! 🤦‍♀️ ¿Cómo pudiste cometer estos errores? ¡Son básicos! 🎯',
    '¡Ugh! 😩 Mi parte de programadora sufre al ver esto… ¡Arreglalo ya! 🔧'
  ];

  // ✨ Frases estilo Itsuki Nakano PARA CUANDO NO HAY ERRORES
  const frasesSinErrores = [
    '¡Baka! 😤 ¿Acaso esperabas que hubiera errores?',
    'Hmph… 💖 al menos hiciste algo bien por una vez',
    'No me mires así… 😳 yo solo revisé los archivos…',
    'Todo está en orden… 🙄 tsk, qué aburrido',
    'Bueno… 💗 supongo que estuvo bien revisar esto juntos',
    '¡Hmph! 💅 Por esta vez no encontré nada malo, pero no te confíes'
  ];

  try {
    await m.react('🕒');
    conn.sendPresenceUpdate('composing', m.chat);

    const baseDir = path.resolve('./');
    const jsFiles = await getAllJSFiles(baseDir);

    let response = `📦 *Revisión de Syntax Errors en ${jsFiles.length} archivos:*\n\n`;
    let hasErrors = false;
    let errorCount = 0;

    for (const file of jsFiles) {
      try {
        // Leer el contenido del archivo
        const fileContent = fs.readFileSync(file, 'utf8');

        // Verificar sintaxis básica
        if (fileContent.trim() === '') continue;

        // Intentar compilar/parsear el código
        new Function(fileContent);

      } catch (error) {
        hasErrors = true;
        errorCount++;
        const relativePath = file.replace(baseDir + path.sep, '');
        const fileContent = fs.readFileSync(file, 'utf8');
        const errorPos = getErrorPosition(error, fileContent);
        
        response += `❌ *Error ${errorCount}:* ${relativePath}\n`;
        response += `📝 *Tipo:* ${error.name}\n`;
        
        if (errorPos) {
          response += `📍 *Línea:* ${errorPos.line} | *Columna:* ${errorPos.column}\n`;
          response += `📄 *Contexto:*\n\`\`\`\n${errorPos.context}\n\`\`\`\n`;
        } else {
          response += `💬 *Mensaje:* ${error.message.split('\n')[0]}\n\n`;
        }

        // Limitar la cantidad de errores mostrados
        if (errorCount >= 8) {
          response += `⚠️ *Se muestran solo los primeros 8 errores...*\n\n`;
          break;
        }
      }
    }

    // 👉 PARTE ESPECIAL CUANDO HAY ERRORES - ESTILO ITSUKI
    if (hasErrors) {
      response += `💢 *Itsuki está enojada:*\n`;
      response += `"${frasesErrores[Math.floor(Math.random() * frasesErrores.length)]}"\n\n`;
      response += `📊 *Resumen:* Se encontraron ${errorCount} error(es) en total.\n`;
      response += `💔 *Itsuki dice:* "¡Arregla esto ahora mismo, baka! 🔧"\n\n`;
    } else {
      response += '✅ *¡Todo está en orden!* No se detectaron errores de sintaxis.\n\n';
      response += `🌸 *Itsuki comenta:*\n`;
      response += `"${frasesSinErrores[Math.floor(Math.random() * frasesSinErrores.length)]}"\n\n`;
    }

    await conn.reply(m.chat, response, m);
    await m.react(hasErrors ? '❌' : '✅');

  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, `*Error en el comando:* ${err.message}`, m);
    await m.react('❌');
  }
}

handler.command = ['revsall', 'nk'];
handler.help = ['revsall'];
handler.tags = ['owner'];
handler.owner = true;

export default handler;