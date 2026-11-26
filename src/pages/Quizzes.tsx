import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Flame,
  MessageCircle,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { LEVELS, SCENARIOS, THEMES, type LevelCode } from "../data";
import {
  communicationQuiz,
  levelQuiz,
  scenarioQuiz,
  themeQuiz,
  voiceQuiz,
  type Quiz,
} from "../lib/quiz";
import { plural } from "../lib/plural";
import { useStore } from "../state/store";
import QuizPlayer from "../components/QuizPlayer";
import { PageHeader, ProgressRing } from "../components/ui";

const THEME_COLORS = [
  "#ffb86b",
  "#7ef0d4",
  "#8bd3ff",
  "#b8a1ff",
  "#d9ff63",
  "#ff9c8a",
  "#ffd166",
  "#6ee7b7",
];

export default function Quizzes({
  level,
  onPickLevel,
}: {
  level: LevelCode;
  onPickLevel: (level: LevelCode) => void;
}) {
  const { lang, state } = useStore();
  const [active, setActive] = useState<Quiz | null>(null);
  const levelInfo = LEVELS.find((item) => item.code === level) ?? LEVELS[0];
  const accuracy = state.answers === 0 ? 0 : Math.round((state.correct / state.answers) * 100);

  const cards = useMemo(
    () => [
      levelQuiz(lang, level, levelInfo.accent, levelInfo.about),
      voiceQuiz(lang, level, levelInfo.accent, "speechSynthesis" in window),
      communicationQuiz(lang, level, "#ffd166"),
      ...THEMES.map((item) => themeQuiz(lang, item.id, item.emoji, item.name)),
    ],
    [lang, level, levelInfo]
  );

  const demo = useMemo(
    () => lang.phrases.find((phrase) => phrase.scenario === "cafe") ?? lang.phrases[0],
    [lang]
  );

  if (active) return <QuizPlayer quiz={active} onExit={() => setActive(null)} />;

  const levelCard = cards[0];
  const voiceCard = cards[1];
  const commCard = cards[2];
  const themeCards = cards.slice(3);
  const levelBest = state.quizBest[levelCard.id] ?? 0;
  const voiceBest = state.quizBest[voiceCard.id] ?? 0;
  const commBest = state.quizBest[commCard.id] ?? 0;

  return (
    <div className="page page-stagger">
      <PageHeader
        eyebrow={`Тренировка · ${lang.native}`}
        title={
          <>
            Проверь себя.
            <br />
            Без страха ошибок.
          </>
        }
        description="Короткие квизы, живая обратная связь и XP за каждый верный ответ. Набери 75% — и следующий уровень откроется сам."
        side={
          <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.035] p-3 pr-5">
            <ProgressRing value={accuracy / 100} size={72} stroke={7}>
              <div className="grid h-full w-full place-items-center text-[13px] font-extrabold">
                {accuracy}%
              </div>
            </ProgressRing>
            <div>
              <div className="eyebrow" style={{ fontSize: 8 }}>
                Точность
              </div>
              <div className="mt-1 font-display text-[18px] font-semibold leading-none tracking-[-0.04em]">
                {state.quizzesDone}
                <span className="text-white/30">
                  {" "}
                  {plural(state.quizzesDone, "квиз", "квиза", "квизов")}
                </span>
              </div>
              <div className="mt-1 text-[9px] font-bold text-white/35">
                {state.correct} из {state.answers} ответов
              </div>
            </div>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="toolbar-scroll">
          {LEVELS.map((item) => {
            const activeLevel = item.code === level;
            return (
              <button
                key={item.code}
                type="button"
                className={`chip chip-level ${activeLevel ? "chip-active" : ""}`}
                onClick={() => onPickLevel(item.code)}
                style={
                  activeLevel
                    ? { background: item.accent, borderColor: item.accent, color: "#08110a" }
                    : { color: item.accent, borderColor: `${item.accent}33` }
                }
              >
                {item.code}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
          <Target size={13} className="text-[var(--lime)]" />
          <span>
            {levelInfo.code} · {levelInfo.name}
          </span>
        </div>
      </div>

      <div className="quiz-grid">
        <button
          type="button"
          className="quiz-card quiz-card-featured"
          style={{ "--quiz-glow": `${levelInfo.accent}22` } as CSSProperties}
          onClick={() => setActive(levelCard)}
        >
          <div className="quiz-feature-copy relative z-[1]">
            <div className="eyebrow" style={{ color: levelInfo.accent }}>
              <span className="dot" style={{ background: levelInfo.accent, boxShadow: `0 0 12px ${levelInfo.accent}` }} />
              Квиз уровня {levelInfo.code}
            </div>
            <h3 className="mt-3">Следующая ступень уже близко</h3>
            <p>{levelInfo.about} Восемь вопросов, которые покажут, что уже отложилось.</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="chip">
                <Sparkles size={12} className="text-[var(--lime)]" />
                8 вопросов
              </span>
              <span className="chip">
                <Target size={12} className="text-[var(--lime)]" />
                75% для перехода
              </span>
              {levelBest > 0 && (
                <span className="quiz-score">
                  <Trophy size={11} />
                  лучший {levelBest}%
                </span>
              )}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--lime)] px-5 py-3 text-[12px] font-extrabold text-[#0a0d05] shadow-[0_18px_40px_-18px_rgba(217,255,99,0.5)]">
              {levelBest >= 75 ? "Пройти ещё раз" : "Начать квиз"}
              <ArrowUpRight size={15} />
            </div>
          </div>
          <div className="quiz-feature-art">
            <div className="quiz-orb" style={{ borderColor: `${levelInfo.accent}44` }}>
              <span style={{ color: levelInfo.accent }}>{levelInfo.code}</span>
            </div>
          </div>
        </button>

        <button
          type="button"
          className="quiz-card panel-violet"
          style={{ "--quiz-glow": "rgba(184,161,255,0.13)" } as CSSProperties}
          onClick={() => setActive(voiceCard)}
        >
          <div className="quiz-card-head">
            <span className="quiz-emoji">🔊</span>
            {voiceBest > 0 ? (
              <span className="quiz-score">
                <Trophy size={11} />
                {voiceBest}%
              </span>
            ) : (
              <span className="status-pill status-open">
                <AudioLines size={11} />
                аудио
              </span>
            )}
          </div>
          <div className="quiz-card-body">
            <h3>Голосовой квиз</h3>
            <p>Слушай слово и выбирай перевод. Уши тоже умеют учиться.</p>
          </div>
          <div className="quiz-card-foot">
            <span className="quiz-start">Слушать и отвечать</span>
            <span className="quiz-arrow">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </button>

        <button
          type="button"
          className="quiz-card quiz-card-comm"
          style={{ "--quiz-glow": "rgba(255,209,102,0.16)" } as CSSProperties}
          onClick={() => setActive(commCard)}
        >
          <div className="quiz-comm-copy">
            <div className="eyebrow" style={{ color: "#ffd166" }}>
              <span
                className="dot"
                style={{ background: "#ffd166", boxShadow: "0 0 12px #ffd166" }}
              />
              Живые фразы
            </div>
            <h3 className="mt-3">Фразы и диалоги</h3>
            <p>
              Что спросят в кафе, на работе или в поездке — и что ответить. Готовые
              реплики для реального разговора.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="chip">
                <MessageCircle size={12} className="text-[#ffd166]" />
                {lang.phrases.length} фраз
              </span>
              <span className="chip">
                <Target size={12} className="text-[#ffd166]" />
                {commCard.questions.length} вопросов
              </span>
              {commBest > 0 && (
                <span className="quiz-score" style={{ color: "#ffd166", background: "rgba(255,209,102,0.12)" }}>
                  <Trophy size={11} />
                  лучший {commBest}%
                </span>
              )}
            </div>
            <div className="quiz-comm-cta">
              Открыть диалоги
              <ArrowUpRight size={15} />
            </div>
          </div>
          <div className="quiz-comm-art" aria-hidden>
            <div className="comm-orb">💬</div>
            <div className="comm-bubble comm-bubble-1">{demo.prompt}</div>
            <div className="comm-bubble comm-bubble-2">{demo.reply}</div>
            <div className="comm-glow" />
          </div>
        </button>
      </div>

      <div className="quiz-section-title">
        <h2>Живое общение</h2>
        <span className="text-[10px] font-bold text-white/35">
          {SCENARIOS.length} сценариев · вопросы и ответы
        </span>
      </div>

      <div className="scenario-grid">
        {SCENARIOS.map((scenario) => {
          const quiz = scenarioQuiz(lang, scenario);
          const best = state.quizBest[quiz.id] ?? 0;
          return (
            <button
              key={scenario.id}
              type="button"
              className="quiz-card scenario-card"
              style={{ "--quiz-glow": `${scenario.accent}22` } as CSSProperties}
              onClick={() => setActive(quiz)}
            >
              <div className="quiz-card-head">
                <span className="quiz-emoji">{scenario.emoji}</span>
                {best > 0 ? (
                  <span
                    className="quiz-score"
                    style={{ color: scenario.accent, background: `${scenario.accent}18` }}
                  >
                    <Trophy size={10} />
                    {best}%
                  </span>
                ) : (
                  <span className="status-pill status-lock">{quiz.questions.length} вопросов</span>
                )}
              </div>
              <div className="quiz-card-body">
                <h3>{scenario.name}</h3>
                <p>{scenario.about}</p>
              </div>
              <div className="quiz-card-foot">
                <span className="quiz-start" style={{ color: scenario.accent }}>
                  Поговорить
                </span>
                <span className="quiz-arrow">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="quiz-section-title">
        <h2>По темам</h2>
        <span className="text-[10px] font-bold text-white/35">
          {THEMES.length} наборов · слова всех уровней
        </span>
      </div>

      <div className="theme-quiz-grid">
        {themeCards.map((quiz, index) => {
          const color = THEME_COLORS[index % THEME_COLORS.length];
          const best = state.quizBest[quiz.id] ?? 0;
          return (
            <button
              key={quiz.id}
              type="button"
              className="quiz-card theme-quiz"
              style={{ "--quiz-glow": `${color}1f` } as CSSProperties}
              onClick={() => setActive(quiz)}
            >
              <div className="quiz-card-head">
                <span className="quiz-emoji">{quiz.emoji}</span>
                {best > 0 ? (
                  <span className="quiz-score" style={{ color, background: `${color}18` }}>
                    <Trophy size={10} />
                    {best}%
                  </span>
                ) : (
                  <span className="status-pill status-lock">новый</span>
                )}
              </div>
              <div className="quiz-card-body">
                <h3>{quiz.title}</h3>
                <p>{quiz.subtitle}</p>
              </div>
              <div className="quiz-card-foot">
                <span className="quiz-start" style={{ color }}>
                  Играть
                </span>
                <span className="quiz-arrow">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="panel mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="empty-icon" style={{ width: 42, height: 42, borderRadius: 14 }}>
            <Trophy size={19} />
          </span>
          <div>
            <div className="text-[12px] font-extrabold">Лучший результат</div>
            <div className="text-[10px] font-semibold text-white/35">
              {Math.max(0, ...Object.values(state.quizBest))}% · держи планку
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/35">
          <Flame size={13} className="text-[#ff9c8a]" />
          серия {state.streak} дн.
          <span className="h-3 w-px bg-white/10" />
          {state.xp.toLocaleString()} XP всего
        </div>
      </div>
    </div>
  );
}
