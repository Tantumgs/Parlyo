import { buildWords, type Language, type RawWord } from "./types";

const A1: RawWord[] = [
  ["pain", "хлеб", "Nous achetons du pain frais.", "Мы покупаем свежий хлеб.", "food"],
  ["voyage", "путешествие", "Le voyage était long.", "Путешествие было долгим.", "travel"],
  ["chien", "собака", "Le chien dort ici.", "Собака спит здесь.", "animals"],
  ["rue", "улица", "La rue est calme.", "Улица тихая.", "city"],
  ["soleil", "солнце", "Le soleil se lève tôt.", "Солнце встаёт рано.", "nature"],
  ["travail", "работа", "Mon travail est facile.", "Моя работа лёгкая.", "work"],
  ["content", "довольный", "Je suis content aujourd'hui.", "Я сегодня доволен.", "feelings"],
  ["jouer", "играть", "Nous jouons au football.", "Мы играем в футбол.", "sport"],
];

const A2: RawWord[] = [
  ["recette", "рецепт", "Cette recette est facile.", "Этот рецепт простой.", "food"],
  ["aéroport", "аэропорт", "L'aéroport est loin.", "Аэропорт далеко.", "travel"],
  ["oiseau", "птица", "L'oiseau chante.", "Птица поёт.", "animals"],
  ["quartier", "район", "J'habite dans un quartier tranquille.", "Я живу в тихом районе.", "city"],
  ["montagne", "гора", "La montagne est haute.", "Гора высокая.", "nature"],
  ["réunion", "совещание", "La réunion commence à dix heures.", "Совещание начинается в десять.", "work"],
  ["nerveux", "нервный", "Ne sois pas nerveux.", "Не нервничай.", "feelings"],
  ["équipe", "команда", "Notre équipe a gagné.", "Наша команда выиграла.", "sport"],
];

const B1: RawWord[] = [
  ["ingrédient", "ингредиент", "Chaque ingrédient est frais.", "Каждый ингредиент свежий.", "food"],
  ["destination", "пункт назначения", "Notre destination est Rome.", "Наш пункт назначения — Рим.", "travel"],
  ["abri", "приют, укрытие", "L'animal vit dans un abri.", "Животное живёт в приюте.", "animals"],
  ["avenue", "проспект", "L'avenue est très large.", "Проспект очень широкий.", "city"],
  ["paysage", "пейзаж", "Le paysage est magnifique.", "Пейзаж великолепный.", "nature"],
  ["échéance", "срок", "L'échéance est vendredi.", "Срок — пятница.", "work"],
  ["déçu", "разочарованный", "Je suis déçu par le film.", "Я разочарован фильмом.", "feelings"],
  ["tournoi", "турнир", "Le tournoi commence demain.", "Турнир начинается завтра.", "sport"],
];

const B2: RawWord[] = [
  ["gastronomie", "гастрономия", "La gastronomie locale est célèbre.", "Местная гастрономия знаменита.", "food"],
  ["itinéraire", "маршрут", "L'itinéraire comprend trois villes.", "Маршрут включает три города.", "travel"],
  ["espèce", "вид", "Cette espèce est en danger.", "Этот вид под угрозой.", "animals"],
  ["banlieue", "пригород, окраина", "Nous vivons en banlieue.", "Мы живём в пригороде.", "city"],
  ["sécheresse", "засуха", "La sécheresse a ruiné la récolte.", "Засуха уничтожила урожай.", "nature"],
  ["promotion", "повышение", "Elle a obtenu une promotion.", "Её повысили.", "work"],
  ["anxieux", "тревожный", "Je suis anxieux avant l'examen.", "Я тревожусь перед экзаменом.", "feelings"],
  ["athlète", "спортсмен", "Chaque athlète s'entraîne chaque jour.", "Каждый спортсмен тренируется ежедневно.", "sport"],
];

const C1: RawWord[] = [
  ["épice", "специя, приправа", "Cette épice est très forte.", "Эта приправа очень острая.", "food"],
  ["détour", "объезд", "Nous avons fait un long détour.", "Мы сделали длинный объезд.", "travel"],
  ["migration", "миграция", "La migration commence en automne.", "Миграция начинается осенью.", "animals"],
  ["infrastructure", "инфраструктура", "La ville a investi dans l'infrastructure.", "Город вложился в инфраструктуру.", "city"],
  ["érosion", "эрозия", "L'érosion côtière augmente.", "Прибрежная эрозия растёт.", "nature"],
  ["négociation", "переговоры", "La négociation a duré toute la journée.", "Переговоры длились весь день.", "work"],
  ["submergé", "подавленный, в перегрузе", "Je me sens submergé par le travail.", "Я подавлен объёмом работы.", "feelings"],
  ["endurance", "выносливость", "Courir développe l'endurance.", "Бег развивает выносливость.", "sport"],
];

export const fr: Language = {
  code: "fr",
  name: "Français",
  native: "Французский",
  flag: "🇫🇷",
  speech: "fr-FR",
  words: [
    ...buildWords("fr", "A1", A1),
    ...buildWords("fr", "A2", A2),
    ...buildWords("fr", "B1", B1),
    ...buildWords("fr", "B2", B2),
    ...buildWords("fr", "C1", C1),
  ],
};