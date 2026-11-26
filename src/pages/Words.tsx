import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  LayoutGrid,
  List,
  Plus,
  Search,
  Volume2,
  X,
} from "lucide-react";
import {
  LEVELS,
  THEMES,
  wordsForLevel,
  wordsOfTheme,
  type LevelCode,
  type ThemeId,
} from "../data";
import type { Page } from "../App";
import { useStore } from "../state/store";
import { speak } from "../lib/speech";
import { PageHeader, ProgressBar, ProgressRing } from "../components/ui";

type StatusFilter = "all" | "new" | "learned";

export default function Words({
  level,
  onPickLevel,
  onNavigate,
}: {
  level: LevelCode;
  onPickLevel: (level: LevelCode) => void;
  onNavigate: (page: Page) => void;
}) {
  const { lang, state, learnWord } = useStore();
  const [theme, setTheme] = useState<ThemeId | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const inputRef = useRef<HTMLInputElement>(null);

  const levelInfo = LEVELS.find((item) => item.code === level) ?? LEVELS[0];
  const levelWords = useMemo(() => wordsForLevel(lang, level), [lang, level]);
  const totalInLevel = levelWords.length;
  const learnedInLevel = levelWords.filter((word) => state.learned.includes(word.id)).length;
  const levelProgress = totalInLevel === 0 ? 0 : learnedInLevel / totalInLevel;

  const words = useMemo(() => {
    let source = theme === "all" ? levelWords : wordsOfTheme(levelWords, theme);
    const normalized = query.trim().toLowerCase();
    if (normalized) {
      source = source.filter((word) =>
        `${word.word} ${word.translation}`.toLowerCase().includes(normalized)
      );
    }
    if (status !== "all") {
      source = source.filter((word) =>
        status === "learned"
          ? state.learned.includes(word.id)
          : !state.learned.includes(word.id)
      );
    }
    return source;
  }, [levelWords, theme, query, status, state.learned]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const resetFilters = () => {
    setTheme("all");
    setStatus("all");
    setQuery("");
  };

  return (
    <div className="page page-stagger">
      <PageHeader
        eyebrow={`Словарь · ${lang.native}`}
        title={
          <>
            Слова, которые
            <br />
            остаются с тобой.
          </>
        }
        description="Слушай, читай и забирай слова в свою коллекцию. Каждое выученное слово — это +10 XP и ещё один шаг к свободной речи."
        side={
          <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.035] p-3 pr-5">
            <ProgressRing value={levelProgress} size={72} stroke={7}>
              <div className="grid h-full w-full place-items-center text-[13px] font-extrabold">
                {Math.round(levelProgress * 100)}%
              </div>
            </ProgressRing>
            <div>
              <div className="eyebrow" style={{ fontSize: 8 }}>
                Уровень {level}
              </div>
              <div className="mt-1 font-display text-[18px] font-semibold leading-none tracking-[-0.04em]">
                {learnedInLevel}
                <span className="text-white/30"> / {totalInLevel}</span>
              </div>
              <div className="mt-1 text-[9px] font-bold text-white/35">слов выучено</div>
            </div>
          </div>
        }
      />

      <section className="panel words-toolbar">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="search-wrap">
            <Search size={17} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Слово или перевод…"
              className="search-input"
              aria-label="Поиск слов"
            />
            <span className="search-kbd">
              {query ? (
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 26, height: 26, borderRadius: 8 }}
                  onClick={() => setQuery("")}
                  aria-label="Очистить поиск"
                >
                  <X size={13} />
                </button>
              ) : (
                <span className="kbd">/</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              className={`icon-btn ${view === "grid" ? "icon-btn-lime" : ""}`}
              style={{ width: 34, height: 34, borderRadius: 9, border: 0 }}
              onClick={() => setView("grid")}
              aria-label="Сетка"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              className={`icon-btn ${view === "list" ? "icon-btn-lime" : ""}`}
              style={{ width: 34, height: 34, borderRadius: 9, border: 0 }}
              onClick={() => setView("list")}
              aria-label="Список"
              aria-pressed={view === "list"}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        <div className="toolbar-row">
          <div className="toolbar-scroll">
            {LEVELS.map((item) => {
              const active = item.code === level;
              return (
                <button
                  key={item.code}
                  type="button"
                  className={`chip chip-level ${active ? "chip-active" : ""}`}
                  onClick={() => onPickLevel(item.code)}
                  style={
                    active
                      ? { background: item.accent, borderColor: item.accent, color: "#08110a" }
                      : { color: item.accent, borderColor: `${item.accent}33` }
                  }
                >
                  {item.code}
                </button>
              );
            })}
          </div>

          <span className="toolbar-sep" />

          <div className="toolbar-scroll">
            {(
              [
                ["all", "Все слова"],
                ["new", "Не выучено"],
                ["learned", "Выучено"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`chip ${status === id ? "chip-active" : ""}`}
                onClick={() => setStatus(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-scroll">
          <button
            type="button"
            className={`chip ${theme === "all" ? "chip-active" : ""}`}
            onClick={() => setTheme("all")}
          >
            Все темы
          </button>
          {THEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip ${theme === item.id ? "chip-active" : ""}`}
              onClick={() => setTheme(item.id)}
            >
              <span>{item.emoji}</span> {item.name}
            </button>
          ))}
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-white/40">
          <span>
            Найдено <b className="text-white/80">{words.length}</b>
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>
            Выучено <b className="text-[var(--lime)]">{learnedInLevel}</b> из {totalInLevel}
          </span>
          {(theme !== "all" || status !== "all" || query) && (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-white/50 underline decoration-white/20 underline-offset-4 hover:text-white"
              onClick={resetFilters}
            >
              <X size={11} />
              сбросить фильтры
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
            прогресс уровня
          </span>
          <div className="w-32">
            <ProgressBar value={levelProgress} className="progress-thin" />
          </div>
        </div>
      </div>

      <div className={`words-grid ${view === "list" ? "list-view" : ""}`}>
        {words.map((word) => {
          const learned = state.learned.includes(word.id);
          const themeInfo = THEMES.find((item) => item.id === word.theme);
          return (
            <article key={word.id} className={`word-card ${learned ? "learned" : ""}`}>
              <div className="word-card-top">
                <span className="word-theme" title={themeInfo?.name}>
                  {themeInfo?.emoji ?? "✦"}
                </span>
                <div className="word-badges">
                  <span
                    className="chip chip-level"
                    style={{ color: levelInfo.accent, borderColor: `${levelInfo.accent}33` }}
                  >
                    {word.level}
                  </span>
                  <span className="chip">{themeInfo?.name ?? word.theme}</span>
                </div>
              </div>

              <div className="word-card-main">
                <h2 className="word-en">{word.word}</h2>
                <p className="word-ru">{word.translation}</p>
              </div>

              <div className="word-example">
                «{word.example}»
                <em>«{word.exampleTranslation}»</em>
              </div>

              <div className="word-foot">
                <button
                  type="button"
                  className={`btn btn-sm ${learned ? "btn-dark" : "btn-lime"}`}
                  disabled={learned}
                  onClick={() => learnWord(word.id)}
                >
                  {learned ? (
                    <>
                      <Check size={14} />
                      Выучено
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Выучить
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 38, height: 38 }}
                  onClick={() => speak(word.word, lang.speech)}
                  aria-label={`Прослушать ${word.word}`}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {words.length === 0 && (
        <div className="panel empty-state">
          <span className="empty-icon">
            <BookOpen size={26} />
          </span>
          <h2 className="display display-card">Здесь пока пусто</h2>
          <p className="max-w-sm text-[12px] font-medium text-white/40">
            Попробуй другой запрос, тему или сбрось фильтры — слова никуда не исчезли.
          </p>
          <button type="button" className="btn btn-glass btn-sm mt-1" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-semibold text-white/30">
          Совет: нажми <span className="kbd">/</span> чтобы мгновенно перейти к поиску
        </p>
        <button
          type="button"
          className="btn btn-glass btn-sm"
          onClick={() => onNavigate("quizzes")}
        >
          Закрепить в квизе
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
