import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANGUAGE, dayKey, getLanguage, yesterdayKey, type Language } from "../data";
import { describeXp, type LevelState } from "../lib/level";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { get, ref, serverTimestamp, set } from "firebase/database";

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
  dailyWords: Record<string, number>;
  dailyQuizzes: Record<string, number>;
  questClaims: Record<string, string[]>;
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
    dailyWords: {},
    dailyQuizzes: {},
    questClaims: {},
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
    return {
      ...base,
      ...parsed,
      daily: parsed.daily ?? {},
      dailyWords: parsed.dailyWords ?? {},
      dailyQuizzes: parsed.dailyQuizzes ?? {},
      questClaims: parsed.questClaims ?? {},
      quizBest: parsed.quizBest ?? {},
      quizPlayed: parsed.quizPlayed ?? {},
    };
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
  user: User | null;
  authLoading: boolean;
  lang: Language;
  level: LevelState;
  todayXp: number;
  todayWords: number;
  todayQuizzes: number;
  flash: { id: number; text: string; tone: "xp" | "level" } | null;
  learnWord: (wordId: string, xp?: number) => number;
  finishQuiz: (input: FinishQuizInput) => void;
  claimQuest: (questId: string, xp: number) => void;
  setLanguage: (code: string) => void;
  setProfile: (patch: { name?: string; avatar?: string }) => void;
  resetProgress: () => void;
  showFlash: (text: string, tone?: "xp" | "level") => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const cloudReady = useRef(false);
  const [flash, setFlash] = useState<{ id: number; text: string; tone: "xp" | "level" } | null>(null);
  const showFlash = useCallback((text: string, tone: "xp" | "level" = "xp") => {
    setFlash({ id: Date.now(), text, tone });
  }, []);

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser);
    setAuthLoading(false);
    cloudReady.current = false;
    if (!nextUser) return;
    try {
      const snapshot = await get(ref(db, `users/${nextUser.uid}`));
      if (snapshot.exists()) {
        const remote = snapshot.val() as Partial<Progress>;
        setState((current) => ({
          ...current,
          ...remote,
          daily: remote.daily ?? current.daily,
          dailyWords: remote.dailyWords ?? current.dailyWords,
          dailyQuizzes: remote.dailyQuizzes ?? current.dailyQuizzes,
          questClaims: remote.questClaims ?? current.questClaims,
          quizBest: remote.quizBest ?? current.quizBest,
          quizPlayed: remote.quizPlayed ?? current.quizPlayed,
        }));
      } else {
        await set(ref(db, `users/${nextUser.uid}`), { ...loadState(), email: nextUser.email, updatedAt: serverTimestamp() });
      }
    } catch {
      showFlash("Не удалось загрузить облачный прогресс");
    } finally {
      cloudReady.current = true;
    }
  }), []);

  useEffect(() => {
    void getRedirectResult(auth).catch((error: unknown) => {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code && code !== "auth/popup-closed-by-user") {
        showFlash(code === "auth/unauthorized-domain" ? "Добавьте localhost в Authorized domains Firebase" : "Не удалось войти через Google");
      }
    });
  }, [showFlash]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [state]);

  useEffect(() => {
    if (!user || !cloudReady.current) return;
    void set(ref(db, `users/${user.uid}`), { ...state, email: user.email, updatedAt: serverTimestamp() });
  }, [state, user]);

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
      setState((prev) => {
        if (prev.learned.includes(wordId)) return prev;
        const today = dayKey();
        return {
          ...withActivity(prev, xp),
          learned: [...prev.learned, wordId],
          dailyWords: {
            ...prev.dailyWords,
            [today]: (prev.dailyWords[today] ?? 0) + 1,
          },
        };
      });
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
        const today = dayKey();
        return {
          ...next,
          quizzesDone: prev.quizzesDone + 1,
          correct: prev.correct + input.correct,
          answers: prev.answers + input.total,
          dailyQuizzes: {
            ...prev.dailyQuizzes,
            [today]: (prev.dailyQuizzes[today] ?? 0) + 1,
          },
          quizPlayed: { ...prev.quizPlayed, [input.quizId]: played + 1 },
          quizBest: { ...prev.quizBest, [input.quizId]: Math.max(prev.quizBest[input.quizId] ?? 0, input.percent) },
        };
      });
      if (afterLevel > beforeLevel) showFlash(`Новый уровень: ${afterLevel}!`, "level");
      else showFlash(`+${input.xp} XP`, "xp");
    },
    [state.xp, showFlash]
  );

  const claimQuest = useCallback(
    (questId: string, xp: number) => {
      const today = dayKey();
      setState((prev) => {
        const claimed = prev.questClaims[today] ?? [];
        if (claimed.includes(questId)) return prev;
        return {
          ...withActivity(prev, xp),
          questClaims: {
            ...prev.questClaims,
            [today]: [...claimed, questId],
          },
        };
      });
      showFlash(`Квест выполнен · +${xp} XP`, "xp");
    },
    [showFlash]
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

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithRedirect(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<StoreValue>(() => {
    const today = dayKey();
    return {
      state,
      user,
      authLoading,
      lang: getLanguage(state.language),
      level: describeXp(state.xp),
      todayXp: state.daily[today] ?? 0,
      todayWords: state.dailyWords[today] ?? 0,
      todayQuizzes: state.dailyQuizzes[today] ?? 0,
      flash,
      learnWord,
      finishQuiz,
      claimQuest,
      setLanguage,
      setProfile,
      resetProgress,
      showFlash,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    };
  }, [state, user, authLoading, flash, learnWord, finishQuiz, claimQuest, setLanguage, setProfile, resetProgress, showFlash, signIn, signUp, signInWithGoogle, signOut]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
