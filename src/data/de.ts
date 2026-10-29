import { buildWords, type Language, type RawWord } from "./types";

const A1: RawWord[] = [
  ["Brot", "хлеб", "Wir kaufen frisches Brot.", "Мы покупаем свежий хлеб.", "food"],
  ["Reise", "путешествие", "Die Reise war lang.", "Путешествие было долгим.", "travel"],
  ["Hund", "собака", "Der Hund schläft hier.", "Собака спит здесь.", "animals"],
  ["Straße", "улица", "Die Straße ist ruhig.", "Улица тихая.", "city"],
  ["Sonne", "солнце", "Die Sonne geht früh auf.", "Солнце встаёт рано.", "nature"],
  ["Arbeit", "работа", "Meine Arbeit ist leicht.", "Моя работа лёгкая.", "work"],
  ["froh", "довольный", "Ich bin heute froh.", "Я сегодня доволен.", "feelings"],
  ["spielen", "играть", "Wir spielen Fußball.", "Мы играем в футбол.", "sport"],
];

const A2: RawWord[] = [
  ["Rezept", "рецепт", "Dieses Rezept ist einfach.", "Этот рецепт простой.", "food"],
  ["Flughafen", "аэропорт", "Der Flughafen ist weit.", "Аэропорт далеко.", "travel"],
  ["Vogel", "птица", "Der Vogel singt.", "Птица поёт.", "animals"],
  ["Viertel", "район", "Ich wohne in einem ruhigen Viertel.", "Я живу в тихом районе.", "city"],
  ["Berg", "гора", "Der Berg ist hoch.", "Гора высокая.", "nature"],
  ["Besprechung", "совещание", "Die Besprechung beginnt um zehn.", "Совещание начинается в десять.", "work"],
  ["nervös", "нервный", "Sei nicht nervös.", "Не нервничай.", "feelings"],
  ["Team", "команда", "Unser Team hat gewonnen.", "Наша команда выиграла.", "sport"],
];

const B1: RawWord[] = [
  ["Zutat", "ингредиент", "Jede Zutat ist frisch.", "Каждый ингредиент свежий.", "food"],
  ["Ziel", "пункт назначения", "Unser Ziel ist Rom.", "Наш пункт назначения — Рим.", "travel"],
  ["Tierheim", "приют для животных", "Das Tier lebt im Tierheim.", "Животное живёт в приюте.", "animals"],
  ["Allee", "аллея, проспект", "Die Allee ist sehr breit.", "Аллея очень широкая.", "city"],
  ["Landschaft", "пейзаж", "Die Landschaft ist beeindruckend.", "Пейзаж впечатляющий.", "nature"],
  ["Frist", "срок", "Die Frist ist Freitag.", "Срок — пятница.", "work"],
  ["enttäuscht", "разочарованный", "Ich bin vom Film enttäuscht.", "Я разочарован фильмом.", "feelings"],
  ["Turnier", "турнир", "Das Turnier beginnt morgen.", "Турнир начинается завтра.", "sport"],
];

const B2: RawWord[] = [
  ["Feinkost", "деликатесы", "Feinkost ist hier sehr beliebt.", "Деликатесы здесь очень популярны.", "food"],
  ["Route", "маршрут", "Die Route umfasst drei Städte.", "Маршрут включает три города.", "travel"],
  ["Art", "вид", "Diese Art ist gefährdet.", "Этот вид под угрозой.", "animals"],
  ["Vorstadt", "пригород", "Wir wohnen in der Vorstadt.", "Мы живём в пригороде.", "city"],
  ["Dürre", "засуха", "Die Dürre hat die Ernte ruiniert.", "Засуха уничтожила урожай.", "nature"],
  ["Beförderung", "повышение", "Sie hat eine Beförderung bekommen.", "Её повысили.", "work"],
  ["ängstlich", "тревожный", "Vor Prüfungen bin ich ängstlich.", "Перед экзаменами я тревожусь.", "feelings"],
  ["Athlet", "спортсмен", "Jeder Athlet trainiert täglich.", "Каждый спортсмен тренируется ежедневно.", "sport"],
];

const C1: RawWord[] = [
  ["Würze", "приправа", "Der Suppe fehlt Würze.", "Супу не хватает приправы.", "food"],
  ["Umweg", "объезд", "Wir haben einen langen Umweg gemacht.", "Мы сделали длинный объезд.", "travel"],
  ["Zugvogel", "перелётная птица", "Der Zugvogel zieht im Herbst.", "Перелётная птица улетает осенью.", "animals"],
  ["Infrastruktur", "инфраструктура", "Die Stadt investierte in die Infrastruktur.", "Город вложился в инфраструктуру.", "city"],
  ["Erosion", "эрозия", "Die Küstenerosion nimmt zu.", "Прибрежная эрозия растёт.", "nature"],
  ["Verhandlung", "переговоры", "Die Verhandlung dauerte den ganzen Tag.", "Переговоры длились весь день.", "work"],
  ["überfordert", "подавленный, в перегрузе", "Ich bin von der Arbeit überfordert.", "Я подавлен объёмом работы.", "feelings"],
  ["Ausdauer", "выносливость", "Laufen stärkt die Ausdauer.", "Бег укрепляет выносливость.", "sport"],
];

export const de: Language = {
  code: "de",
  name: "Deutsch",
  native: "Немецкий",
  flag: "🇩🇪",
  speech: "de-DE",
  words: [
    ...buildWords("de", "A1", A1),
    ...buildWords("de", "A2", A2),
    ...buildWords("de", "B1", B1),
    ...buildWords("de", "B2", B2),
    ...buildWords("de", "C1", C1),
  ],
};