export const XP_WORD = 10;
export const XP_WORD_OF_DAY = 15;
export const XP_CORRECT = 5;
export const XP_PERFECT_BONUS = 25;
export const DAILY_GOAL = 100;

const LEVEL_TITLES = [
  "Новичок",
  "Ученик",
  "Знаток",
  "Практик",
  "Уверенный",
  "Продвинутый",
  "Любитель",
  "Мастер",
  "Эксперт",
  "Полиглот",
];

/** XP, необходимый для перехода с уровня lvl на lvl+1. */
function stepFor(level: number): number {
  return 120 * level;
}

export interface LevelState {
  level: number;
  title: string;
  /** XP, набранный внутри текущего уровня. */
  into: number;
  /** Сколько XP нужно до следующего уровня. */
  need: number;
  /** Прогресс текущего уровня от 0 до 1. */
  progress: number;
  /** Следующий порог по суммарному XP. */
  nextAt: number;
  remaining: number;
}

export function describeXp(xp: number): LevelState {
  let level = 1;
  let rest = Math.max(0, Math.floor(xp));
  let need = stepFor(level);

  while (rest >= need && level < 99) {
    rest -= need;
    level += 1;
    need = stepFor(level);
  }

  return {
    level,
    title: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] ?? "Полиглот+",
    into: rest,
    need,
    progress: Math.min(1, rest / need),
    nextAt: xp - rest + need,
    remaining: need - rest,
  };
}

/** Полоска прогресса ежедневной цели. */
export function dailyGoalProgress(dailyXp: number): number {
  return Math.min(1, dailyXp / DAILY_GOAL);
}