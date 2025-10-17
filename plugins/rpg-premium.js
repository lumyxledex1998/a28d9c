const handler = async (m, { conn, text, usedPrefix, command, isOwner, mentionedJid }) => {
    const ctxErr = (global.rcanalx || {})
    const ctxWarn = (global.rcanalw || {})
    const ctxOk = (global.rcanalr || {})

    let user = global.db.data.users[m.sender];
    text = text ? text.toLowerCase().trim() : '';

    const plans = {
        'dia': { duration: 1, cost: 50000, emoji: '🌅' },
        'semana': { duration: 7, cost: 250000, emoji: '📅' },
        'mes': { duration: 30, cost: 750000, emoji: '🗓️' },
        'año': { duration: 365, cost: 5000000, emoji: '🎉' },
        'infinito': { duration: 9999, cost: 999999999, emoji: '♾️' }
    };

    // VERIFICAR SI ES OWNER PARA COMANDOS ESPECIALES
    if (!isOwner) {
        // Si no es owner y usa regalarpremium, denegar acceso
        if (command === 'regalarpremium') {
            return conn.reply(m.chat,
`╭━━━〔 🎀 𝐀𝐂𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 🎀 〕━━━⬣
│ ❌ *Comando exclusivo*
│ 
│ 👑 Este comando solo puede ser usado
│ por el creador del bot
│ 
│ 💡 *Comandos disponibles para ti:*
│ ${usedPrefix}premium <plan>
│ ${usedPrefix}vip <plan>
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr);
        }
        
        // Si no es owner y trata de regalar con premium @usuario
        if (command === 'premium' && text?.includes('@')) {
            return conn.reply(m.chat,
`╭━━━〔 🎀 𝐀𝐂𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 🎀 〕━━━⬣
│ ❌ *Función exclusiva*
│ 
│ 👑 Solo el creador puede regalar premium
│ a otros usuarios
│ 
│ 💡 *Puedes comprar premium para ti:*
│ ${usedPrefix}premium <plan>
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr);
        }
    }

    // OPCIÓN REGALAR (Solo para owner)
    if ((command === 'regalarpremium' || (command === 'premium' && text?.includes('@'))) && isOwner) {
        const mentioned = m.mentionedJid?.[0] || mentionedJid?.[0];

        if (!mentioned) {
            return conn.reply(m.chat,
`╭━━━〔 🎀 𝐑𝐄𝐆𝐀𝐋𝐀𝐑 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ ❌ *Debes mencionar a un usuario*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}regalarpremium @usuario <plan>
│ ${usedPrefix}premium @usuario <plan>
│ 
│ 💡 *Ejemplos:*
│ ${usedPrefix}regalarpremium @usuario mes
│ ${usedPrefix}premium @usuario año
│ 
│ 👑 *Planes disponibles:*
│ ${Object.keys(plans).map(plan => `• ${plan}`).join('\n│ ')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxWarn);
        }

        const planText = text.replace(/@\d+/g, '').trim() || 'mes';
        const selectedPlan = plans[planText] || plans['mes'];

        if (!global.db.data.users[mentioned]) global.db.data.users[mentioned] = {};
        const targetUser = global.db.data.users[mentioned];

        targetUser.premium = true;
        const newPremiumTime = Date.now() + (selectedPlan.duration * 24 * 60 * 60 * 1000);
        targetUser.premiumTime = newPremiumTime;

        // Obtener nombre del usuario
        let targetName = 'Usuario';
        try {
            targetName = await conn.getName(mentioned) || 'Usuario';
        } catch (e) {
            console.log('Error al obtener nombre:', e);
        }

        const remainingTime = newPremiumTime - Date.now();
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

        await conn.reply(m.chat,
`╭━━━〔 🎀 𝐑𝐄𝐆𝐀𝐋𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ 🎁 *¡Premium Regalado!*
│ 
│ 👤 *Para:* ${targetName}
│ 💎 *Plan:* ${planText.charAt(0).toUpperCase() + planText.slice(1)}
│ ⏰ *Duración:* ${selectedPlan.duration} día(s)
│ 💰 *Costo:* ¥0 (Regalo)
│ 
│ ⏳ *Tiempo restante:*
│ ${days} días
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Beneficios Activados:*
• Comandos exclusivos ✅
• Prioridad en respuestas ✅
• Sin límites de uso ✅

🌸 *¡Un regalo especial de Itsuki!* 🎀
🎉 *Que lo disfrute* 💫`,
        m, ctxOk);

        // Notificar al usuario que recibió el regalo
        try {
            await conn.sendMessage(mentioned, { 
                text: `🎁 *¡HAS RECIBIDO UN REGALO!* 🎀

🌸 *Itsuki-Nakano IA te ha regalado:*
💎 *Premium ${planText.charAt(0).toUpperCase() + planText.slice(1)}*
⏰ *Duración:* ${selectedPlan.duration} días
💰 *Totalmente gratis*

🌟 *Ahora tienes acceso a:*
• Comandos exclusivos
• Prioridad en respuestas  
• Funciones especiales
• Sin límites de uso

🎀 *¡Disfruta de tus nuevos beneficios!* 💫`
            });
        } catch (e) {
            console.log('No se pudo notificar al usuario:', e);
        }

        await m.react('🎁');
        return;
    }

    // MODO OWNER - Activación gratuita para sí mismo
    if (isOwner && text && !text.includes('@')) {
        const selectedPlan = plans[text] || plans['mes'];

        user.premium = true;
        const newPremiumTime = Date.now() + (selectedPlan.duration * 24 * 60 * 60 * 1000);
        user.premiumTime = newPremiumTime;

        const remainingTime = newPremiumTime - Date.now();
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        await conn.reply(m.chat, 
`╭━━━〔 🎀 𝐌𝐎𝐃𝐎 𝐂𝐑𝐄𝐀𝐃𝐎𝐑 🎀 〕━━━⬣
│ 👑 *¡Premium Activado Gratis!*
│ 
│ 💎 *Plan:* ${text.charAt(0).toUpperCase() + text.slice(1)}
│ ⏰ *Duración:* ${selectedPlan.duration} día(s)
│ 💰 *Costo:* ¥0 (Gratis)
│ 
│ ⏳ *Tiempo restante:*
│ ${days} días y ${hours} horas
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Beneficios Activados:*
• Comandos exclusivos ✅
• Prioridad máxima ✅
• Sin límites ✅
• Acceso total ✅

🌸 *¡Poder de creador activado!* 👑
🎀 *Disfruta de tus privilegios* 💫`, 
        m, ctxOk);

        await m.react('👑');
        return;
    }

    // MODO NORMAL PARA USUARIOS
    if (!text || !plans[text]) {
        let response = 
`╭━━━〔 🎀 𝐏𝐋𝐀𝐍𝐄𝐒 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ 🌸 *Itsuki-Nakano IA - Sistema Premium*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💎 *Planes Disponibles:*

${Object.entries(plans).map(([plan, data]) => 
    `│ ${data.emoji} *${plan.charAt(0).toUpperCase() + plan.slice(1)}*\n` +
    `│ ⏰ Duración: ${data.duration} día(s)\n` +
    `│ 💰 Costo: ¥${data.cost.toLocaleString()}\n` +
    `│ ────────────────────`
).join('\n')}

📝 *Cómo usar:*
│ ${usedPrefix + command} <plan>
│ 
│ *Ejemplo:*
│ ${usedPrefix + command} semana

👑 *Modo Creador:*
│ ${usedPrefix}premium <plan> (Gratis)
│ ${usedPrefix}premium @usuario <plan> (Regalar)
│ ${usedPrefix}regalarpremium @usuario <plan>

🌸 *Itsuki te ofrece beneficios exclusivos...* (◕‿◕✿)`;

        return conn.reply(m.chat, response, m, ctxWarn);
    }

    const selectedPlan = plans[text];

    if (user.coin < selectedPlan.cost) {
        return conn.reply(m.chat, 
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Fondos insuficientes*
│ 
│ 💰 *Necesitas:* ¥${selectedPlan.cost.toLocaleString()}
│ 💵 *Tienes:* ¥${user.coin.toLocaleString()}
│ 📉 *Faltan:* ¥${(selectedPlan.cost - user.coin).toLocaleString()}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki sugiere que consigas más monedas...* (´･ω･\`)`, 
        m, ctxErr);
    }

    user.coin -= selectedPlan.cost;
    user.premium = true;

    const newPremiumTime = (user.premiumTime > 0 ? user.premiumTime : Date.now()) + (selectedPlan.duration * 24 * 60 * 60 * 1000);
    user.premiumTime = newPremiumTime;

    const remainingTime = newPremiumTime - Date.now();
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    await conn.reply(m.chat, 
`╭━━━〔 🎀 𝐅𝐄𝐋𝐈𝐂𝐈𝐃𝐀𝐃𝐄𝐒 🎀 〕━━━⬣
│ ✅ *¡Plan Premium Adquirido!*
│ 
│ 💎 *Plan:* ${text.charAt(0).toUpperCase() + text.slice(1)}
│ ⏰ *Duración:* ${selectedPlan.duration} día(s)
│ 💰 *Costo:* ¥${selectedPlan.cost.toLocaleString()}
│ 
│ ⏳ *Tiempo restante:*
│ ${days} días y ${hours} horas
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Beneficios Premium:*
• Acceso a comandos exclusivos
• Prioridad en respuestas
• Funciones especiales desbloqueadas
• Sin límites de uso

🌸 *¡Itsuki te da la bienvenida al club premium!* (◕‿◕✿)
🎀 *Disfruta de tus nuevos beneficios* 💫`, 
    m, ctxOk);

    await m.react('💎');
};

handler.help = ['comprarprm', 'regalarprm'];
handler.tags = ['premium'];
handler.command = ['comprarprm', 'premium', 'vip', 'comprarvip', 'regalarpremium'];
handler.register = true;

export default handler;