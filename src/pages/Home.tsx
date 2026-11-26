import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Gamepad2,
  Lock,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import {
  dayIndex,
  dayKey,
  greeting,
  LEVELS,
  THEME_BY_ID,
  wordOfTheDay,
  wordsForLevel,
  type LevelCode,
} from "../data";
import { useStore } from "../state/store";
import type { Page } from "../App";
import { describeXp, leagueFor } from "../lib/level";
import { humanDate, isToday, lastNDays, weekdayShortMon } from "../lib/dates";
import { plural } from "../lib/plural";
import { speak } from "../lib/speech";
import { ProgressBar, ProgressRing, StatTile } from "../components/ui";

export default function Home({
  level,
  onNavigate,
  onPickLevel,
}: {
  level: LevelCode;
  onNavigate: (page: Page) => void;
  onPickLevel: (level: LevelCode) => void;
}) {
  const { state, lang, todayXp, todayWords, todayQuizzes, claimQuest } = useStore();
  const xpLevel = describeXp(state.xp);
  const league = leagueFor(state.xp);
  const word = wordOfTheDay(lang);
  const theme = THEME_BY_ID[word.theme];
  const wordLevel = LEVELS.find((item) => item.code === word.level) ?? LEVELS[0];
  const completed = LEVELS.filter(
    (item) => (state.quizBest[`level-${lang.code}-${item.code}`] ?? 0) >= 75
  ).length;
  const dailyProgress = Math.min(1, todayXp / 100);
  const days = lastNDays(7);
  const days14 = lastNDays(14);
  const weekTotal = days.reduce((sum, day) => sum + (state.daily[dayKey(day)] ?? 0), 0);
  const total14 = days14.reduce((sum, day) => sum + (state.daily[dayKey(day)] ?? 0), 0);
  const accuracy = state.answers === 0 ? 0 : Math.round((state.correct / state.answers) * 100);
  const max14 = Math.max(100, ...days14.map((day) => state.daily[dayKey(day)] ?? 0));

  const heroWords = [word];
  for (let offset = 1; heroWords.length < 3 && offset < lang.words.length; offset += 1) {
    const candidate = lang.words[(dayIndex() + offset * 17) % lang.words.length];
    if (!heroWords.some((item) => item.id === candidate.id)) heroWords.push(candidate);
  }

  const today = dayKey();
  const claimedToday = state.questClaims[today] ?? [];
  const quests = [
    {
      id: "xp30",
      title: "Заработай 30 XP",
      hint: "Слова, квизы и повторение",
      value: todayXp,
      target: 30,
      reward: 10,
      accent: "#ffd166",
      icon: <Zap size={16} />,
    },
    {
      id: "words5",
      title: "Выучи 5 слов",
      hint: "Добавь новые слова в коллекцию",
      value: todayWords,
      target: 5,
      reward: 15,
      accent: "var(--lime)",
      icon: <BookOpen size={16} />,
    },
    {
      id: "quiz1",
      title: "Пройди 1 квиз",
      hint: "Любой режим — на выбор",
      value: todayQuizzes,
      target: 1,
      reward: 20,
      accent: "var(--violet)",
      icon: <Gamepad2 size={16} />,
    },
  ];
  const claimedCount = quests.filter((quest) => claimedToday.includes(quest.id)).length;

  const pace = Math.max(weekTotal, 90);
  const leagueRows = [
    { name: "Мила", avatar: "🦉", xp: Math.round(pace * 1.35), you: false },
    { name: "Артём", avatar: "🐺", xp: Math.round(pace * 1.1), you: false },
    { name: "Соня", avatar: "🐱", xp: Math.round(pace * 0.85), you: false },
    { name: "Лев", avatar: "🦁", xp: Math.round(pace * 0.55), you: false },
    { name: state.name, avatar: state.avatar, xp: weekTotal, you: true },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="dash-grid page-stagger">
      {/* HERO */}
      <section className="panel hero span-12">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot" />
            {greeting()} · {humanDate()}
          </div>
          <h1 className="display display-hero hero-title">
            Учи язык.
            <br />
            <em>Живи</em>&nbsp;на&nbsp;нём.
          </h1>
          <p className="lead hero-lead balance">
            Маленькие шаги, живая практика и прогресс, который видно. Сегодня — ещё один
            день ближе к свободе в языке.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-lime" onClick={() => onNavigate("words")}>
              <BookOpen size={16} />
              Продолжить обучение
              <ArrowUpRight size={16} />
            </button>
            <button type="button" className="btn btn-glass" onClick={() => onNavigate("quizzes")}>
              <Gamepad2 size={16} />
              Пройти квиз
            </button>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <b>{level}</b>
              <span>уровень</span>
            </div>
            <div className="hero-meta-item">
              <b>{state.learned.length}</b>
              <span>{plural(state.learned.length, "слово выучено", "слова выучено", "слов выучено")}</span>
            </div>
            <div className="hero-meta-item">
              <b>{state.streak}</b>
              <span>{plural(state.streak, "день подряд", "дня подряд", "дней подряд")}</span>
            </div>
            <div className="hero-meta-item">
              <b>{accuracy}%</b>
              <span>точность</span>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-hidden>
          <div className="orb-stage">
            <div className="orb-ring" />
            <div className="orb-ring orb-ring-2" />
            <div className="orb-core">
              <span className="orb-lang">{lang.code.toUpperCase()}</span>
              <span className="orb-code">{lang.native}</span>
            </div>
            {heroWords.map((item, index) => (
              <div key={item.id} className={`word-chip word-chip-${index + 1}`}>
                <b>{item.word}</b>
                <span>{item.translation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAILY GOAL */}
      <section className="panel daily-card span-4">
        <div className="daily-top">
          <div>
            <div className="eyebrow">Цель дня</div>
            <h2 className="display display-card mt-2">Держи ритм</h2>
          </div>
          <span className="streak-pill">
            <Flame size={13} />
            {state.streak} дн.
          </span>
        </div>

        <ProgressRing value={dailyProgress} size={164} stroke={11} className="ring-wrap">
          <div className="ring-center">
            <b>{todayXp}</b>
            <span>из 100 XP</span>
          </div>
        </ProgressRing>

        <div className="week-bars">
          {days.map((day) => {
            const xp = state.daily[dayKey(day)] ?? 0;
            const today = isToday(day);
            return (
              <div key={day.toISOString()} className={`week-bar-wrap ${today ? "today" : ""}`}>
                <div
                  className={`week-bar ${xp > 0 ? "has-xp" : ""} ${today ? "today" : ""}`}
                  style={{ height: `${xp === 0 ? 7 : Math.min(100, 22 + (xp / 100) * 78)}%` }}
                  title={`${xp} XP`}
                />
                <small>{weekdayShortMon(day).slice(0, 2)}</small>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn-dark btn-block btn-sm"
          onClick={() => onNavigate("words")}
        >
          <Zap size={14} className="text-[#ffd166]" />
          Заработать XP
        </button>
      </section>

      {/* STATS */}
      <div className="stat-grid stat-grid-2 span-8">
        <StatTile
          icon={<Trophy size={15} />}
          label="Уровень"
          value={xpLevel.level}
          caption={`${xpLevel.title} · ${xpLevel.remaining} XP до следующего`}
          accent="var(--lime)"
        />
        <StatTile
          icon={<BookOpen size={15} />}
          label="Слова"
          value={state.learned.length}
          caption={`из ${lang.words.length} слов в словаре`}
          accent="var(--mint)"
        />
        <StatTile
          icon={<Flame size={15} />}
          label="Серия"
          value={`${state.streak} дн.`}
          caption={`лучшая серия — ${state.bestStreak} дн.`}
          accent="#ff9c8a"
        />
        <StatTile
          icon={<Target size={15} />}
          label="Точность"
          value={`${accuracy}%`}
          caption={`${state.correct} из ${state.answers} ответов`}
          accent="#8bd3ff"
        >
          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-white/35">
            <TrendingUp size={11} className="text-[#7ef0d4]" />
            {weekTotal} XP за неделю
          </div>
        </StatTile>
      </div>

      {/* DAILY QUESTS */}
      <section className="panel quests-card span-7">
        <div className="quests-head">
          <div>
            <div className="eyebrow eyebrow-lime">
              <span className="dot" />
              Ежедневные квесты
            </div>
            <h2 className="display display-card mt-2">Три шага к ритму</h2>
          </div>
          <span className="quests-count">
            {claimedCount}/{quests.length} получено
          </span>
        </div>

        <div className="quest-list">
          {quests.map((quest) => {
            const done = quest.value >= quest.target;
            const claimed = claimedToday.includes(quest.id);
            return (
              <div
                key={quest.id}
                className={`quest ${done ? "is-done" : ""} ${claimed ? "is-claimed" : ""}`}
              >
                <span
                  className="quest-icon"
                  style={{
                    color: quest.accent,
                    background: "rgba(255,255,255,0.035)",
                    borderColor: "var(--line)",
                  }}
                >
                  {quest.icon}
                </span>
                <div className="quest-body">
                  <div className="quest-row">
                    <b>{quest.title}</b>
                    <span>
                      {Math.min(quest.value, quest.target)} / {quest.target}
                    </span>
                  </div>
                  <div className="quest-hint">{quest.hint}</div>
                  <ProgressBar
                    value={Math.min(1, quest.value / quest.target)}
                    className="progress-thin mt-2"
                    color={done ? quest.accent : undefined}
                  />
                </div>
                <button
                  type="button"
                  className={`quest-claim ${done ? "is-ready" : ""} ${
                    claimed ? "is-claimed" : ""
                  }`}
                  disabled={!done || claimed}
                  onClick={() => claimQuest(quest.id, quest.reward)}
                >
                  {claimed ? (
                    <>
                      <Check size={12} />
                      получено
                    </>
                  ) : done ? (
                    <>
                      <Zap size={12} />
                      +{quest.reward} XP
                    </>
                  ) : (
                    <>+{quest.reward} XP</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="quests-foot">
          <span>
            <Flame size={12} />
            Серия {state.streak} дн.
          </span>
          <span>Новые квесты в 00:00</span>
        </div>
      </section>

      {/* LEAGUE */}
      <section className="panel league-card span-5">
        <div className="league-head">
          <div>
            <div className="eyebrow" style={{ color: "#ffd166" }}>
              <Trophy size={12} />
              Лига недели
            </div>
            <h2 className="display display-card mt-2">Ты в игре</h2>
          </div>
          <span className="league-badge">{league.name}</span>
        </div>

        <div className="league-list">
          {leagueRows.map((entry, index) => (
            <div
              key={entry.name}
              className={`league-row ${entry.you ? "is-you" : ""}`}
            >
              <span className={`league-rank rank-${index + 1}`}>{index + 1}</span>
              <span className="league-avatar">{entry.avatar}</span>
              <span className="league-name">
                {entry.you ? "Ты" : entry.name}
                {entry.you && <small>это ты</small>}
              </span>
              <span className="league-xp">{entry.xp} XP</span>
            </div>
          ))}
        </div>

        <div className="league-foot">
          <span>
            <TrendingUp size={12} />
            {weekTotal} XP за неделю
          </span>
          <span className="league-note">
            {league.next ? `Топ-3 → ${league.next.toLowerCase()}` : "Высшая лига"}
          </span>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="panel panel-pad span-8">
        <div className="roadmap-head">
          <div>
            <div className="eyebrow">Путь</div>
            <h2 className="display display-card mt-2">Твой маршрут</h2>
          </div>
          <span className="chip chip-ghost">
            <Check size={12} className="text-[var(--lime)]" />
            {completed}/{LEVELS.length} пройдено
          </span>
        </div>

        <div className="roadmap-rail">
          {LEVELS.map((item, index) => {
            const best = state.quizBest[`level-${lang.code}-${item.code}`] ?? 0;
            const done = best >= 75;
            const unlocked =
              index === 0 ||
              (state.quizBest[`level-${lang.code}-${LEVELS[index - 1].code}`] ?? 0) >= 75;
            const isCurrent = level === item.code;
            const learned = state.learned.filter((id) => id.startsWith(`${lang.code}-${item.code}-`)).length;
            const total = wordsForLevel(lang, item.code).length;
            const progress = total === 0 ? 0 : learned / total;
            return (
              <button
                key={item.code}
                type="button"
                className={`level-card ${done ? "is-done" : ""} ${isCurrent ? "is-current" : ""} ${
                  unlocked ? "" : "is-locked"
                }`}
                style={{ "--level-color": item.accent } as CSSProperties}
                disabled={!unlocked}
                title={!unlocked ? `Сначала набери 75% в ${LEVELS[index - 1]?.code}` : undefined}
                onClick={() => {
                  onPickLevel(item.code);
                  onNavigate("quizzes");
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="level-node">{done ? <Check size={16} /> : unlocked ? item.code : <Lock size={14} />}</span>
                  {done ? (
                    <span className="status-pill status-done">пройден</span>
                  ) : !unlocked ? (
                    <span className="status-pill status-lock">закрыт</span>
                  ) : isCurrent ? (
                    <span className="status-pill status-open">сейчас</span>
                  ) : (
                    <span className="status-pill status-open">доступен</span>
                  )}
                </div>
                <div>
                  <div className="level-name">{item.name}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[8px] font-bold text-white/35">
                    <span>
                      {learned}/{total} слов
                    </span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <ProgressBar value={progress} className="progress-thin mt-1.5" />
                </div>
                <div className="level-foot">
                  <span>{done ? `лучший ${best}%` : unlocked ? "открыть квиз" : "нужно 75%"}</span>
                  {unlocked ? <ChevronRight size={13} /> : <Lock size={11} />}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[10px] font-semibold text-white/35">
          Набери 75% в квизе — следующий уровень откроется автоматически
        </p>
      </section>

      {/* WORD OF THE DAY */}
      <section className="panel wotd span-4">
        <span className="wotd-mark">“</span>
        <div className="relative z-[1] flex flex-wrap items-center justify-between gap-2">
          <div className="eyebrow eyebrow-lime">
            <span className="dot" />
            Слово дня
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span
              className="chip chip-level"
              style={{ color: wordLevel.accent, borderColor: `${wordLevel.accent}44` }}
            >
              {word.level}
            </span>
            <span className="chip">
              {theme.emoji} {theme.name}
            </span>
          </div>
        </div>

        <h2 className="wotd-word relative z-[1]">{word.word}</h2>
        <p className="wotd-translation relative z-[1]">{word.translation}</p>
        <p className="wotd-example relative z-[1]">
          «{word.example}»
          <span>«{word.exampleTranslation}»</span>
        </p>

        <div className="wotd-foot relative z-[1]">
          <button
            type="button"
            className="icon-btn icon-btn-lime"
            onClick={() => speak(word.word, lang.speech)}
            aria-label={`Прослушать слово ${word.word}`}
          >
            <Volume2 size={17} />
          </button>
          <button
            type="button"
            className="btn btn-glass btn-sm"
            onClick={() => {
              onPickLevel(word.level);
              onNavigate("words");
            }}
          >
            Открыть {word.level}
            <ArrowUpRight size={13} />
          </button>
          <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">
            +15 XP
          </span>
        </div>
      </section>

      {/* DAILY CHALLENGE */}
      <section className="panel challenge-card span-7">
        <div className="challenge-copy">
          <div className="eyebrow" style={{ color: "var(--amber)" }}>
            <span
              className="dot"
              style={{ background: "var(--amber)", boxShadow: "0 0 12px var(--amber)" }}
            />
            Вызов дня
          </div>
          <h2 className="display display-card mt-2">Идеальный раунд</h2>
          <p>
            Пройди любой квиз без единой ошибки — и получи +25&nbsp;XP сверху. Без
            таймера и давления.
          </p>
          <div className="challenge-chips">
            <span className="chip">
              <Target size={12} /> 8 вопросов
            </span>
            <span className="chip">
              <Zap size={12} /> +25 XP
            </span>
            <span className="chip">
              <Trophy size={12} /> в лигу
            </span>
          </div>
          <button
            type="button"
            className="btn btn-lime btn-sm challenge-cta"
            onClick={() => onNavigate("quizzes")}
          >
            Принять вызов
            <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="challenge-art" aria-hidden>
          <div className="challenge-ring challenge-ring-1" />
          <div className="challenge-ring challenge-ring-2" />
          <div className="challenge-core">
            <Target size={30} />
          </div>
          <span className="challenge-spark challenge-spark-1" />
          <span className="challenge-spark challenge-spark-2" />
          <span className="challenge-spark challenge-spark-3" />
        </div>
      </section>

      {/* ACTIVITY */}
      <section className="panel activity-card span-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow">Активность</div>
            <h2 className="display display-card mt-2">Две недели</h2>
          </div>
          <span className="status-pill status-done">
            <TrendingUp size={11} />
            {weekTotal} XP
          </span>
        </div>

        {total14 === 0 ? (
          <div className="activity-empty">
            <span className="activity-empty-icon">
              <TrendingUp size={17} />
            </span>
            <b>Твой ритм начнётся сегодня</b>
            <p>Одно слово или один квиз — и здесь появится первый столбик.</p>
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={() => onNavigate("words")}
            >
              Сделать первый шаг
            </button>
          </div>
        ) : (
          <>
            <div className="activity-bars">
              {days14.map((day) => {
                const xp = state.daily[dayKey(day)] ?? 0;
                const today = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`activity-bar ${xp > 0 ? "has-xp" : ""} ${today ? "today" : ""}`}
                    style={{ height: `${xp === 0 ? 4 : Math.max(8, (xp / max14) * 100)}%` }}
                    title={`${day.getDate()}.${String(day.getMonth() + 1).padStart(2, "0")} · ${xp} XP`}
                  />
                );
              })}
            </div>
            <div className="activity-axis">
              <span>{days14[0].getDate()}.{String(days14[0].getMonth() + 1).padStart(2, "0")}</span>
              <span>сегодня</span>
            </div>
          </>
        )}
        <div className="activity-total">
          <b>{total14}</b>
          <span>XP за 2 недели</span>
        </div>
      </section>
    </div>
  );
}
