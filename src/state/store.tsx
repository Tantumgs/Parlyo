import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANGUAGE, dayKey, getLanguage, yesterdayKey, type Language } from "../data";
import { describeXp, type LevelState } from "../lib/level";

export interface Progress {
  v: 1;
  language: string;
  name: string;
  avatar: string;
  xp: number;
  learned: string[];
  quizzesDone: number;
  correct: number;
  answers: number;
  streak: number;
  bestStreak: number;
  lastActive: string;
  daily: Record<string, number>;
  quizBest: Record<string, number>;
  quizPlayed: Record<string, number>;
}

const STORAGE_KEY = "parlyo:progress:v1";

function freshState(): Progress {
  return {
    v: 1,
    language: DEFAULT_LANGUAGE,
    name: "Ученик",
    avatar: "🦊",
    xp: 0,
    learned: [],
    quizzesDone: 0,
    correct: 0,
    answers: 0,
    streak: 0,
    bestStreak: 0,
    lastActive: "",
    daily: {},
    quizBest: {},
    quizPlayed: {},
  };
}

function loadState(): Progress {
  const base = freshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...base, ...parsed, daily: parsed.daily ?? {}, quizBest: parsed.quizBest ?? {}, quizPlayed: parsed.quizPlayed ?? {} };
  } catch {
    return base;
  }
}

export interface FinishQuizInput {
  quizId: string;
  correct: number;
  total: number;
  xp: number;
  percent: number;
}

interface StoreValue {
  state: Progress;
  lang: Language;
  level: LevelState;
  todayXp: number;
  flash: { id: number; text: string; tone: "xp" | "level" } | null;
  learnWord: (wordId: string, xp?: number) => number;
  finishQuiz: (input: FinishQuizInput) => void;
  setLanguage: (code: string) => void;
  setProfile: (patch: { name?: string; avatar?: string }) => void;
  resetProgress: () => void;
  showFlash: (text: string, tone?: "xp" | "level") => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function withActivity(prev: Progress, gained: number): Progress {
  const today = dayKey();
  const daily = { ...prev.daily, [today]: (prev.daily[today] ?? 0) + gained };

  let streak = prev.streak;
  if (prev.lastActive !== today) {
    streak = prev.lastActive === yesterdayKey() ? prev.streak + 1 : 1;
  }

  return {
    ...prev,
    xp: prev.xp + gained,
    daily,
    streak,
    bestStreak: Math.max(prev.bestStreak, streak),
    lastActive: today,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Progress>(loadState);
  const [flash, setFlash] = useState<{ id: number; text: string; tone: "xp" | "level" } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [state]);

  const showFlash = useCallback((text: string, tone: "xp" | "level" = "xp") => {
    setFlash({ id: Date.now(), text, tone });
  }, []);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 1800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const learnWord = useCallback(
    (wordId: string, xp = 10) => {
      if (state.learned.includes(wordId)) return 0;
      const beforeLevel = describeXp(state.xp).level;
      const afterLevel = describeXp(state.xp + xp).level;
      setState((prev) => (prev.learned.includes(wordId) ? prev : { ...withActivity(prev, xp), learned: [...prev.learned, wordId] }));
      showFlash(afterLevel > beforeLevel ? `Новый уровень: ${afterLevel}!` : `+${xp} XP`, afterLevel > beforeLevel ? "level" : "xp");
      return xp;
    },
    [state.learned, state.xp, showFlash]
  );

  const finishQuiz = useCallback(
    (input: FinishQuizInput) => {
      const beforeLevel = describeXp(state.xp).level;
      const afterLevel = describeXp(state.xp + input.xp).level;
      setState((prev) => {
        const next = withActivity(prev, input.xp);
        const played = prev.quizPlayed[input.quizId] ?? 0;
        return {
          ...next,
          quizzesDone: prev.quizzesDone + 1,
          correct: prev.correct + input.correct,
          answers: prev.answers + input.total,
          quizPlayed: { ...prev.quizPlayed, [input.quizId]: played + 1 },
          quizBest: { ...prev.quizBest, [input.quizId]: Math.max(prev.quizBest[input.quizId] ?? 0, input.percent) },
        };
      });
      if (afterLevel > beforeLevel) showFlash(`Новый уровень: ${afterLevel}!`, "level");
      else showFlash(`+${input.xp} XP`, "xp");
    },
    [state.xp, showFlash]
  );

  const setLanguage = useCallback((code: string) => {
    setState((prev) => ({ ...prev, language: code }));
  }, []);

  const setProfile = useCallback((patch: { name?: string; avatar?: string }) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = freshState();
    setState({ ...fresh, language: state.language });
    showFlash("Прогресс сброшен", "xp");
  }, [state.language, showFlash]);

  const value = useMemo<StoreValue>(() => {
    const today = dayKey();
    return {
      state,
      lang: getLanguage(state.language),
      level: describeXp(state.xp),
      todayXp: state.daily[today] ?? 0,
      flash,
      learnWord,
      finishQuiz,
      setLanguage,
      setProfile,
      resetProgress,
      showFlash,
    };
  }, [state, flash, learnWord, finishQuiz, setLanguage, setProfile, resetProgress, showFlash]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}