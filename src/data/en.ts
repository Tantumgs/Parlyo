import { buildWords, type Language, type RawWord } from "./types";

const A1: RawWord[] = [
  ["breakfast", "завтрак", "I eat breakfast at seven.", "Я завтракаю в семь.", "food"],
  ["ticket", "билет", "This ticket is for the train.", "Этот билет на поезд.", "travel"],
  ["cat", "кошка", "The cat sleeps on the sofa.", "Кошка спит на диване.", "animals"],
  ["street", "улица", "Our street is very quiet.", "Наша улица очень тихая.", "city"],
  ["rain", "дождь", "The rain is heavy today.", "Сегодня сильный дождь.", "nature"],
  ["teacher", "учитель", "She is a maths teacher.", "Она учитель математики.", "work"],
  ["happy", "счастливый", "I am happy today.", "Я сегодня счастлив.", "feelings"],
  ["run", "бегать", "I run in the park.", "Я бегаю в парке.", "sport"],
];

const A2: RawWord[] = [
  ["recipe", "рецепт", "This recipe is easy.", "Этот рецепт простой.", "food"],
  ["luggage", "багаж", "My luggage is very heavy.", "Мой багаж очень тяжёлый.", "travel"],
  ["feather", "перо", "The bird has a white feather.", "У птицы белое перо.", "animals"],
  ["bridge", "мост", "We crossed the old bridge.", "Мы перешли через старый мост.", "city"],
  ["forest", "лес", "We walked through the forest.", "Мы шли через лес.", "nature"],
  ["meeting", "совещание", "The meeting starts at ten.", "Совещание начнётся в десять.", "work"],
  ["nervous", "нервный", "Don't be nervous.", "Не нервничай.", "feelings"],
  ["team", "команда", "Our team won the game.", "Наша команда выиграла матч.", "sport"],
];

const B1: RawWord[] = [
  ["ingredient", "ингредиент", "Every ingredient is fresh.", "Каждый ингредиент свежий.", "food"],
  ["destination", "пункт назначения", "Our destination is Rome.", "Наш пункт назначения — Рим.", "travel"],
  ["wildlife", "животный мир", "The island has rich wildlife.", "На острове богатый животный мир.", "animals"],
  ["neighbourhood", "район", "It is a friendly neighbourhood.", "Это дружелюбный район.", "city"],
  ["landscape", "пейзаж", "The landscape changes slowly.", "Пейзаж меняется медленно.", "nature"],
  ["deadline", "крайний срок", "The deadline is Friday.", "Крайний срок — пятница.", "work"],
  ["disappointed", "разочарованный", "I was disappointed by the film.", "Я был разочарован фильмом.", "feelings"],
  ["tournament", "турнир", "Our school holds a tournament.", "В нашей школе проводят турнир.", "sport"],
];

const B2: RawWord[] = [
  ["delicacy", "деликатес", "Street food is a local delicacy.", "Уличная еда — местный деликатес.", "food"],
  ["itinerary", "маршрут поездки", "The itinerary includes three cities.", "Маршрут включает три города.", "travel"],
  ["creature", "животное, создание", "Deep sea creatures are strange.", "Животные глубокого моря странные.", "animals"],
  ["outskirts", "окраина", "We live on the outskirts.", "Мы живём на окраине.", "city"],
  ["drought", "засуха", "The drought ruined the crops.", "Засуха уничтожила урожай.", "nature"],
  ["promotion", "повышение", "She got a promotion.", "Её повысили.", "work"],
  ["anxious", "тревожный", "He feels anxious before exams.", "Он тревожится перед экзаменами.", "feelings"],
  ["athlete", "спортсмен", "Every athlete trains daily.", "Каждый спортсмен тренируется ежедневно.", "sport"],
];

const C1: RawWord[] = [
  ["savoury", "несладкий, пряный", "I prefer savoury snacks.", "Я предпочитаю несладкие закуски.", "food"],
  ["detour", "объезд", "We took a long detour.", "Мы сделали длинный объезд.", "travel"],
  ["migration", "миграция", "Bird migration starts in autumn.", "Миграция птиц начинается осенью.", "animals"],
  ["infrastructure", "инфраструктура", "The city invested in infrastructure.", "Город вложился в инфраструктуру.", "city"],
  ["erosion", "эрозия", "Coastal erosion is growing.", "Прибрежная эрозия растёт.", "nature"],
  ["negotiation", "переговоры", "The negotiation lasted all day.", "Переговоры длились весь день.", "work"],
  ["overwhelmed", "подавленный, в перегрузе", "I felt overwhelmed by the work.", "Я был подавлен объёмом работы.", "feelings"],
  ["stamina", "выносливость", "Running builds stamina.", "Бег развивает выносливость.", "sport"],
];

export const en: Language = {
  code: "en",
  name: "English",
  native: "Английский",
  flag: "🇬🇧",
  speech: "en-US",
  words: [
    ...buildWords("en", "A1", A1),
    ...buildWords("en", "A2", A2),
    ...buildWords("en", "B1", B1),
    ...buildWords("en", "B2", B2),
    ...buildWords("en", "C1", C1),
  ],
};