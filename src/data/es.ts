import { buildWords, type Language, type RawWord } from "./types";

const A1: RawWord[] = [
  ["pan", "хлеб", "Compramos pan fresco.", "Мы покупаем свежий хлеб.", "food"],
  ["viaje", "путешествие", "El viaje fue largo.", "Путешествие было долгим.", "travel"],
  ["perro", "собака", "El perro duerme aquí.", "Собака спит здесь.", "animals"],
  ["calle", "улица", "La calle es estrecha.", "Улица узкая.", "city"],
  ["sol", "солнце", "El sol sale temprano.", "Солнце встаёт рано.", "nature"],
  ["trabajo", "работа", "Mi trabajo es fácil.", "Моя работа лёгкая.", "work"],
  ["contento", "довольный", "Estoy contento hoy.", "Я сегодня доволен.", "feelings"],
  ["jugar", "играть", "Jugamos al fútbol.", "Мы играем в футбол.", "sport"],
];

const A2: RawWord[] = [
  ["receta", "рецепт", "Esta receta es fácil.", "Этот рецепт простой.", "food"],
  ["aeropuerto", "аэропорт", "El aeropuerto está lejos.", "Аэропорт далеко.", "travel"],
  ["pájaro", "птица", "El pájaro canta.", "Птица поёт.", "animals"],
  ["barrio", "район", "Vivo en un barrio tranquilo.", "Я живу в тихом районе.", "city"],
  ["montaña", "гора", "La montaña es alta.", "Гора высокая.", "nature"],
  ["reunión", "совещание", "La reunión empieza a las diez.", "Совещание начинается в десять.", "work"],
  ["nervioso", "нервный", "No estés nervioso.", "Не нервничай.", "feelings"],
  ["equipo", "команда", "Nuestro equipo ganó.", "Наша команда выиграла.", "sport"],
];

const B1: RawWord[] = [
  ["ingrediente", "ингредиент", "Cada ingrediente es fresco.", "Каждый ингредиент свежий.", "food"],
  ["destino", "пункт назначения", "Nuestro destino es Roma.", "Наш пункт назначения — Рим.", "travel"],
  ["refugio", "приют", "El animal vive en un refugio.", "Животное живёт в приюте.", "animals"],
  ["avenida", "проспект", "La avenida es muy ancha.", "Проспект очень широкий.", "city"],
  ["paisaje", "пейзаж", "El paisaje es impresionante.", "Пейзаж потрясающий.", "nature"],
  ["plazo", "срок", "El plazo es el viernes.", "Срок — пятница.", "work"],
  ["decepcionado", "разочарованный", "Estoy decepcionado con la película.", "Я разочарован фильмом.", "feelings"],
  ["torneo", "турнир", "El torneo empieza mañana.", "Турнир начинается завтра.", "sport"],
];

const B2: RawWord[] = [
  ["manjar", "деликатес", "La paella es un manjar local.", "Паэлла — местный деликатес.", "food"],
  ["itinerario", "маршрут", "El itinerario incluye tres ciudades.", "Маршрут включает три города.", "travel"],
  ["especie", "вид", "Esta especie está en peligro.", "Этот вид находится под угрозой.", "animals"],
  ["suburbio", "окраина", "Vivimos en el suburbio.", "Мы живём на окраине.", "city"],
  ["sequía", "засуха", "La sequía arruinó la cosecha.", "Засуха уничтожила урожай.", "nature"],
  ["ascenso", "повышение", "Ella recibió un ascenso.", "Её повысили.", "work"],
  ["ansioso", "тревожный", "Me siento ansioso antes del examen.", "Я тревожусь перед экзаменом.", "feelings"],
  ["atleta", "спортсмен", "Cada atleta entrena a diario.", "Каждый спортсмен тренируется ежедневно.", "sport"],
];

const C1: RawWord[] = [
  ["sazón", "приправа, специя", "A la sopa le falta sazón.", "Супу не хватает приправы.", "food"],
  ["desvío", "объезд", "Hicimos un largo desvío.", "Мы сделали длинный объезд.", "travel"],
  ["migración", "миграция", "La migración empieza en otoño.", "Миграция начинается осенью.", "animals"],
  ["infraestructura", "инфраструктура", "La ciudad invirtió en infraestructura.", "Город вложился в инфраструктуру.", "city"],
  ["erosión", "эрозия", "La erosión costera crece.", "Прибрежная эрозия растёт.", "nature"],
  ["negociación", "переговоры", "La negociación duró todo el día.", "Переговоры длились весь день.", "work"],
  ["abrumado", "подавленный, в перегрузе", "Me siento abrumado con el trabajo.", "Я подавлен объёмом работы.", "feelings"],
  ["resistencia", "выносливость", "Correr mejora la resistencia.", "Бег улучшает выносливость.", "sport"],
];

export const es: Language = {
  code: "es",
  name: "Español",
  native: "Испанский",
  flag: "🇪🇸",
  speech: "es-ES",
  words: [
    ...buildWords("es", "A1", A1),
    ...buildWords("es", "A2", A2),
    ...buildWords("es", "B1", B1),
    ...buildWords("es", "B2", B2),
    ...buildWords("es", "C1", C1),
  ],
};