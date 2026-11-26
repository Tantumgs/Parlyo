import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  Keyboard,
  RefreshCw,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useStore } from "../state/store";
import { calcXp, summarize, type Question, type Quiz } from "../lib/quiz";
import { speak } from "../lib/speech";
import { ProgressRing } from "./ui";

const LETTERS = ["A", "B", "C", "D"];

function Confetti({ count }: { count: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const palette = ["#d9ff63", "#7ef0d4", "#ffd166", "#ff9c8a", "#b8a1ff", "#8bd3ff"];
        return {
          left: Math.random() * 100,
          delay: Math.random() * 1.1,
          duration: 2.6 + Math.random() * 1.8,
          drift: (Math.random() - 0.5) * 260,
          color: palette[index % palette.length],
          width: 5 + Math.random() * 5,
          height: 8 + Math.random() * 8,
          rotate: Math.random() * 180,
        };
      }),
    [count]
  );

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((piece, index) => (
        <i
          key={index}
          style={
            {
              left: `${piece.left}%`,
              background: piece.color,
              width: piece.width,
              height: piece.height,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              transform: `rotate(${piece.rotate}deg)`,
              "--drift": `${piece.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function QuizPlayer({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const { finishQuiz, lang, state } = useStore();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>(() =>
    Array(quiz.questions.length).fill(null)
  );
  const [done, setDone] = useState(false);
  const [gainedXp, setGainedXp] = useState(0);
  const recorded = useRef(false);
  const previousBest = useRef(state.quizBest[quiz.id] ?? 0);

  const question: Question | undefined = quiz.questions[index];
  const total = quiz.questions.length;
  const answered = chosen !== null;
  const maxXp = calcXp(total, total);

  const advance = useCallback(() => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((current) => current + 1);
    setChosen(null);
  }, [index, total]);

  const answer = useCallback(
    (optionIndex: number) => {
      if (answered || !question) return;
      const correct = optionIndex === question.correct;
      setChosen(optionIndex);
      setResults((current) => {
        const next = [...current];
        next[index] = correct;
        return next;
      });
      if (correct) setCorrectCount((count) => count + 1);
    },
    [answered, question, index]
  );

  useEffect(() => {
    if ((quiz.kind === "voice" || question?.kind === "reply") && question?.speak) {
      speak(question.speak, lang.speech);
    }
  }, [quiz.kind, question, lang.speech, index]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (done) return;
      if (!answered) {
        const byNumber = Number(event.key) - 1;
        const byLetter = LETTERS.indexOf(event.key.toUpperCase());
        const option = byNumber >= 0 && byNumber < 4 ? byNumber : byLetter;
        if (option >= 0 && option < 4) {
          event.preventDefault();
          answer(option);
        }
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, answer, advance, done]);

  useEffect(() => {
    if (!done || recorded.current) return;
    recorded.current = true;
    const xp = calcXp(correctCount, total);
    setGainedXp(xp);
    finishQuiz({
      quizId: quiz.id,
      correct: correctCount,
      total,
      xp,
      percent: total === 0 ? 0 : Math.round((correctCount / total) * 100),
    });
  }, [done, correctCount, total, finishQuiz, quiz.id]);

  const restart = () => {
    previousBest.current = Math.max(
      previousBest.current,
      total === 0 ? 0 : Math.round((correctCount / total) * 100)
    );
    recorded.current = false;
    setIndex(0);
    setChosen(null);
    setCorrectCount(0);
    setResults(Array(total).fill(null));
    setDone(false);
    setGainedXp(0);
  };

  if (total === 0) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-shell">
          <header className="quiz-topbar">
            <button type="button" className="quiz-exit" onClick={onExit}>
              <X size={15} />
              <span>Выйти</span>
            </button>
          </header>
          <div className="result-wrap">
            <div className="panel result-card">
              <div className="result-emoji">🤔</div>
              <h2 className="result-title">Пока не из чего собрать квиз</h2>
              <p className="result-sub">
                Для этого языка и уровня не хватает слов. Попробуй другой уровень или тему.
              </p>
              <div className="result-actions">
                <button type="button" className="btn btn-lime" onClick={onExit}>
                  К списку квизов
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    const { percent, verdict } = summarize(correctCount, total);
    const perfect = correctCount === total;
    const isRecord = percent > previousBest.current && previousBest.current > 0;
    return (
      <div className="quiz-overlay">
        {percent >= 60 && <Confetti count={perfect ? 56 : 30} />}
        <div className="quiz-shell">
          <header className="quiz-topbar">
            <button type="button" className="quiz-exit" onClick={onExit}>
              <X size={15} />
              <span>Выйти</span>
            </button>
            <div className="quiz-progress">
              <div className="quiz-segments">
                {results.map((result, resultIndex) => (
                  <span
                    key={resultIndex}
                    className={`quiz-seg ${result === true ? "correct" : result === false ? "wrong" : ""}`}
                  />
                ))}
              </div>
              <span className="quiz-counter">{total} / {total}</span>
            </div>
            <span className="quiz-xp">
              <Zap size={13} /> +{gainedXp}
            </span>
          </header>

          <div className="result-wrap">
            <div className="panel result-card">
              {isRecord && (
                <div className="record-badge">
                  <Sparkles size={12} />
                  новый личный рекорд
                </div>
              )}
              <div className="result-emoji">{perfect ? "🏆" : percent >= 60 ? "🎉" : "💪"}</div>
              <h2 className="result-title">{verdict}</h2>
              <p className="result-sub">{quiz.title} · {quiz.emoji}</p>

              <ProgressRing value={percent / 100} size={180} stroke={10} className="result-ring-wrap">
                <div className="result-percent">
                  <b>{percent}%</b>
                  <span>результат</span>
                </div>
              </ProgressRing>

              <div className="result-stats">
                <div className="result-stat">
                  <b className="text-[var(--lime)]">{correctCount}</b>
                  <span>верно</span>
                </div>
                <div className="result-stat">
                  <b className="text-[#ff9c8a]">{total - correctCount}</b>
                  <span>ошибок</span>
                </div>
                <div className="result-stat">
                  <b className="text-[var(--amber)]">+{gainedXp}</b>
                  <span>XP</span>
                </div>
              </div>

              <p className="result-note">
                5 XP за каждый верный ответ
                {perfect ? " · +25 XP бонус за идеальный раунд" : " · +25 XP бонус за 100%"}
              </p>

              <div className="result-actions">
                <button type="button" className="btn btn-lime" onClick={restart}>
                  <RefreshCw size={15} />
                  Ещё раз
                </button>
                <button type="button" className="btn btn-glass" onClick={onExit}>
                  Другой квиз
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const contextParts = question.kind === "context" ? question.prompt.split("____") : null;

  return (
    <div className="quiz-overlay">
      <div className="quiz-shell">
        <header className="quiz-topbar">
          <button type="button" className="quiz-exit" onClick={onExit}>
            <X size={15} />
            <span>Выйти</span>
          </button>
          <div className="quiz-progress">
            <div className="quiz-segments" aria-hidden>
              {quiz.questions.map((item, segmentIndex) => (
                <span
                  key={item.id}
                  className={`quiz-seg ${
                    results[segmentIndex] === true
                      ? "correct"
                      : results[segmentIndex] === false
                        ? "wrong"
                        : segmentIndex === index
                          ? "current"
                          : ""
                  }`}
                />
              ))}
            </div>
            <span className="quiz-counter">
              {index + 1} / {total}
            </span>
          </div>
          <span className="quiz-xp" title="Максимум XP за этот квиз">
            <Zap size={13} /> +{maxXp}
          </span>
        </header>

        <div className="quiz-stage">
          <div className="panel quiz-card-main" key={question.id}>
            <div className="quiz-tags">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="chip"
                  style={{ color: quiz.accent, borderColor: `${quiz.accent}44` }}
                >
                  {quiz.emoji} {quiz.title}
                </span>
                {question.speak && question.kind !== "voice" && (
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 30, height: 30, borderRadius: 10 }}
                    onClick={() => question.speak && speak(question.speak, lang.speech)}
                    aria-label="Прослушать слово"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
              <span className="quiz-question-label">{question.label}</span>
            </div>

            <div className="quiz-question">
              {question.kind === "voice" && (
                <button
                  type="button"
                  className="audio-orb"
                  onClick={() => question.speak && speak(question.speak, lang.speech)}
                  aria-label="Прослушать слово ещё раз"
                >
                  <Volume2 size={38} />
                </button>
              )}
              {contextParts ? (
                <p className="question-context">
                  {contextParts[0]}
                  <mark>____</mark>
                  {contextParts[1]}
                </p>
              ) : (
                <h2
                  className={`question-text ${
                    question.kind === "reply" || question.kind === "phrase"
                      ? "question-text-long"
                      : ""
                  }`}
                >
                  {question.prompt}
                </h2>
              )}
              {question.sub && <p className="question-sub">{question.sub}</p>}
            </div>

            <div
              className={`options-grid ${
                question.kind === "reply" || question.kind === "phrase"
                  ? "options-grid-dialogue"
                  : ""
              }`}
            >
              {question.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === question.correct;
                const isChosen = optionIndex === chosen;
                const stateClass = answered
                  ? isCorrect
                    ? "correct"
                    : isChosen
                      ? "incorrect"
                      : "muted"
                  : "";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answer(optionIndex)}
                    disabled={answered}
                    className={`option ${stateClass}`}
                  >
                    <span className="option-letter">{LETTERS[optionIndex]}</span>
                    <span className="option-text">{option}</span>
                    {answered && isCorrect && (
                      <span className="option-mark ok">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                    {answered && isChosen && !isCorrect && (
                      <span className="option-mark no">
                        <X size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {answered && question.reveal && (
              <div className="reveal">
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="reveal-word">{question.reveal.word}</span>
                  <span className="reveal-translation">{question.reveal.translation}</span>
                </div>
                {question.kind === "voice" && (
                  <button
                    type="button"
                    className="chip"
                    onClick={() => question.reveal && speak(question.reveal.word, lang.speech)}
                  >
                    <Volume2 size={12} />
                    ещё раз
                  </button>
                )}
                <div className="reveal-example">
                  «{question.reveal.example}»
                  <span>«{question.reveal.exampleTranslation}»</span>
                </div>
              </div>
            )}

            {answered && question.dialogue && (
              <div className="reveal dialogue-reveal">
                <div className="dialogue-line">
                  <span className="dialogue-role">—</span>
                  <div className="dialogue-copy">
                    <div className="dialogue-text">{question.dialogue.prompt}</div>
                    <div className="dialogue-translation">{question.dialogue.promptTranslation}</div>
                  </div>
                  <button
                    type="button"
                    className="icon-btn dialogue-audio"
                    onClick={() =>
                      question.dialogue && speak(question.dialogue.prompt, lang.speech)
                    }
                    aria-label="Прослушать вопрос"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="dialogue-line dialogue-line-reply">
                  <span className="dialogue-role">→</span>
                  <div className="dialogue-copy">
                    <div className="dialogue-text">{question.dialogue.reply}</div>
                    <div className="dialogue-translation">{question.dialogue.replyTranslation}</div>
                  </div>
                  <button
                    type="button"
                    className="icon-btn dialogue-audio"
                    onClick={() =>
                      question.dialogue && speak(question.dialogue.reply, lang.speech)
                    }
                    aria-label="Прослушать ответ"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="quiz-actions">
              <span className="quiz-hint">
                <Keyboard size={13} />
                1–4 выбрать · Enter дальше
              </span>
              <button
                type="button"
                className="btn btn-lime"
                onClick={advance}
                disabled={!answered}
              >
                {index + 1 >= total ? (
                  <>
                    Завершить квиз
                    <Trophy size={15} />
                  </>
                ) : (
                  <>
                    Далее
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="quiz-bottom-note">
          {quiz.questions.length} вопросов · +{maxXp} XP максимум · без таймера, в своём темпе
        </div>
      </div>
    </div>
  );
}
