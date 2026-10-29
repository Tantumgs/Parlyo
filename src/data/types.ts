export type LevelCode = "A1" | "A2" | "B1" | "B2" | "C1";

export type ThemeId =
  | "food"
  | "travel"
  | "animals"
  | "city"
  | "nature"
  | "work"
  | "feelings"
  | "sport";

export interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  level: LevelCode;
  theme: ThemeId;
}

export interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  speech: string;
  words: Word[];
}

/** [word, translation, example, exampleTranslation, theme] */
export type RawWord = [string, string, string, string, ThemeId];

export interface LevelInfo {
  code: LevelCode;
  name: string;
  about: string;
  accent: string;
  soft: string;
}

export const LEVELS: LevelInfo[] = [
  {
    code: "A1",
    name: "Новичок",
    about: "Первые слова, простые предложения и знакомство с языком.",
    accent: "#34d399",
    soft: "rgba(52,211,153,0.14)",
  },
  {
    code: "A2",
    name: "Базовый",
    about: "Бытовые темы, простые рассказы и уверенное знакомство.",
    accent: "#22d3ee",
    soft: "rgba(34,211,238,0.14)",
  },
  {
    code: "B1",
    name: "Средний",
    about: "Связные тексты, мнения и понятные разговоры на разные темы.",
    accent: "#60a5fa",
    soft: "rgba(96,165,250,0.14)",
  },
  {
    code: "B2",
    name: "Выше среднего",
    about: "Сложные тексты, аргументация и свободное общение.",
    accent: "#fbbf24",
    soft: "rgba(251,191,36,0.14)",
  },
  {
    code: "C1",
    name: "Продвинутый",
    about: "Тонкие смыслы, идиоматика и свободная спонтанная речь.",
    accent: "#fb7185",
    soft: "rgba(251,113,133,0.14)",
  },
];

export const THEMES: { id: ThemeId; name: string; emoji: string; about: string }[] = [
  { id: "food", name: "Еда", emoji: "🍜", about: "вкусные слова и рестораны" },
  { id: "travel", name: "Путешествия", emoji: "✈️", about: "аэропорты, маршруты и дорога" },
  { id: "animals", name: "Животные", emoji: "🐾", about: "дикая природа и питомцы" },
  { id: "city", name: "Город", emoji: "🏙️", about: "улицы, районы и транспорт" },
  { id: "nature", name: "Природа", emoji: "🌿", about: "погода, леса и стихии" },
  { id: "work", name: "Работа", emoji: "💼", about: "офис, карьера и договорённости" },
  { id: "feelings", name: "Чувства", emoji: "😊", about: "эмоции и настроения" },
  { id: "sport", name: "Спорт", emoji: "⚽", about: "тренировки и соревнования" },
];

export const LEVEL_BY_CODE: Record<LevelCode, LevelInfo> = LEVELS.reduce(
  (acc, level) => {
    acc[level.code] = level;
    return acc;
  },
  {} as Record<LevelCode, LevelInfo>
);

export const THEME_BY_ID: Record<ThemeId, { name: string; emoji: string }> = THEMES.reduce(
  (acc, theme) => {
    acc[theme.id] = { name: theme.name, emoji: theme.emoji };
    return acc;
  },
  {} as Record<ThemeId, { name: string; emoji: string }>
);

export function buildWords(langCode: string, level: LevelCode, rows: RawWord[]): Word[] {
  return rows.map(([word, translation, example, exampleTranslation, theme], index) => ({
    id: `${langCode}-${level}-${index}`,
    word,
    translation,
    example,
    exampleTranslation,
    level,
    theme,
  }));
}

export function levelOf(words: Word[], code: LevelCode): Word[] {
  return words.filter((word) => word.level === code);
}

export function wordsOfTheme(words: Word[], theme: ThemeId): Word[] {
  return words.filter((word) => word.theme === theme);
}