import type {
  Language,
  LevelCode,
  Phrase,
  ScenarioInfo,
  ThemeId,
  Word,
} from "../data";
import { levelOf, wordsOfTheme } from "../data";

export type QuestionKind =
  | "translate"
  | "reverse"
  | "context"
  | "voice"
  | "reply"
  | "phrase";

export interface Dialogue {
  prompt: string;
  promptTranslation: string;
  reply: string;
  replyTranslation: string;
}

export interface Question {
  id: string;
  kind: QuestionKind;
  label: string;
  prompt: string;
  sub?: string;
  options: string[];
  correct: number;
  speak?: string;
  reveal?: { word: string; translation: string; example: string; exampleTranslation: string };
  dialogue?: Dialogue;
}

export type QuizKind = "level" | "theme" | "voice" | "communication" | "scenario";

export interface Quiz {
  id: string;
  kind: QuizKind;
  title: string;
  subtitle: string;
  emoji: string;
  accent: string;
  questions: Question[];
}

export interface QuizResult {
  quizId: string;
  correct: number;
  total: number;
  xp: number;
  perfect: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

/** Текст примера с пропущенным словом, либо null, если слово в примере не встречается. */
function gapSentence(word: Word): string | null {
  const index = word.example.toLowerCase().indexOf(word.word.toLowerCase());
  if (index < 0) return null;
  return `${word.example.slice(0, index)}____${word.example.slice(index + word.word.length)}`;
}

function distractors(pool: Word[], correct: string, field: "word" | "translation", count: number): string[] {
  const seen = new Set([correct]);
  const out: string[] = [];
  for (const candidate of pick(pool, pool.length)) {
    const value = field === "word" ? candidate.word : candidate.translation;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length === count) break;
  }
  return out;
}

function buildQuestion(
  word: Word,
  kind: QuestionKind,
  pool: Word[],
  index: number
): Question | null {
  const reveal = {
    word: word.word,
    translation: word.translation,
    example: word.example,
    exampleTranslation: word.exampleTranslation,
  };

  if (kind === "translate" || kind === "voice") {
    const options = shuffle([word.translation, ...distractors(pool, word.translation, "translation", 3)]);
    if (options.length < 4) return null;
    return {
      id: `${word.id}-${kind}-${index}`,
      kind,
      label: kind === "voice" ? "Прослушай и выбери перевод" : "Перевод на русский",
      prompt: kind === "voice" ? "Что ты услышал?" : `Как переводится «${word.word}»?`,
      options,
      correct: options.indexOf(word.translation),
      speak: word.word,
      reveal,
    };
  }

  if (kind === "reverse") {
    const options = shuffle([word.word, ...distractors(pool, word.word, "word", 3)]);
    if (options.length < 4) return null;
    return {
      id: `${word.id}-reverse-${index}`,
      kind,
      label: "Перевод с русского",
      prompt: `Что означает «${word.translation}»?`,
      options,
      correct: options.indexOf(word.word),
      reveal,
    };
  }

  const gap = gapSentence(word);
  if (!gap) return null;
  const options = shuffle([word.word, ...distractors(pool, word.word, "word", 3)]);
  if (options.length < 4) return null;
  return {
    id: `${word.id}-context-${index}`,
    kind: "context",
    label: "Вставь пропущенное слово",
    prompt: gap,
    sub: word.translation,
    options,
    correct: options.indexOf(word.word),
    reveal,
  };
}

const KIND_ORDER: QuestionKind[] = ["translate", "reverse", "context"];

function phraseDistractors(
  pool: Phrase[],
  correct: string,
  field: "prompt" | "reply",
  count: number
): string[] {
  const seen = new Set([correct]);
  const out: string[] = [];
  for (const candidate of pick(pool, pool.length)) {
    const value = field === "prompt" ? candidate.prompt : candidate.reply;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length === count) break;
  }
  return out;
}

function buildPhraseQuestion(
  phrase: Phrase,
  kind: "reply" | "phrase",
  pool: Phrase[],
  index: number
): Question | null {
  const dialogue: Dialogue = {
    prompt: phrase.prompt,
    promptTranslation: phrase.promptTranslation,
    reply: phrase.reply,
    replyTranslation: phrase.replyTranslation,
  };

  if (kind === "reply") {
    const options = shuffle([phrase.reply, ...phraseDistractors(pool, phrase.reply, "reply", 3)]);
    if (options.length < 4) return null;
    return {
      id: `${phrase.id}-reply-${index}`,
      kind,
      label: "Что ответишь?",
      prompt: phrase.prompt,
      sub: phrase.promptTranslation,
      options,
      correct: options.indexOf(phrase.reply),
      speak: phrase.prompt,
      dialogue,
    };
  }

  const options = shuffle([phrase.prompt, ...phraseDistractors(pool, phrase.prompt, "prompt", 3)]);
  if (options.length < 4) return null;
  return {
    id: `${phrase.id}-phrase-${index}`,
    kind,
    label: "Как это сказать?",
    prompt: phrase.promptTranslation,
    options,
    correct: options.indexOf(phrase.prompt),
    dialogue,
  };
}

function makePhraseQuestions(
  pool: Phrase[],
  allPhrases: Phrase[],
  count: number,
  kinds: ("reply" | "phrase")[]
): Question[] {
  const combos: { phrase: Phrase; kind: "reply" | "phrase" }[] = [];
  for (const phrase of pool) {
    for (const kind of kinds) {
      combos.push({ phrase, kind });
    }
  }

  const questions: Question[] = [];
  let index = 0;
  for (const combo of shuffle(combos)) {
    if (questions.length >= count) break;
    const question = buildPhraseQuestion(combo.phrase, combo.kind, allPhrases, index);
    index += 1;
    if (question) questions.push(question);
  }
  return questions;
}

function makeQuestions(
  pool: Word[],
  allWords: Word[],
  count: number,
  kinds: QuestionKind[]
): Question[] {
  const combos: { word: Word; kind: QuestionKind }[] = [];
  for (const word of pool) {
    for (const kind of kinds) {
      combos.push({ word, kind });
    }
  }

  const questions: Question[] = [];
  let index = 0;
  for (const combo of shuffle(combos)) {
    if (questions.length >= count) break;
    const question = buildQuestion(combo.word, combo.kind, allWords, index);
    index += 1;
    if (question) questions.push(question);
  }
  return questions;
}

/** Квиз по уровню: вопросы составляются из слов этого уровня. */
export function levelQuiz(lang: Language, level: LevelCode, accent: string, about: string): Quiz {
  const pool = levelOf(lang.words, level);
  return {
    id: `level-${lang.code}-${level}`,
    kind: "level",
    title: `Квиз уровня ${level}`,
    subtitle: about,
    emoji: "🎯",
    accent,
    questions: makeQuestions(pool, lang.words, 8, KIND_ORDER),
  };
}

/** Тематический квиз: слова этой темы со всех уровней. */
export function themeQuiz(lang: Language, theme: ThemeId, emoji: string, name: string): Quiz {
  const pool = wordsOfTheme(lang.words, theme);
  return {
    id: `theme-${lang.code}-${theme}`,
    kind: "theme",
    title: name,
    subtitle: `слова темы «${name.toLowerCase()}» со всех уровней`,
    emoji,
    accent: "#a78bfa",
    questions: makeQuestions(pool, lang.words, 8, KIND_ORDER),
  };
}

/** Голосовой квиз: звучит слово, нужно выбрать перевод. */
export function voiceQuiz(
  lang: Language,
  level: LevelCode,
  accent: string,
  speechSupported: boolean
): Quiz {
  const pool = levelOf(lang.words, level);
  const questions = makeQuestions(pool, lang.words, 8, ["voice"]).map((question) =>
    speechSupported
      ? question
      : {
          ...question,
          kind: "translate" as QuestionKind,
          label: "Озвучка недоступна — слово показано текстом",
          prompt: question.reveal ? `Как переводится «${question.reveal.word}»?` : question.prompt,
          speak: undefined,
        }
  );

  return {
    id: `voice-${lang.code}-${level}`,
    kind: "voice",
    title: "Голосовой квиз",
    subtitle: "слушай слово и выбирай перевод",
    emoji: "🔊",
    accent,
    questions,
  };
}

/** Квиз по фразам уровня: что могут спросить и как ответить. */
export function communicationQuiz(lang: Language, level: LevelCode, accent: string): Quiz {
  const pool = lang.phrases.filter((phrase) => phrase.level === level);
  return {
    id: `communication-${lang.code}-${level}`,
    kind: "communication",
    title: `Фразы уровня ${level}`,
    subtitle: "живые вопросы и ответы для разговора",
    emoji: "💬",
    accent,
    questions: makePhraseQuestions(pool, lang.phrases, 8, ["reply", "phrase"]),
  };
}

/** Квиз по жизненному сценарию: диалоги кафе, работы, путешествий. */
export function scenarioQuiz(lang: Language, scenario: ScenarioInfo): Quiz {
  const pool = lang.phrases.filter((phrase) => phrase.scenario === scenario.id);
  return {
    id: `scenario-${lang.code}-${scenario.id}`,
    kind: "scenario",
    title: scenario.name,
    subtitle: scenario.about,
    emoji: scenario.emoji,
    accent: scenario.accent,
    questions: makePhraseQuestions(pool, pool, 6, ["reply", "phrase"]),
  };
}

export function emptyQuiz(id: string, title: string, subtitle: string, emoji: string): Quiz {
  return { id, kind: "level", title, subtitle, emoji, accent: "#7c5cff", questions: [] };
}

const XP_PERFECT_BONUS_QUIZ = 25;

export function calcXp(correct: number, total: number): number {
  const base = correct * 5;
  const bonus = total > 0 && correct === total ? XP_PERFECT_BONUS_QUIZ : 0;
  return base + bonus;
}

export function summarize(correct: number, total: number): { percent: number; verdict: string } {
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  if (percent === 100) return { percent, verdict: "Идеально!" };
  if (percent >= 75) return { percent, verdict: "Отличный результат" };
  if (percent >= 50) return { percent, verdict: "Неплохо, есть куда расти" };
  return { percent, verdict: "Стоит повторить" };
}
