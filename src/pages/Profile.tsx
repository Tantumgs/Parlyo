import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BookOpenCheck,
  Cloud,
  Crosshair,
  Crown,
  Flame,
  Footprints,
  Globe,
  LogOut,
  MessageCircle,
  Send,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import type { Page } from "../App";
import { useStore } from "../state/store";
import { dayKey } from "../data";
import { shortMonth } from "../lib/dates";
import { plural } from "../lib/plural";
import { PageHeader, ProgressBar, StatTile } from "../components/ui";

const telegramUrl = import.meta.env.VITE_TELEGRAM_URL as string | undefined;
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL as string | undefined;

const AVATARS = ["🦊", "🐼", "🦉", "🐯", "🐸", "🦄", "🐙", "🐨"];

function heatLevel(xp: number): string {
  if (xp <= 0) return "";
  if (xp < 20) return "l1";
  if (xp < 50) return "l2";
  if (xp < 100) return "l3";
  return "l4";
}

export default function Profile({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const {
    state,
    level,
    user,
    authLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    setProfile,
    resetProgress,
  } = useStore();
  const [name, setName] = useState(state.name);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(state.name);
  }, [state.name]);

  const accuracy = state.answers === 0 ? 0 : Math.round((state.correct / state.answers) * 100);
  const avatars = AVATARS.includes(state.avatar) ? AVATARS : [state.avatar, ...AVATARS];

  const achievements = useMemo(
    () => [
      {
        icon: Footprints,
        title: "Первый шаг",
        description: "Выучи первое слово",
        unlocked: state.learned.length >= 1,
      },
      {
        icon: Zap,
        title: "Сотня",
        description: "Набери 100 XP",
        unlocked: state.xp >= 100,
      },
      {
        icon: Flame,
        title: "В ритме",
        description: "Серия 3 дня подряд",
        unlocked: state.bestStreak >= 3,
      },
      {
        icon: Target,
        title: "Испытатель",
        description: "Пройди 5 квизов",
        unlocked: state.quizzesDone >= 5,
      },
      {
        icon: Trophy,
        title: "Идеально",
        description: "100% в любом квизе",
        unlocked: Object.values(state.quizBest).some((value) => value >= 100),
      },
      {
        icon: Globe,
        title: "Полиглот",
        description: "Слова на двух языках",
        unlocked: new Set(state.learned.map((id) => id.split("-")[0])).size >= 2,
      },
      {
        icon: BookOpenCheck,
        title: "Коллекционер",
        description: "50 выученных слов",
        unlocked: state.learned.length >= 50,
      },
      {
        icon: Crosshair,
        title: "Снайпер",
        description: "Точность 80%+ на 20 ответах",
        unlocked: state.answers >= 20 && state.correct / state.answers >= 0.8,
      },
      {
        icon: Crown,
        title: "Мастер",
        description: "Достигни 5 уровня",
        unlocked: level.level >= 5,
      },
    ],
    [state.learned, state.xp, state.bestStreak, state.quizzesDone, state.quizBest, state.answers, state.correct, level.level]
  );
  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  const heat = useMemo(() => {
    const weeks = 16;
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(end.getDate() - (weeks - 1) * 7);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const days: Date[] = [];
    for (let cursor = new Date(start); days.length < weeks * 7; cursor.setDate(cursor.getDate() + 1)) {
      days.push(new Date(cursor));
    }
    const total = days.reduce((sum, day) => sum + (state.daily[dayKey(day)] ?? 0), 0);
    const activeDays = days.filter((day) => (state.daily[dayKey(day)] ?? 0) > 0).length;
    return { days, total, end, activeDays };
  }, [state.daily]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (register) await signUp(email, password);
      else await signIn(email, password);
      setEmail("");
      setPassword("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось выполнить вход");
    } finally {
      setBusy(false);
    }
  }

  async function googleAuth() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось войти через Google");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page page-stagger">
      <PageHeader
        eyebrow="Профиль"
        title={
          <>
            Твой прогресс.
            <br />
            Твоя история.
          </>
        }
        description="Здесь видно, как маленькие ежедневные шаги складываются в настоящий навык. Настрой профиль, следи за серией и открывай достижения."
        side={
          <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.035] p-3.5 pr-5">
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl border ${
                user
                  ? "border-[#7ef0d4]/30 bg-[#7ef0d4]/10 text-[#7ef0d4]"
                  : "border-white/10 bg-white/5 text-white/40"
              }`}
            >
              <Cloud size={18} />
            </span>
            <div>
              <div className="eyebrow" style={{ fontSize: 8 }}>
                Синхронизация
              </div>
              <div className="mt-1 text-[12px] font-extrabold">
                {authLoading ? "Проверяем…" : user ? "Облако включено" : "Локальный режим"}
              </div>
              <div className="text-[9px] font-semibold text-white/35">
                {user ? "прогресс на всех устройствах" : "войди, чтобы сохранить"}
              </div>
            </div>
          </div>
        }
      />

      <section className="panel profile-hero">
        <div className="profile-avatar-wrap">
          <div className="avatar avatar-xl">{state.avatar}</div>
        </div>

        <div className="profile-identity">
          <div className="eyebrow">Твой профиль</div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => {
              const next = name.trim() || "Ученик";
              setName(next);
              if (next !== state.name) setProfile({ name: next });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            className="profile-name-input mt-1"
            aria-label="Имя профиля"
            maxLength={28}
          />
          <div className="profile-level-pill">
            <span className="status-pill status-done">LVL {level.level}</span>
            <span>{level.title}</span>
            <span className="h-3 w-px bg-white/10" />
            <b>{state.xp.toLocaleString()} XP</b>
          </div>
          <div className="profile-hero-progress">
            <div className="flex items-center justify-between text-[9px] font-bold text-white/35">
              <span>
                {level.into} / {level.need} XP
              </span>
              <span>{level.remaining} XP до следующего</span>
            </div>
            <ProgressBar value={level.progress} className="mt-2" />
          </div>
        </div>

        <div className="ml-auto flex gap-2 max-[520px]:ml-0">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
            <Flame size={16} className="mx-auto text-[#ff9c8a]" />
            <div className="mt-1 font-display text-[20px] font-semibold leading-none tracking-[-0.04em]">
              {state.streak}
            </div>
            <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">серия</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
            <Zap size={16} className="mx-auto text-[var(--amber)]" />
            <div className="mt-1 font-display text-[20px] font-semibold leading-none tracking-[-0.04em]">
              {state.quizzesDone}
            </div>
            <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">
              {plural(state.quizzesDone, "квиз", "квиза", "квизов")}
            </div>
          </div>
        </div>

        <div className="avatar-picker w-full">
          <span className="mr-2 self-center text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
            аватар
          </span>
          {avatars.map((avatar, index) => (
            <button
              key={`${avatar}-${index}`}
              type="button"
              className={`avatar-choice ${state.avatar === avatar ? "active" : ""}`}
              onClick={() => setProfile({ avatar })}
              aria-label={`Выбрать аватар ${avatar}`}
              aria-pressed={state.avatar === avatar}
            >
              {avatar}
            </button>
          ))}
        </div>
      </section>

      <div className="profile-stats mt-4">
        <StatTile
          icon={<BookOpenCheck size={15} />}
          label="Слова"
          value={state.learned.length}
          caption="в личной коллекции"
          accent="var(--lime)"
        />
        <StatTile
          icon={<Target size={15} />}
          label="Квизы"
          value={state.quizzesDone}
          caption={`${state.correct} ${plural(state.correct, "верный ответ", "верных ответа", "верных ответов")}`}
          accent="var(--mint)"
        />
        <StatTile
          icon={<Flame size={15} />}
          label="Лучшая серия"
          value={`${state.bestStreak} дн.`}
          caption={`текущая — ${state.streak} дн.`}
          accent="#ff9c8a"
        />
        <StatTile
          icon={<Crosshair size={15} />}
          label="Точность"
          value={`${accuracy}%`}
          caption={`${state.answers} ${plural(state.answers, "ответ", "ответа", "ответов")} всего`}
          accent="#8bd3ff"
        />
      </div>

      <div className="dash-grid mt-4">
        <section className="panel heatmap-card span-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="eyebrow">Активность</div>
              <h2 className="display display-card mt-2">16 недель в ритме</h2>
            </div>
            <span className="status-pill status-done">
              <Sparkles size={11} />
              {heat.total.toLocaleString()} XP
            </span>
          </div>

          <div className="heatmap-layout mt-5">
            <div className="heatmap-main">
              <div className="heatmap-months">
                <span>{shortMonth(heat.days[0])}</span>
                <span>{shortMonth(heat.days[Math.floor(heat.days.length / 2)])}</span>
                <span>{shortMonth(heat.end)}</span>
              </div>
              <div className="heatmap mt-2">
                {heat.days.map((day) => {
                  const xp = state.daily[dayKey(day)] ?? 0;
                  const future = day > heat.end;
                  return (
                    <div
                      key={day.toISOString()}
                      className={`heatmap-cell ${heatLevel(xp)} ${future ? "future" : ""}`}
                      title={future ? "впереди" : `${day.getDate()}.${String(day.getMonth() + 1).padStart(2, "0")} · ${xp} XP`}
                    />
                  );
                })}
              </div>
              <div className="heatmap-legend">
                <span>меньше</span>
                <span className="heatmap-cell" />
                <span className="heatmap-cell l1" />
                <span className="heatmap-cell l2" />
                <span className="heatmap-cell l3" />
                <span className="heatmap-cell l4" />
                <span>больше</span>
              </div>
            </div>
            <div className="heatmap-summary">
              <div className="heatmap-stat">
                <b>{heat.activeDays}</b>
                <span>{plural(heat.activeDays, "активный день", "активных дня", "активных дней")}</span>
              </div>
              <div className="heatmap-stat">
                <b>{state.bestStreak}</b>
                <span>{plural(state.bestStreak, "день в лучшей серии", "дня в лучшей серии", "дней в лучшей серии")}</span>
              </div>
              <div className="heatmap-stat">
                <b>16</b>
                <span>недель истории</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel auth-card span-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="eyebrow">Аккаунт</div>
              <h2 className="display display-card mt-2">
                {user ? "Всё синхронизировано" : "Сохрани прогресс"}
              </h2>
            </div>
            <span className="empty-icon" style={{ width: 42, height: 42, borderRadius: 14 }}>
              <Cloud size={18} />
            </span>
          </div>

          {authLoading ? (
            <p className="mt-4 text-[12px] font-semibold text-white/40">Проверяем аккаунт…</p>
          ) : user ? (
            <div className="mt-5 space-y-4">
              <div className="account-row">
                <span className="cloud-dot" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-extrabold">{user.email}</div>
                  <div className="text-[9px] font-semibold text-white/35">
                    прогресс сохраняется автоматически
                  </div>
                </div>
                <span className="status-pill status-done">online</span>
              </div>
              <button
                type="button"
                className="btn btn-glass btn-block btn-sm"
                onClick={() => void signOut()}
              >
                <LogOut size={14} />
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <>
              <p className="mt-3 text-[11px] leading-relaxed text-white/40">
                Войди, чтобы прогресс, серия и достижения были на всех устройствах.
              </p>

              <button
                type="button"
                className="google-btn mt-4"
                disabled={busy}
                onClick={() => void googleAuth()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Продолжить с Google
              </button>

              <div className="divider">или email</div>

              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${register ? "" : "active"}`}
                  onClick={() => {
                    setRegister(false);
                    setError("");
                  }}
                >
                  Вход
                </button>
                <button
                  type="button"
                  className={`auth-tab ${register ? "active" : ""}`}
                  onClick={() => {
                    setRegister(true);
                    setError("");
                  }}
                >
                  Регистрация
                </button>
              </div>

              <form className="mt-3 grid gap-2.5" onSubmit={(event) => void submitAuth(event)}>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="Email"
                  className="field"
                  autoComplete="email"
                  required
                />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="Пароль (минимум 6 символов)"
                  className="field"
                  autoComplete={register ? "new-password" : "current-password"}
                  minLength={6}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-lime btn-block btn-sm"
                  disabled={busy || !email || password.length < 6}
                >
                  {busy ? "Подождите…" : register ? "Создать аккаунт" : "Войти"}
                </button>
              </form>
              {error && <p className="mt-3 text-[11px] font-semibold text-[#ff9c8a]">{error}</p>}
            </>
          )}
        </section>

        <section className="panel panel-pad span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="eyebrow">Достижения</div>
              <h2 className="display display-card mt-2">Коллекция побед</h2>
            </div>
            <span className="chip">
              <Trophy size={12} className="text-[var(--lime)]" />
              {unlockedCount} / {achievements.length}
            </span>
          </div>

          <div className="achievements-grid mt-5">
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`achievement ${item.unlocked ? "unlocked" : "locked"}`}>
                  <span className="achievement-icon">
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0">
                    <b>{item.title}</b>
                    <span>{item.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="span-5 flex flex-col gap-4">
          <section className="panel panel-pad">
            <div className="eyebrow">Связаться</div>
            <h2 className="display display-card mt-2">Мы на связи</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-white/40">
              Идея, баг или просто «спасибо» — напиши нам, читаем всё.
            </p>
            <div className="mt-4 grid gap-2">
              {telegramUrl && (
                <a className="contact-link" href={telegramUrl} target="_blank" rel="noreferrer">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#7ef0d4]/10 text-[#7ef0d4]">
                    <Send size={14} />
                  </span>
                  Telegram
                  <span className="ml-auto text-white/25">→</span>
                </a>
              )}
              {whatsappUrl && (
                <a className="contact-link" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9ff63]/10 text-[#d9ff63]">
                    <MessageCircle size={14} />
                  </span>
                  WhatsApp
                  <span className="ml-auto text-white/25">→</span>
                </a>
              )}
            </div>
          </section>

          <section className="panel panel-pad danger-card">
            <div className="eyebrow" style={{ color: "#ff9c8a" }}>
              Осторожно
            </div>
            <h2 className="display display-card mt-2">Начать с чистого листа</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-white/40">
              Удалит слова, XP, серию и результаты квизов. Отменить это будет нельзя.
            </p>
            <button
              type="button"
              className="btn btn-block btn-sm mt-4 border border-[#ff7d7d]/30 bg-[#ff7d7d]/10 text-[#ffb3a3] hover:bg-[#ff7d7d]/20"
              onClick={() => {
                if (window.confirm("Сбросить весь прогресс? Это действие нельзя отменить.")) {
                  resetProgress();
                }
              }}
            >
              <Trash2 size={14} />
              Сбросить прогресс
            </button>
            <button
              type="button"
              className="btn btn-glass btn-block btn-sm mt-2"
              onClick={() => onNavigate("home")}
            >
              На главную
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
