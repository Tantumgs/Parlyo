import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "../state/store";
import { calcXp, summarize, type Question, type Quiz } from "../lib/quiz";

const LETTERS = ["A", "B", "C", "D"];

function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* озвучка недоступна — не мешаем игре */
  }
}

export default function QuizPlayer({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const { finishQuiz, lang, showFlash } = useStore();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [gainedXp, setGainedXp] = useState(0);
  const recorded = useRef(false);

  const question: Question | undefined = quiz.questions[index];
  const total = quiz.questions.length;
  const answered = chosen !== null;

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
      setChosen(optionIndex);
      if (optionIndex === question.correct) setCorrectCount((count) => count + 1);
    },
    [answered, question]
  );

  useEffect(() => {
    if (quiz.kind === "voice" && question?.speak) {
      speak(question.speak, lang.speech);
    }
  }, [quiz.kind, question, lang.speech, index]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

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
    recorded.current = false;
    setIndex(0);
    setChosen(null);
    setCorrectCount(0);
    setDone(false);
    setGainedXp(0);
  };

  if (total === 0) {
    return (
      <div className="card page p-6 text-center">
        <div className="text-3xl">🤔</div>
        <p className="mt-2 text-white/70">Для этого языка пока не хватает слов, чтобы собрать куиз.</p>
        <button type="button" className="btn btn-primary mt-4" onClick={onExit}>
          К списку куизов
        </button>
      </div>
    );
  }

  if (done) {
    const { percent, verdict } = summarize(correctCount, total);
    const perfect = correctCount === total;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    return (
      <div className="card page p-6 text-center">
        <div className="text-5xl">{perfect ? "🏆" : percent >= 60 ? "🎉" : "💪"}</div>
        <h2 className="mt-3 text-2xl font-extrabold">{verdict}</h2>
        <p className="text-sm text-white/55">{quiz.title}</p>

        <div className="relative mx-auto mt-5 h-36 w-36">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="11" />
            <circle
              className="ring-progress"
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="url(#quizGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * percent) / 100}
            />
            <defs>
              <linearGradient id="quizGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c5cff" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center text-3xl font-black tabular-nums">{percent}%</div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-lg font-extrabold tabular-nums">{correctCount}</div>
            <div className="text-[11px] text-white/50">верно</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-lg font-extrabold tabular-nums">{total - correctCount}</div>
            <div className="text-[11px] text-white/50">ошибок</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-lg font-extrabold tabular-nums text-cyan-300">+{gainedXp}</div>
            <div className="text-[11px] text-white/50">XP</div>
          </div>
        </div>

        <p className="mt-3 text-xs text-white/45">
          5 XP за верный ответ{perfect ? " и 25 XP бонус за идеальный результат" : ""}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              showFlash("Ещё раз!");
              restart();
            }}
          >
            🔄 Пройти ещё раз
          </button>
          <button type="button" className="btn btn-ghost" onClick={onExit}>
            Другой куиз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="mb-3 flex items-center gap-3">
        <button type="button" className="btn btn-ghost !px-3 !py-2 text-sm" onClick={onExit}>
          ← Выход
        </button>
        <div className="progress-track h-2 flex-1">
          <div className="progress-fill" style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums text-white/60">
          {index + 1}/{total}
        </span>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "rgba(255,255,255,0.08)", color: quiz.accent }}>
            {quiz.emoji} {quiz.title}
          </span>
          <span className="text-[11px] text-white/45">{question.label}</span>
        </div>

        <div key={question.id} className="pop mt-4">
          {question.kind === "voice" && (
            <button
              type="button"
              onClick={() => question.speak && speak(question.speak, lang.speech)}
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-3xl shadow-lg shadow-orange-500/30 transition hover:scale-105"
              aria-label="Прослушать слово"
            >
              🔊
            </button>
          )}
          <h2
            className={`text-center font-extrabold ${
              question.kind === "context" ? "font-mono text-lg leading-relaxed" : "text-2xl"
            }`}
          >
            {question.prompt}
          </h2>
          {question.sub && <p className="mt-1.5 text-center text-sm text-white/50">{question.sub}</p>}
        </div>

        <div className="mt-5 grid gap-2.5">
          {question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.correct;
            const isChosen = optionIndex === chosen;
            let style = "border-white/12 bg-white/5 hover:border-white/30 hover:bg-white/10";
            if (answered) {
              if (isCorrect) style = "border-emerald-400/60 bg-emerald-400/15 text-emerald-200";
              else if (isChosen) style = "border-rose-400/60 bg-rose-400/15 text-rose-200 shake";
              else style = "border-white/8 bg-white/[0.02] text-white/40";
            }
            return (
              <button
                key={option}
                type="button"
                onClick={() => answer(optionIndex)}
                disabled={answered}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] font-semibold transition ${style}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/25 text-[12px] font-black">
                  {LETTERS[optionIndex]}
                </span>
                <span className="flex-1">{option}</span>
                {answered && isCorrect && <span>✓</span>}
                {answered && isChosen && !isCorrect && <span>✕</span>}
              </button>
            );
          })}
        </div>

        {answered && question.reveal && (
          <div className="pop mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-extrabold">{question.reveal.word}</span>
              <span className="text-white/40">—</span>
              <span className="text-lg text-cyan-300">{question.reveal.translation}</span>
              {question.kind === "voice" && (
                <button
                  type="button"
                  className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20"
                  onClick={() => speak(question.reveal!.word, lang.speech)}
                >
                  🔊 Ещё раз
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-white/70">{question.reveal.example}</p>
            <p className="text-sm text-white/45">{question.reveal.exampleTranslation}</p>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button type="button" className="btn btn-primary" onClick={advance} disabled={!answered}>
            {index + 1 >= total ? "Завершить куиз →" : "Далее →"}
          </button>
        </div>
      </div>
    </div>
  );
}