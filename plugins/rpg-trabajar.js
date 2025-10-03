let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, participants }) => {
  const ctxErr = (global.rcanalx || {})
  const ctxWarn = (global.rcanalw || {})
  const ctxOk = (global.rcanalr || {})

  // Verificar si la economía está activada en el grupo
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`╭━━━「 🍙 ${ctxErr.itsuno || 'ITSUNO'} - ECONOMÍA 」━━━⬣
┃ ${ctxErr.status || '✦ Estado'}: ${ctxErr.x || '❌'} *${ctxErr.desactivada || 'DESACTIVADA'}*
┃ ${ctxErr.grupo || '✦ Grupo'}: ${m.chat.split('@')[0]}
┃ ${ctxErr.comando || '✦ Comando'}: ${command}
╰━━━━━━━━━━━━━━⬣

${ctxErr.x || '❌'} ${ctxErr.economy_disabled || 'Los comandos de economía están desactivados en este grupo.'}

${ctxErr.admin || '👑 *Administrador*'}: ${ctxErr.use_command || 'Usa el comando'}:
» ${usedPrefix}economy on

${ctxErr.message || '📚 "No puedo ayudarte con la economía si está desactivada..."'}`)
  }

  let user = global.db.data.users[m.sender]
  const cooldown = 2 * 60 * 1000 // 2 minutos de cooldown

  // Inicializar lastwork si no existe
  user.lastwork = user.lastwork || 0

  // Verificar cooldown
  if (Date.now() - user.lastwork < cooldown) {
    const tiempoRestante = formatTime(user.lastwork + cooldown - Date.now())
    return m.reply(`╭━━━「 ⏰ ${ctxWarn.itsuki || 'ITSUKI'} ${ctxWarn.cooldown || 'COOLDOWN'} 」━━━⬣
┃ ${ctxWarn.status || '✦ Estado'}: ${ctxWarn.warning || '⚠️'} *${ctxWarn.en_enfriamiento || 'EN ENFRIAMIENTO'}*
┃ ${ctxWarn.usuario || '✦ Usuario'}: @${m.sender.split('@')[0]}
┃ ${ctxWarn.tiempo_restante || '✦ Tiempo restante'}: *${tiempoRestante}*
┃ ${ctxWarn.comando_alternativo || '✦ Comando alternativo'}: *${usedPrefix}cooldown*
╰━━━━━━━━━━━━━━⬣

${ctxWarn.message || '📚 "Un buen trabajo requiere descanso adecuado..."'}`)
  }

  // Actualizar último trabajo
  user.lastwork = Date.now()

  // Generar ganancia aleatoria con bonus por suerte
  let baseGanancia = Math.floor(Math.random() * 1501) + 2000
  let bonus = Math.random() < 0.2 ? Math.floor(baseGanancia * 0.3) : 0 // 20% de probabilidad de bonus
  let gananciaTotal = baseGanancia + bonus

  let mensajeTrabajo = pickRandom(trabajoItsuki)
  let emojiTrabajo = pickRandom(['🍙', '🍛', '📚', '✏️', '🎒', '🍱'])
  let emojiExtra = bonus > 0 ? '🎊' : '📖'

  // Añadir dinero al usuario
  user.coin += gananciaTotal

  // Mensaje con formato recnal mejorado
  await m.reply(`╭━━━「 🍙 ${ctxOk.itsuki_work || 'ITSUKI WORK'} 」━━━⬣
┃ ${ctxOk.usuario || '✦ Usuario'}: @${m.sender.split('@')[0]}
┃ ${ctxOk.trabajo || '✦ Trabajo'}: ${emojiTrabajo} ${mensajeTrabajo}
┃ ${ctxOk.ganancia_base || '✦ Ganancia base'}: ${ctxOk.yen || '¥'}${baseGanancia.toLocaleString()}
${bonus > 0 ? `┃ ${ctxOk.bonus_suerte || '✦ Bonus suerte'}: ${ctxOk.bonus_emoji || '🎉'} +${ctxOk.yen || '¥'}${bonus.toLocaleString()}\n` : ''}┃ ${ctxOk.ganancia_total || '✦ Ganancia total'}: ${ctxOk.dinero_emoji || '💰'} ${ctxOk.yen || '¥'}${gananciaTotal.toLocaleString()}
┃ ${ctxOk.dinero_total || '✦ Dinero total'}: ${ctxOk.banco_emoji || '🏦'} ${ctxOk.yen || '¥'}${user.coin.toLocaleString()}
╰━━━━━━━━━━━━━━⬣

${emojiExtra} ${bonus > 0 ? 
  `${ctxOk.bonus_message || '¡Bonus de suerte obtenido!'} ${ctxOk.celebration_emoji || '🎊'}` : 
  `${ctxOk.trabajo_completado || '¡Trabajo completado!'}`
}
${ctxOk.final_message || '📚 "El conocimiento y el esfuerzo siempre son recompensados"}'}`)
}

handler.help = ['trabajar']
handler.tags = ['economy']
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar']
handler.group = true

export default handler

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

// Trabajos temáticos de Itsuki Nakano
const trabajoItsuki = [
  "Estudié diligentemente para mis exámenes y gané",
  "Ayudé en la librería familiar y recibí",
  "Escribí un ensayo académico excelente y me pagaron",
  "Organicé mis apuntes de estudio y encontré",
  "Di clases particulares a estudiantes más jóvenes y gané",
  "Participé en un concurso académico y gané",
  "Vendí algunos de mis libros de texto viejos y obtuve",
  "Ayudé a Miku con sus estudios y me dio",
  "Trabajé como asistente en biblioteca y gané",
  "Escribí reseñas de libros y recibí",
  "Participé en un grupo de estudio y gané",
  "Encontré una solución eficiente para un problema difícil y me premiaron con",
  "Ayudé a Nino con la contabilidad del restaurante y gané",
  "Organicé un evento literario y recibí",
  "Estudié en el café y recibí propinas por ayudar a otros clientes, ganando",
  "Desarrollé un nuevo método de estudio y vendí los derechos por",
  "Gané una beca de estudio por mi excelente desempeño académico, recibiendo",
  "Ayudé a Ichika a memorizar sus guiones y me pagó",
  "Participé en una maratón de estudio y gané",
  "Enseñé técnicas de estudio eficientes y recibí",
  "Completé todos mis deberes con excelencia y mi padre me premió con",
  "Gané un debate académico y recibí",
  "Ayudé a Yotsuba con sus tareas escolares y me dio",
  "Descubrí una edición rara de un libro y la vendí por",
  "Escribí un best-seller académico y recibí regalías por",
  "Participé en una investigación universitaria y me pagaron",
  "Organicé mi colección de libros y encontré dinero olvidado, sumando",
  "Gané una competencia de ortografía y recibí",
  "Ayudé a digitalizar archivos de la biblioteca y gané",
  "Enseñé japonés tradicional a extranjeros y recibí"
]