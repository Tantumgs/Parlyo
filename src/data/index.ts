import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import type { Language, LevelCode, Word } from "./types";

export * from "./types";

export const LANGUAGES: Language[] = [en, es, fr, de];

export const DEFAULT_LANGUAGE = "en";

export function getLanguage(code: string): Language {
  return LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0];
}

export function wordsForLevel(lang: Language, level: LevelCode): Word[] {
  return lang.words.filter((word) => word.level === level);
}

export function wordById(lang: Language, id: string): Word | undefined {
  return lang.words.find((word) => word.id === id);
}

/** День года с 1 января, 0-based — чтобы «слово дня» менялось раз в сутки. */
export function dayIndex(date = new Date()): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((today - start) / 86400000);
}

export function dayKey(date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function yesterdayKey(date = new Date()): string {
  return dayKey(new Date(date.getTime() - 86400000));
}

/** Слово дня для выбранного языка — детерминировано по дате. */
export function wordOfTheDay(lang: Language): Word {
  return lang.words[dayIndex() % lang.words.length];
}

export const FUN_FACTS: string[] = [
  "1000 самых частых слов закрывают около 80% любой повседневной речи — и на английском, и на испанском.",
  "Самое длинное слово в английском словаре — pneumonoultramicroscopicsilicovolcanoconiosis, целых 45 букв.",
  "В испанском есть слово «sobremesa» — время за столом после еды, когда все просто болтают.",
  "Французское «dépaysement» — это то особое чувство, которое испытываешь, оказавшись в чужой стране.",
  "В немецком слова можно склеивать почти бесконечно: Rechtsschutzversicherungsgesellschaften — общество страхования юридической защиты.",
  "Слово «quiz» появилось в 1791 году в Ирландии: журналист по пари написал его на стене за одну ночь.",
  "В русском языке порядка 150 тысяч слов, но в жизни мы используем примерно 20-30 тысяч.",
  "Венгерский и финский считаются самыми трудными для русскоязычных: в них до 18 падежей.",
  "Через 500 лет французский, испанский и итальянский будут понимать друг друга почти без перевода — они расходятся примерно на 1% за 1000 лет.",
  "Глагол «to be» — самый частотный в английском: он встречается примерно в каждом седьмом слове.",
  "Дети начинают говорить примерно с 12 месяцев, а взрослому нужно около 3000 часов практики, чтобы свободно владеть языком.",
  "Корейский алфавит хангыль придуман специально для простоты: его можно выучить за пару часов.",
];

export function factOfTheDay(date = new Date()): string {
  return FUN_FACTS[dayIndex(date) % FUN_FACTS.length];
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "Доброй ночи";
  if (hour < 11) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}