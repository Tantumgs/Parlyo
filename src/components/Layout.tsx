import { useEffect, useRef, useState, type ReactNode } from "react";
import { LANGUAGES } from "../data";
import { useStore } from "../state/store";
import type { Page } from "../App";

const NAV: { id: Page; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🏠" },
  { id: "words", label: "Слова", emoji: "📖" },
  { id: "quizzes", label: "Куизы", emoji: "🧩" },
  { id: "profile", label: "Профиль", emoji: "👤" },
];

export default function Layout({
  page,
  onNavigate,
  children,
}: {
  page: Page;
  onNavigate: (page: Page) => void;
  children: ReactNode;
}) {
  const { state, lang, level, setLanguage, flash } = useStore();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [langOpen]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-3xl px-4 pb-32 pt-4">
      <header className="sticky top-3 z-30 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[rgba(9,13,28,0.72)] px-3 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-black text-[#06101f] shadow-lg shadow-violet-500/30">
            P
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold tracking-tight">Parlyo</div>
            <div className="text-[11px] text-white/45">изучай языки</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500/25 to-cyan-400/20 px-2.5 py-1.5 text-[12px] font-bold ring-1 ring-white/10">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px] font-black">
              {level.level}
            </span>
            <span className="tabular-nums">{state.xp} XP</span>
          </div>

          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((open) => !open)}
              className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-2.5 py-1.5 text-[12px] font-semibold hover:bg-white/10"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="hidden sm:inline">{lang.native}</span>
              <span className={`transition ${langOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {langOpen && (
              <div
                role="listbox"
                className="absolute right-0 top-11 z-40 w-52 overflow-hidden rounded-2xl border border-white/12 bg-[#0c1124] p-1.5 shadow-2xl shadow-black/60 pop"
              >
                {LANGUAGES.map((item) => {
                  const active = item.code === lang.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition hover:bg-white/8 ${
                        active ? "bg-white/10 font-semibold" : "text-white/75"
                      }`}
                    >
                      <span className="text-lg leading-none">{item.flag}</span>
                      <span className="flex-1">{item.native}</span>
                      {active && <span className="text-cyan-300">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {flash && (
        <div
          key={flash.id}
          className={`pop fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-bold shadow-xl ${
            flash.tone === "level"
              ? "bg-gradient-to-r from-amber-300 to-orange-400 text-[#2a1500]"
              : "bg-gradient-to-r from-violet-500 to-cyan-400 text-[#06101f]"
          }`}
        >
          {flash.text}
        </div>
      )}

      <main>{children}</main>

      <nav className="fixed bottom-4 left-1/2 z-40 w-[min(36rem,calc(100%-2rem))] -translate-x-1/2">
        <div className="flex items-center justify-around rounded-2xl border border-white/12 bg-[rgba(9,13,28,0.86)] px-2 py-1.5 backdrop-blur-xl shadow-2xl shadow-black/60">
          {NAV.map((item) => {
            const active = item.id === page;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition ${
                  active ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <span className={`text-lg leading-none transition ${active ? "-translate-y-0.5" : ""}`}>
                  {item.emoji}
                </span>
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}