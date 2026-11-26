import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Flame,
  Gamepad2,
  Home,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { LANGUAGES } from "../data";
import { useStore } from "../state/store";
import type { Page } from "../App";
import { leagueFor } from "../lib/level";
import { Logo, LangMark, ProgressBar, ProgressRing } from "./ui";

const NAV: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Главная", icon: Home },
  { id: "words", label: "Слова", icon: BookOpen },
  { id: "quizzes", label: "Квизы", icon: Gamepad2 },
  { id: "profile", label: "Профиль", icon: UserRound },
];

const PAGE_META: Record<Page, { kicker: string; title: string }> = {
  home: { kicker: "Сегодня", title: "Главная" },
  words: { kicker: "Словарь", title: "Слова" },
  quizzes: { kicker: "Тренировка", title: "Квизы" },
  profile: { kicker: "Аккаунт", title: "Профиль" },
};

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLanguage } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={
          compact
            ? "flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 text-[11px] font-bold text-white/80"
            : "flex w-full items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-left transition-colors hover:border-white/20 hover:bg-white/[0.07]"
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Сменить язык"
      >
        <LangMark code={lang.code} size={compact ? 24 : 30} />
        {!compact && (
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold text-white/90">{lang.native}</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
              язык обучения
            </span>
          </span>
        )}
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div role="listbox" className={`lang-menu ${compact ? "lang-menu-compact" : "lang-menu-sidebar"}`}>
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
                  setOpen(false);
                }}
                className={`lang-option ${active ? "active" : ""}`}
              >
                <LangMark code={item.code} size={30} />
                <span className="flex-1">{item.native}</span>
                {active && <Check size={15} className="lang-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  };

  return { canInstall: Boolean(promptEvent) && !installed, install };
}

export default function Layout({
  page,
  onNavigate,
  children,
}: {
  page: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}) {
  const { state, level, todayXp, flash } = useStore();
  const installPrompt = useInstallPrompt();
  const dailyProgress = Math.min(1, todayXp / 100);
  const league = leagueFor(state.xp).name;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.3;
    const paint = () => {
      raf = 0;
      document.documentElement.style.setProperty("--mx", `${x}px`);
      document.documentElement.style.setProperty("--my", `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="ambient" aria-hidden />
      <div className="ambient-grid" aria-hidden />
      <div className="spotlight" aria-hidden />
      <div className="grain" aria-hidden />

      <div className="app-frame">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <Logo />
          </div>

          <div className="nav-label">Навигация</div>
          <nav className="nav-stack" aria-label="Основная навигация">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`nav-link ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="nav-icon">
                    <Icon size={17} strokeWidth={2.1} />
                  </span>
                  <span>{item.label}</span>
                  {item.id === "quizzes" && !active && <span className="nav-badge">XP</span>}
                </button>
              );
            })}
          </nav>

          {installPrompt.canInstall && (
            <button type="button" className="sidebar-install" onClick={installPrompt.install}>
              <span className="nav-icon">
                <Download size={15} strokeWidth={2.2} />
              </span>
              <span>Установить приложение</span>
            </button>
          )}

          <div className="sidebar-spacer" />

          <LanguageSwitcher />

          <div className="sidebar-goal">
            <div className="sidebar-goal-top">
              <div>
                <div className="eyebrow" style={{ fontSize: 8, letterSpacing: "0.16em" }}>
                  Цель дня
                </div>
                <div className="mt-2 font-display text-[22px] font-semibold tracking-[-0.05em] leading-none">
                  {todayXp}
                  <span className="ml-1 text-[10px] font-bold tracking-normal text-white/35">/ 100 XP</span>
                </div>
              </div>
              <ProgressRing value={dailyProgress} size={46} stroke={5}>
                <div className="grid h-full w-full place-items-center text-[9px] font-extrabold text-white/60">
                  {Math.round(dailyProgress * 100)}%
                </div>
              </ProgressRing>
            </div>
            <ProgressBar value={dailyProgress} className="progress-thin mt-3" />
            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-white/40">
              <Flame size={12} className="text-[#ff9c8a]" />
              серия {state.streak} дн. · лучшая {state.bestStreak}
            </div>
          </div>

          <button
            type="button"
            className="sidebar-profile"
            onClick={() => onNavigate("profile")}
          >
            <span className="avatar">{state.avatar}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-extrabold">{state.name}</span>
              <span className="block text-[9px] font-bold text-white/35">
                Уровень {level.level} · {level.title}
              </span>
            </span>
            <ChevronDown size={14} className="-rotate-90 text-white/25" />
          </button>
        </aside>

        <div className="app-main">
          <header className="status-bar">
            <div className="status-bar-context">
              <span className="status-bar-kicker">{PAGE_META[page].kicker}</span>
              <span className="status-bar-title">{PAGE_META[page].title}</span>
            </div>
            <div className="status-bar-hud">
              <div className="hud-goal">
                <ProgressRing value={dailyProgress} size={30} stroke={4} className="hud-ring">
                  <span className="hud-ring-label">{Math.round(dailyProgress * 100)}</span>
                </ProgressRing>
                <span className="hud-goal-label">цель дня</span>
              </div>
              <div className="hud-pill hud-streak">
                <Flame size={13} />
                <b>{state.streak}</b>
                <span>дн.</span>
              </div>
              <div className="hud-pill hud-xp">
                <Zap size={13} />
                <b>{state.xp.toLocaleString()}</b>
                <span>XP</span>
              </div>
              <div className="hud-pill hud-league">
                <Trophy size={13} />
                <b>{league}</b>
              </div>
              <button
                type="button"
                className="hud-avatar"
                onClick={() => onNavigate("profile")}
                aria-label="Открыть профиль"
              >
                {state.avatar}
              </button>
            </div>
            <div className="status-bar-line" aria-hidden>
              <i style={{ width: `${dailyProgress * 100}%` }} />
            </div>
          </header>

          <header className="mobile-header">
            <Logo compact />
            <div className="ml-auto flex items-center gap-2">
              {installPrompt.canInstall && (
                <button
                  type="button"
                  className="mobile-install"
                  onClick={installPrompt.install}
                  aria-label="Установить приложение"
                >
                  <Download size={15} />
                </button>
              )}
              <div className="mobile-vitals">
                <span className="mobile-vital mobile-vital-streak">
                  <Flame size={12} />
                  {state.streak}
                </span>
                <i />
                <span className="mobile-vital mobile-vital-xp">
                  <Zap size={12} />
                  {state.xp.toLocaleString()}
                </span>
              </div>
              <LanguageSwitcher compact />
            </div>
          </header>

          <main key={page} className="page-container">
            {children}
          </main>
        </div>

        <nav className="dock" aria-label="Основная навигация">
          <div className="dock-row">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`dock-item ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="dock-icon">
                    <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {flash && (
        <div key={flash.id} className={`flash-toast ${flash.tone === "level" ? "level" : ""}`}>
          {flash.tone === "level" ? <Trophy size={15} /> : <Zap size={15} />}
          {flash.text}
        </div>
      )}
    </>
  );
}
