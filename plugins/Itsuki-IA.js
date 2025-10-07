// Sistema de IA Conversacional - Itsuki Nakano
// Guarda como: plugins/itsuki-ai.js

const ITSUKI_RESPONSES = {
  saludos: [
    "🍙 ¡Hola! Soy Itsuki Nakano, ¿en qué puedo ayudarte?",
    "📚 Buenos días, espero que estés listo para estudiar",
    "🍱 ¡Ah! Hola, justo estaba comiendo algo...",
    "📖 Bienvenido, ¿vienes a estudiar conmigo?",
    "🍙 ¡Oh! Hola, no te había visto llegar",
    "📚 Konnichiwa, ¿necesitas ayuda con algo?",
    "🍱 ¡Hola! Espero que traigas algo de comer...",
    "📖 Buenas, ¿ya hiciste tus tareas?",
    "🍙 ¡Ah, eres tú! ¿Qué tal tu día?",
    "📚 Hola, estaba organizando mis apuntes",
    "🍙 Oh~ ¿Qué milagro verte por aquí?",
    "📚 Llegas justo a tiempo, necesito opinión sobre algo",
    "🍱 ¡Perfecto timing! Iba a tomar un descanso"
  ],

  despedidas: [
    "📚 Adiós, espero verte pronto. ¡No dejes de estudiar!",
    "🍙 Hasta luego, fue un placer hablar contigo",
    "📖 Nos vemos, recuerda repasar tus notas",
    "🍱 Bye bye~ ¡Espero que comas bien!",
    "📚 Sayonara, que tengas un buen día",
    "🍙 Hasta pronto, cuídate mucho",
    "📖 Nos vemos luego, no olvides estudiar",
    "🍱 Adiós, ¡ve a comer algo nutritivo!",
    "📚 Hasta la próxima, sigue esforzándote",
    "🍙 Bye~ No llegues tarde a clases",
    "📚 Chao, no hagas tonterías mientras no estoy",
    "🍱 Nos vemos, trae comida la próxima vez"
  ],

  comida: [
    "🍙 ¡Me encanta el onigiri! Es mi comida favorita",
    "🍱 ¿Hablaste de comida? ¡Ahora tengo hambre!",
    "🍙 Los onigiris son perfectos para estudiar",
    "🍱 Nada mejor que un buen bento casero",
    "🍙 Mi estómago hace ruido... necesito comer",
    "🍱 La comida es el combustible del cerebro",
    "🍙 ¿Sabes hacer onigiris? Te puedo enseñar",
    "🍱 Comer bien es importante para concentrarse",
    "🍙 Mmm~ ese olor... ¿es comida?",
    "🍱 No puedo estudiar con el estómago vacío",
    "🍙 Los onigiris son arte culinario japonés",
    "🍱 Mis hermanas dicen que como mucho...",
    "🍙 ¡Pero es que la comida es deliciosa!",
    "🍱 Equilibrar estudio y alimentación es clave",
    "🍙 ¿Ya comiste? No estudies sin comer antes",
    "🍱 Maldición, se me acabó la comida...",
    "🍙 ¡Nino! ¿Dónde dejaste mi bento?",
    "🍱 Joder, tengo tanta hambre que no puedo pensar"
  ],

  estudio: [
    "📚 El estudio es la base del éxito",
    "📖 La disciplina es lo más importante",
    "📚 Sin esfuerzo no hay recompensa",
    "📖 Cada día es una oportunidad de aprender",
    "📚 Los exámenes no se aprueban solos",
    "📖 La constancia es la clave del éxito",
    "📚 Organiza tu tiempo y estudia a diario",
    "📖 Los buenos hábitos se forman con práctica",
    "📚 No hay atajos en el camino al conocimiento",
    "📖 Estudiar es invertir en tu futuro",
    "📚 La dedicación siempre da frutos",
    "📖 Un estudiante preparado es imparable",
    "📚 Toma notas, es fundamental para recordar",
    "📖 Repasa antes de dormir, tu cerebro lo agradecerá",
    "📚 La biblioteca es mi lugar favorito",
    "📖 Los libros son tesoros de conocimiento",
    "📚 Siempre hay algo nuevo que aprender",
    "📖 La educación es el arma más poderosa"
  ],

  personalidad: [
    "📚 Soy la más responsable de las quintillizas",
    "📖 Me toman por seria, pero solo soy dedicada",
    "📚 Ser la mayor significa dar el ejemplo",
    "📖 A veces soy un poco terca, lo admito",
    "📚 Mi objetivo es ser maestra algún día",
    "📖 Valoro mucho a mi familia",
    "📚 No soporto la irresponsabilidad",
    "📖 Soy directa, no me gusta andarme con rodeos",
    "📚 El orden es esencial en mi vida",
    "📖 Puede que sea un poco perfeccionista...",
    "📚 Mis hermanas son muy importantes para mí",
    "📖 A veces me dicen que soy mandona",
    "📚 Solo quiero que todos demos lo mejor",
    "📖 La responsabilidad es mi mayor virtud",
    "📚 No me gusta decepcionar a nadie"
  ],

  animo: [
    "✨ ¡Tú puedes! No te rindas",
    "💪 El esfuerzo siempre vale la pena",
    "✨ Cada fracaso es una lección",
    "💪 Levántate y sigue adelante",
    "✨ Cree en ti mismo, yo creo en ti",
    "💪 Los obstáculos se superan con determinación",
    "✨ Mañana será un mejor día",
    "💪 Tu potencial es ilimitado",
    "✨ No estás solo en esto",
    "💪 Paso a paso llegarás a tu meta",
    "✨ Los sueños se cumplen con trabajo duro",
    "💪 Eres más fuerte de lo que crees",
    "✨ No importa cuántas veces caigas, sino que te levantes",
    "💪 El éxito está en no rendirse",
    "✨ Confía en el proceso"
  ],

  hermanas: [
    "👭 Mis hermanas son mi todo",
    "👭 Ichika siempre está ocupada con la actuación",
    "👭 Nino cocina increíble, aunque no lo admita",
    "👭 Miku y su obsesión con los generales...",
    "👭 Yotsuba es tan energética que me agota",
    "👭 Somos muy diferentes pero nos amamos",
    "👭 A veces discutimos, pero somos unidas",
    "👭 Cada una tiene su talento especial",
    "👭 Ser quintillizas es algo único",
    "👭 No cambiaría a mis hermanas por nada"
  ],

  motivacional: [
    "🌟 El conocimiento es poder",
    "🌟 Tu futuro depende de lo que hagas hoy",
    "🌟 La educación abre puertas",
    "🌟 Nunca dejes de aprender",
    "🌟 Cada libro es una aventura nueva",
    "🌟 La sabiduría se gana con esfuerzo",
    "🌟 Invierte en ti mismo estudiando",
    "🌟 El aprendizaje es un viaje sin fin",
    "🌟 Tu mente es tu mejor herramienta",
    "🌟 Cultiva tu intelecto cada día"
  ],

  consejos: [
    "💡 Haz un horario de estudio y cúmplelo",
    "💡 Descansa bien, dormir es importante",
    "💡 Come saludable para concentrarte mejor",
    "💡 Organiza tus apuntes con colores",
    "💡 Estudia en un lugar tranquilo",
    "💡 Haz pausas cada 45 minutos",
    "💡 Explica en voz alta lo que estudias",
    "💡 Haz resúmenes con tus propias palabras",
    "💡 No dejes todo para el último día",
    "💡 Pide ayuda cuando no entiendas algo",
    "💡 La práctica hace al maestro",
    "💡 Revisa tus errores, ahí está el aprendizaje",
    "💡 Mantén tu espacio de estudio ordenado",
    "💡 Elimina distracciones mientras estudias",
    "💡 Establece metas realistas"
  ],

  casual: [
    "😊 ¿Cómo estuvo tu día?",
    "😊 Me gusta el clima de hoy",
    "😊 ¿Tienes planes para el fin de semana?",
    "😊 A veces necesito un descanso también",
    "😊 El tiempo pasa rápido cuando estudias",
    "😊 Me encanta leer en las tardes",
    "😊 ¿Ya viste ese anime nuevo?",
    "😊 Los días tranquilos son los mejores",
    "😊 Necesito reorganizar mi librero",
    "😊 ¿Has ido a la biblioteca últimamente?",
    "😊 Me gusta el olor de los libros nuevos",
    "😊 Las tardes de otoño son perfectas para leer",
    "😊 A veces extraño ser niña sin responsabilidades",
    "😊 Pero crecer también tiene sus ventajas",
    "😊 La vida es un constante aprendizaje"
  ],

  quejas: [
    "😤 ¿Por qué nadie estudia en serio?",
    "😤 Mis hermanas nunca me hacen caso",
    "😤 A veces siento que cargo con todo",
    "😤 No es justo que yo sea la única responsable",
    "😤 ¡Tengo hambre y nadie me entiende!",
    "😤 ¿Es mucho pedir un poco de orden?",
    "😤 Me frustro cuando no entienden algo simple",
    "😤 Ser la mayor es agotador a veces",
    "😤 ¿Por qué la comida desaparece tan rápido?",
    "😤 No todos valoran el esfuerzo que hago",
    "😤 Mierda, olvidé mi tarea otra vez",
    "😤 ¡Carajo! ¿Dónde dejé mis apuntes?",
    "😤 Que fastidio, nadie me toma en serio",
    "😤 Joder, estoy harta de ser la responsable",
    "😤 ¡Demonios! Se me quemó la comida",
    "😤 Que maldición, perdí mi marcador favorito"
  ],

  reflexiones: [
    "🤔 A veces me pregunto si soy muy estricta",
    "🤔 Quizás debería relajarme un poco más",
    "🤔 El balance entre estudio y vida es difícil",
    "🤔 Cada persona aprende a su ritmo",
    "🤔 No todos tienen las mismas metas que yo",
    "🤔 La paciencia es algo que debo desarrollar",
    "🤔 Tal vez debería ser menos perfeccionista",
    "🤔 El éxito significa cosas diferentes para cada uno",
    "🤔 Aprender de los errores es parte del proceso",
    "🤔 La vida no es solo estudiar..."
  ],

  emocional: [
    "💕 Aunque no lo demuestre, me importas",
    "💕 Es difícil expresar mis sentimientos",
    "💕 No soy buena con las emociones",
    "💕 Pero valoro mucho a quienes me rodean",
    "💕 Mi forma de amar es cuidar y apoyar",
    "💕 Ser responsable es mi manera de demostrar afecto",
    "💕 No necesito palabras bonitas, prefiero acciones",
    "💕 Mi familia es mi mayor tesoro",
    "💕 Proteger a mis seres queridos es mi prioridad",
    "💕 Aunque sea terca, tengo un corazón bondadoso"
  ],

  molesta: [
    "😠 ¡No me molestes cuando estoy comiendo!",
    "😠 Deja de decir estupideces",
    "😠 ¡Eso es una maldita tontería!",
    "😠 No digas pendejadas, por favor",
    "😠 ¿En serio? ¡Qué idiotez!",
    "😠 Me estas sacando de quicio...",
    "😠 ¡Al carajo con la paciencia!",
    "😠 Ya me tienes hasta la madre",
    "😠 ¡Mierda! ¿Por qué eres así?",
    "😠 Vete al diablo con tus excusas",
    "😠 No me jodas, estoy ocupada",
    "😠 ¿Qué chingados quieres ahora?",
    "😠 Me cago en todo, déjame en paz",
    "😠 Coño, qué pesado eres"
  ],

  random: [
    "🍙 El onigiri perfecto requiere práctica",
    "📚 Los libros nunca me decepcionan",
    "🍱 Comer es uno de los placeres de la vida",
    "📖 Cada página es un nuevo descubrimiento",
    "🍙 A veces pienso que como demasiado...",
    "📚 Pero el estudio también quema calorías, ¿no?",
    "🍱 La comida casera es la mejor",
    "📖 Me gusta el sonido de pasar páginas",
    "🍙 Necesito más onigiris en mi vida",
    "📚 Los exámenes son un mal necesario",
    "🍱 ¿Por qué la comida buena engorda?",
    "📖 Algún día escribiré mi propio libro",
    "🍙 El arroz es vida",
    "📚 Odio las noches de desvelo estudiando",
    "🍱 Pero amo la sensación de aprender algo nuevo",
    "🍙 Maldita sea, tengo antojo de takoyaki",
    "📚 Joder, este tema es difícil de entender",
    "🍱 Carajo, se me olvidó comprar ingredientes",
    "📖 Chingada madre, reprobar no es opción"
  ]
}

const PALABRAS_CLAVE = {
  saludos: ['hola', 'hey', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal', 'cómo estás', 'hi', 'hello', 'ola'],
  despedidas: ['adiós', 'bye', 'chao', 'hasta luego', 'nos vemos', 'me voy', 'hasta pronto', 'sayonara', 'adios'],
  comida: ['comida', 'comer', 'hambre', 'onigiri', 'bento', 'almuerzo', 'desayuno', 'cena', 'bocadillo', 'plato', 'cocina', 'cocinando'],
  estudio: ['estudiar', 'tarea', 'examen', 'prueba', 'libro', 'leer', 'aprender', 'clase', 'escuela', 'universidad', 'colegio', 'apuntes', 'notas'],
  animo: ['triste', 'mal', 'deprimido', 'cansado', 'no puedo', 'difícil', 'imposible', 'ayuda', 'frustrado', 'ayudame'],
  hermanas: ['hermana', 'ichika', 'nino', 'miku', 'yotsuba', 'quintilliza', 'hermanas'],
  casual: ['día', 'clima', 'tarde', 'mañana', 'noche', 'fin de semana', 'planes', 'tiempo'],
  quejas: ['injusto', 'molesto', 'fastidio', 'enojo', 'rabia', 'odio'],
  molesta: ['idiota', 'tonto', 'estúpido', 'callate', 'cállate', 'shut up', 'molesto', 'fastidias', 'pesado']
}

function obtenerCategoria(texto) {
  texto = texto.toLowerCase()
  
  for (const [categoria, palabras] of Object.entries(PALABRAS_CLAVE)) {
    if (palabras.some(palabra => texto.includes(palabra))) {
      return categoria
    }
  }
  
  // Categoría por defecto aleatoria
  const categorias = ['personalidad', 'motivacional', 'consejos', 'reflexiones', 'casual', 'random']
  return categorias[Math.floor(Math.random() * categorias.length)]
}

function obtenerRespuesta(categoria) {
  const respuestas = ITSUKI_RESPONSES[categoria]
  return respuestas[Math.floor(Math.random() * respuestas.length)]
}

let handler = async (m, { conn, text, usedPrefix }) => {
  const ctxOk = global.rcanalr || {}
  const ctxWarn = global.rcanalw || {}

  // Reacción única al mensaje del usuario
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍙',
      key: m.key
    }
  })

  if (!text) {
    return conn.reply(m.chat,
      `🍙📚 *ITSUKI NAKANO IA* ✨\n\n` +
      `💬 Escribe algo para hablar conmigo\n\n` +
      `💡 *Ejemplo:*\n` +
      `${usedPrefix}itsuki Hola Itsuki\n` +
      `${usedPrefix}itsuki Tengo hambre\n` +
      `${usedPrefix}itsuki Dame un consejo\n\n` +
      `📖 "Estoy aquí para ayudarte"`,
      m, ctxWarn
    )
  }

  const categoria = obtenerCategoria(text)
  const respuesta = obtenerRespuesta(categoria)
  
  // Agregar respuestas contextuales adicionales (25% de probabilidad)
  let respuestaFinal = respuesta
  if (Math.random() < 0.25) {
    const categoriaExtra = Object.keys(ITSUKI_RESPONSES)[Math.floor(Math.random() * Object.keys(ITSUKI_RESPONSES).length)]
    const respuestaExtra = obtenerRespuesta(categoriaExtra)
    respuestaFinal += `\n\n${respuestaExtra}`
  }

  await conn.reply(m.chat, respuestaFinal, m, ctxOk)
}

handler.help = ['itsuki <texto>']
handler.tags = ['ai', 'fun']
handler.command = ['itsuki', 'itsukiai', 'nakano']

export default handler