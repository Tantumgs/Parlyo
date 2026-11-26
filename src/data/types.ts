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

export type ScenarioId = "intro" | "cafe" | "travel" | "work" | "smalltalk" | "opinion";

export interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  level: LevelCode;
  theme: ThemeId;
}

export interface Phrase {
  id: string;
  prompt: string;
  promptTranslation: string;
  reply: string;
  replyTranslation: string;
  level: LevelCode;
  scenario: ScenarioId;
}

export interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  speech: string;
  words: Word[];
  phrases: Phrase[];
}

/** [word, translation, example, exampleTranslation, theme] */
export type RawWord = [string, string, string, string, ThemeId];

/** [prompt, promptTranslation, reply, replyTranslation, level, scenario] */
export type RawPhrase = [string, string, string, string, LevelCode, ScenarioId];

export interface ScenarioInfo {
  id: ScenarioId;
  name: string;
  about: string;
  emoji: string;
  accent: string;
}

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

export const SCENARIOS: ScenarioInfo[] = [
  {
    id: "intro",
    name: "Знакомство",
    about: "имя, откуда ты и чем занимаешься",
    emoji: "👋",
    accent: "#7ef0d4",
  },
  {
    id: "cafe",
    name: "В кафе",
    about: "заказ, счёт и маленькие просьбы",
    emoji: "☕",
    accent: "#ffb86b",
  },
  {
    id: "travel",
    name: "В пути",
    about: "билеты, транспорт и задержки",
    emoji: "🧭",
    accent: "#8bd3ff",
  },
  {
    id: "work",
    name: "На работе",
    about: "встречи, сроки и рабочие вопросы",
    emoji: "🗂️",
    accent: "#b8a1ff",
  },
  {
    id: "smalltalk",
    name: "Светская беседа",
    about: "погода, планы и приятная болтовня",
    emoji: "🌤️",
    accent: "#ffd166",
  },
  {
    id: "opinion",
    name: "Мнение",
    about: "согласие, сомнение и аргументы",
    emoji: "💬",
    accent: "#ff9c8a",
  },
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

export const SCENARIO_BY_ID: Record<ScenarioId, ScenarioInfo> = SCENARIOS.reduce(
  (acc, scenario) => {
    acc[scenario.id] = scenario;
    return acc;
  },
  {} as Record<ScenarioId, ScenarioInfo>
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

export function buildPhrases(langCode: string, rows: RawPhrase[]): Phrase[] {
  return rows.map(([prompt, promptTranslation, reply, replyTranslation, level, scenario], index) => ({
    id: `${langCode}-phrase-${index}`,
    prompt,
    promptTranslation,
    reply,
    replyTranslation,
    level,
    scenario,
  }));
}

export function levelOf(words: Word[], code: LevelCode): Word[] {
  return words.filter((word) => word.level === code);
}

export function wordsOfTheme(words: Word[], theme: ThemeId): Word[] {
  return words.filter((word) => word.theme === theme);
}