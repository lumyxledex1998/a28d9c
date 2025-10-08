var handler = async (m, { conn, args, usedPrefix, command }) => {
  const opciones = {
    'open': 'not_announcement',
    'close': 'announcement',
    'abierto': 'not_announcement',
    'cerrado': 'announcement',
    'abrir': 'not_announcement',
    'cerrar': 'announcement',
    'desbloquear': 'unlocked',
    'bloquear': 'locked'
  }[(args[0] || '').toLowerCase()];

  // Si no se da argumento, muestra los botones
  if (!opciones) {
    const botones = [
      [{ text: '🔓 Abrir grupo', id: `${usedPrefix + command} abrir` }, { text: '🔒 Cerrar grupo', id: `${usedPrefix + command} cerrar` }],
      [{ text: '🚫 Bloquear', id: `${usedPrefix + command} bloquear` }, { text: '✅ Desbloquear', id: `${usedPrefix + command} desbloquear` }]
    ];

    await conn.sendButtonMsg(
      m.chat,
      `⚙️ *Configuración del grupo*\n\nSelecciona una opción para configurar el grupo:`,
      conn.user.name,
      botones,
      m
    );
    return;
  }

  // Ejecutar cambio de configuración
  await conn.groupSettingUpdate(m.chat, opciones);
  await conn.reply(m.chat, '✅ *Configurado correctamente*', m);
  await m.react('✅');
};

handler.help = ['group abrir / cerrar'];
handler.tags = ['grupo'];
handler.command = ['group', 'grupo'];
handler.admin = true;
handler.botAdmin = true;

export default handler;
