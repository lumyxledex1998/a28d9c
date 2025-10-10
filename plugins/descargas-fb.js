      `📹 *Título:* ${videoTitle}\n` +
      `📦 *Calidad:* ${videoQuality}\n` +
      `🔗 *Fuente:* Facebook\n\n` +
      `🌸 *Itsuki está enviando el video...* (´｡• ᵕ •｡\`) ♡`,
    m, ctxOk)

    // Enviar el video como VIDEO (no como archivo)
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
              `╰ Creado por: LeoXzzsy\n\n` +
              `📹 ${videoTitle}\n` +
              `⭐ Calidad: ${videoQuality}`,
      mentions: [m.sender]
    }, { quoted: m })

    await m.react('✅')

  } catch (error) {
    console.error('Error en descarga Facebook:', error)

    // Eliminar mensaje de espera si existe
    if (waitingMsg) {
      try {
        await conn.sendMessage(m.chat, { delete: waitingMsg.key })
      } catch (e) {}
    }

    // Mensaje de error estilo Itsuki
    await conn.reply(m.chat,
      `🎀 *Itsuki-Nakano IA*\n\n` +
      `❌ *Error en la descarga*\n\n` +
      `✦ *Detalles:* ${error.message}\n\n` +
      `✦ *Posibles soluciones:*\n` +
      `• Verifica que el enlace sea correcto\n` +
      `• El video podría ser privado\n` +
      `• Intenta con otro enlace\n\n` +
      `🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)\n\n` +
      `🎀 *Itsuki-Nakano IA v3.4.0 Beta*\n` +
      `╰ Creado por: LeoXzzsy`,
    m, ctxErr)

    await m.react('❌')
  }
}

handler.help = ['fb <url>', 'facebook <url>']
handler.tags = ['descargas']
handler.command = ['fb', 'facebook', 'fbd', 'fbdl']
handler.register = true

export default handler
