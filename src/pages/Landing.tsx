import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Flame,
  Gamepad2,
  Globe,
  Heart,
  Layers,
  LineChart,
  MessageCircle,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { LANGUAGES, LEVELS, SCENARIOS } from "../data";
import { Logo } from "../components/ui";

const LANG_ACCENTS: Record<string, string> = {
  en: "#d9ff63",
  es: "#ffd166",
  fr: "#8bd3ff",
  de: "#ff9c8a",
};

const HERO_WORDS = [
  { code: "EN", word: "itinerary", translation: "маршрут поездки", accent: "#d9ff63", className: "word-a" },
  { code: "ES", word: "alojamiento", translation: "жильё", accent: "#ffd166", className: "word-b" },
  { code: "FR", word: "saveur", translation: "вкус, аромат", accent: "#8bd3ff", className: "word-c" },
  { code: "DE", word: "Lebensraum", translation: "среда обитания", accent: "#ff9c8a", className: "word-d" },
];

const FEATURES = [
  {
    icon: BookOpen,
    accent: "#d9ff63",
    title: "Слова, которые остаются",
    text: "Не случайный набор, а выверенный словарь по темам и уровням CEFR. С переводом, примером и озвучкой.",
    meta: "5 уровней · 8 тем",
  },
  {
    icon: MessageCircle,
    accent: "#ffd166",
    title: "Фразы для реальной жизни",
    text: "Знакомство, кафе, дорога, работа, small talk и мнение. Не «учебные» диалоги, а то, что действительно говорят.",
    meta: "6 сценариев · готовые ответы",
  },
  {
    icon: Gamepad2,
    accent: "#b8a1ff",
    title: "Квизы без страха ошибок",
    text: "Перевод, контекст, аудио и живые реплики. Мгновенная обратная связь и +25 XP за идеальный раунд.",
    meta: "4 формата · без таймера",
  },
  {
    icon: LineChart,
    accent: "#7ef0d4",
    title: "Прогресс, который видно",
    text: "XP, серия дней, точность, тепловая карта и достижения. Каждый маленький шаг остаётся в истории.",
    meta: "XP · серия · достижения",
  },
  {
    icon: Globe,
    accent: "#8bd3ff",
    title: "Четыре языка — один ритм",
    text: "Английский, испанский, французский и немецкий. Переключайся в один клик и сохраняй весь прогресс.",
    meta: "EN · ES · FR · DE",
  },
  {
    icon: Heart,
    accent: "#ff9c8a",
    title: "Твой темп. Твоя мотивация.",
    text: "Без давления, дедлайнов и бесконечных уведомлений. Parlyo подстраивается под день, а не наоборот.",
    meta: "5 минут в день — уже результат",
  },
];

const STEPS = [
  {
    icon: Target,
    title: "Выбери язык и уровень",
    text: "Четыре языка и пять уровней CEFR. Начни с A1 или продолжи с того места, где остановился.",
  },
  {
    icon: Layers,
    title: "Собирай слова и фразы",
    text: "Учи слова через примеры, контекст и озвучку. Сразу применяй их в готовых репликах.",
  },
  {
    icon: Mic,
    title: "Проживай диалоги",
    text: "Тренируй реальные сценарии: что спросят, что ответить и как не потеряться в разговоре.",
  },
];

function Count({ value }: { value: number }) {
  return <b>{value.toLocaleString("ru-RU")}</b>;
}

export default function Landing({ onEnter }: { onEnter: (language?: string) => void }) {
  const [preview, setPreview] = useState(0);
  const lang = LANGUAGES[preview];
  const accent = LANG_ACCENTS[lang.code] ?? "#d9ff63";

  const totalWords = useMemo(
    () => LANGUAGES.reduce((sum, item) => sum + item.words.length, 0),
    []
  );
  const totalPhrases = useMemo(
    () => LANGUAGES.reduce((sum, item) => sum + item.phrases.length, 0),
    []
  );

  const sampleWord = useMemo(() => {
    const preferred = lang.words.find((word) => word.level === "B2" && word.word.length <= 13);
    return preferred ?? lang.words.find((word) => word.level === "B1") ?? lang.words[0];
  }, [lang]);

  const samplePhrase = useMemo(
    () => lang.phrases.find((phrase) => phrase.scenario === "cafe") ?? lang.phrases[0],
    [lang]
  );

  const metrics = [
    { value: LANGUAGES.length, label: "языка" },
    { value: LEVELS.length, label: "уровней CEFR" },
    { value: totalWords, label: "слов в словаре" },
    { value: totalPhrases, label: "живых фраз" },
    { value: SCENARIOS.length, label: "сценариев общения" },
  ];

  return (
    <div className="landing">
      <div className="ambient" aria-hidden />
      <div className="ambient-grid" aria-hidden />
      <div className="grain" aria-hidden />

      <header className="landing-header">
        <a href="#top" className="landing-logo" aria-label="Parlyo — на главную">
          <Logo />
        </a>
        <nav className="landing-nav" aria-label="Разделы презентации">
          <a href="#product">Продукт</a>
          <a href="#features">Возможности</a>
          <a href="#method">Метод</a>
          <a href="#languages">Языки</a>
        </nav>
        <button type="button" className="btn btn-lime landing-header-cta" onClick={() => onEnter()}>
          Открыть приложение
          <ArrowUpRight size={15} />
        </button>
      </header>

      <main>
        <section className="landing-hero" id="top">
          <div className="landing-hero-copy">
            <div className="eyebrow">
              <span className="dot" />
              Parlyo · язык, ритм, прогресс
            </div>
            <h1 className="display landing-title">
              Не учи язык.
              <br />
              <em>Живи</em> на нём.
            </h1>
            <p className="lead landing-lead">
              Parlyo превращает слова, фразы и диалоги в ежедневный ритуал. Пять уровней,
              четыре языка и шесть живых сценариев — с прогрессом, который видно.
            </p>
            <div className="landing-cta-row">
              <button type="button" className="btn btn-lime landing-cta" onClick={() => onEnter()}>
                Начать бесплатно
                <ArrowRight size={16} />
              </button>
              <a href="#product" className="btn btn-glass landing-cta-secondary">
                <Play size={15} />
                Смотреть демо
              </a>
            </div>
            <div className="landing-hero-note">
              <Check size={13} />
              Без карты
              <span />
              <Check size={13} />
              4 языка
              <span />
              <Check size={13} />
              5 уровней
            </div>

            <div className="landing-hero-stats">
              <div>
                <Count value={totalWords} />
                <span>слов и примеров</span>
              </div>
              <div>
                <Count value={totalPhrases} />
                <span>фраз для диалогов</span>
              </div>
              <div>
                <Count value={SCENARIOS.length} />
                <span>жизненных сценариев</span>
              </div>
            </div>
          </div>

          <div className="landing-hero-art" aria-hidden>
            <div className="landing-orbit">
              <div className="orbit-ring orbit-ring-1" />
              <div className="orbit-ring orbit-ring-2" />
              <div className="orbit-ring orbit-ring-3" />
              <div className="orbit-dot orbit-dot-1" />
              <div className="orbit-dot orbit-dot-2" />
              <div className="orbit-dot orbit-dot-3" />
              <div className="orbit-core">
                <span>P</span>
                <small>parlyo</small>
              </div>
              {HERO_WORDS.map((word) => (
                <div
                  key={word.code}
                  className={`orbit-word ${word.className}`}
                  style={{ "--word-accent": word.accent } as CSSProperties}
                >
                  <span className="orbit-word-code">{word.code}</span>
                  <b>{word.word}</b>
                  <span className="orbit-word-translation">{word.translation}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-metrics" aria-label="Parlyo в цифрах">
          {metrics.map((metric) => (
            <div key={metric.label} className="landing-metric">
              <Count value={metric.value} />
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <section className="landing-section" id="product">
          <div className="landing-section-head">
            <div className="eyebrow eyebrow-lime">
              <span className="dot" />
              Продукт
            </div>
            <h2 className="display landing-section-title">
              Один экран.
              <br />
              <em>Весь твой язык.</em>
            </h2>
            <p className="lead">
              Слова, фразы, квизы и прогресс собраны в одном спокойном интерфейсе. Ничего
              лишнего — только то, что двигает вперёд.
            </p>
          </div>

          <div className="landing-window">
            <div className="landing-window-bar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="window-url">parlyo.app / {lang.code}</span>
              <span className="window-live">
                <span className="dot" />
                живой превью
              </span>
            </div>

            <div className="landing-window-body">
              <aside className="landing-mini-side">
                <Logo compact />
                <div className="landing-mini-nav">
                  <span className="active">
                    <Sparkles size={12} />
                    Главная
                  </span>
                  <span>
                    <BookOpen size={12} />
                    Слова
                  </span>
                  <span>
                    <Gamepad2 size={12} />
                    Квизы
                  </span>
                  <span>
                    <Trophy size={12} />
                    Профиль
                  </span>
                </div>
                <div className="landing-mini-langs">
                  {LANGUAGES.map((item, index) => (
                    <button
                      key={item.code}
                      type="button"
                      className={index === preview ? "active" : ""}
                      style={
                        index === preview
                          ? {
                              borderColor: `${LANG_ACCENTS[item.code]}66`,
                              color: LANG_ACCENTS[item.code],
                              background: `${LANG_ACCENTS[item.code]}14`,
                            }
                          : undefined
                      }
                      onClick={() => setPreview(index)}
                      aria-label={`Показать ${item.native}`}
                    >
                      {item.code.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="landing-mini-goal">
                  <span className="eyebrow">Цель дня</span>
                  <b>42 / 100 XP</b>
                  <div className="landing-mini-track">
                    <i style={{ width: "42%" }} />
                  </div>
                </div>
              </aside>

              <div className="landing-mini-main">
                <div className="landing-mini-hero">
                  <div>
                    <div className="eyebrow">
                      <span className="dot" />
                      Добрый вечер · {lang.native}
                    </div>
                    <h3>
                      Учи язык.
                      <br />
                      <em>Живи</em> на нём.
                    </h3>
                    <p>
                      Сегодня — ещё один день ближе к свободе в языке. Маленькие шаги,
                      живая практика и прогресс, который видно.
                    </p>
                    <div className="landing-mini-actions">
                      <span className="landing-mini-btn">Продолжить обучение <ArrowUpRight size={12} /></span>
                      <span className="landing-mini-ghost">Пройти квиз</span>
                    </div>
                  </div>
                  <div className="landing-mini-orb" style={{ "--mini-accent": accent } as CSSProperties}>
                    <span>{lang.code.toUpperCase()}</span>
                  </div>
                </div>

                <div className="landing-mini-grid">
                  <div className="landing-mini-card">
                    <span className="eyebrow">Слово дня</span>
                    <b className="landing-mini-word">{sampleWord.word}</b>
                    <span className="landing-mini-translation">{sampleWord.translation}</span>
                    <p>«{sampleWord.example}»</p>
                  </div>
                  <div className="landing-mini-card landing-mini-phrase">
                    <span className="eyebrow">Фраза дня</span>
                    <b>{samplePhrase.prompt}</b>
                    <span>{samplePhrase.reply}</span>
                    <p>{samplePhrase.promptTranslation}</p>
                  </div>
                  <div className="landing-mini-card landing-mini-progress">
                    <span className="eyebrow">Твой прогресс</span>
                    <div className="landing-mini-levels">
                      {LEVELS.map((level, index) => (
                        <i
                          key={level.code}
                          className={index < 2 ? "done" : ""}
                          style={index < 2 ? { background: level.accent } : undefined}
                        >
                          {level.code}
                        </i>
                      ))}
                    </div>
                    <div className="landing-mini-stat-row">
                      <span>
                        <Flame size={11} /> 12 дней
                      </span>
                      <span>
                        <Zap size={11} /> 1 240 XP
                      </span>
                      <span>
                        <Star size={11} /> 86%
                      </span>
                    </div>
                    <p>Следующий уровень — B1. Ещё 3 квиза до цели.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="features">
          <div className="landing-section-head">
            <div className="eyebrow eyebrow-lime">
              <span className="dot" />
              Возможности
            </div>
            <h2 className="display landing-section-title">
              Всё, чтобы
              <br />
              <em>заговорить.</em>
            </h2>
            <p className="lead">
              Мы убрали хаос из изучения языка. Осталось главное: слова, контекст,
              диалоги и ощущение движения.
            </p>
          </div>

          <div className="landing-bento">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`landing-feature landing-feature-${index + 1}`}
                  style={{ "--feature-accent": feature.accent } as CSSProperties}
                >
                  <span className="landing-feature-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <span className="landing-feature-meta">{feature.meta}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-section" id="method">
          <div className="landing-section-head">
            <div className="eyebrow eyebrow-lime">
              <span className="dot" />
              Метод
            </div>
            <h2 className="display landing-section-title">
              Слово → фраза
              <br />
              <em>→ разговор.</em>
            </h2>
            <p className="lead">
              Parlyo ведёт от узнавания к использованию. Ты не просто запоминаешь —
              ты сразу видишь, где это пригодится.
            </p>
          </div>

          <div className="landing-steps">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="landing-step">
                  <span className="landing-step-num">0{index + 1}</span>
                  <span className="landing-step-icon">
                    <Icon size={18} />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-section" id="languages">
          <div className="landing-section-head">
            <div className="eyebrow eyebrow-lime">
              <span className="dot" />
              Языки
            </div>
            <h2 className="display landing-section-title">
              Четыре языка.
              <br />
              <em>Один ритм.</em>
            </h2>
            <p className="lead">
              Выбери язык — и Parlyo соберёт для него словарь, фразы, озвучку и
              сценарии. Прогресс сохраняется отдельно для каждого.
            </p>
          </div>

          <div className="landing-langs">
            {LANGUAGES.map((item) => {
              const itemAccent = LANG_ACCENTS[item.code] ?? "#d9ff63";
              const word = item.words.find((candidate) => candidate.level === "B1") ?? item.words[0];
              return (
                <button
                  key={item.code}
                  type="button"
                  className="landing-lang"
                  style={{ "--lang-accent": itemAccent } as CSSProperties}
                  onClick={() => onEnter(item.code)}
                >
                  <span className="landing-lang-top">
                    <span className="landing-lang-flag">{item.flag}</span>
                    <span className="landing-lang-code">{item.code.toUpperCase()}</span>
                  </span>
                  <span className="landing-lang-name">{item.native}</span>
                  <span className="landing-lang-meta">
                    {item.words.length} слов · {item.phrases.length} фраз
                  </span>
                  <span className="landing-lang-sample">
                    «{word.word}»
                    <small>{word.translation}</small>
                  </span>
                  <span className="landing-lang-cta">
                    Учить
                    <ArrowUpRight size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="landing-final">
          <div className="landing-final-orb" aria-hidden>
            <span>P</span>
          </div>
          <div className="landing-final-copy">
            <div className="eyebrow">
              <span className="dot" />
              Следующий шаг
            </div>
            <h2 className="display">
              Язык не ждёт.
              <br />
              <em>Начни сегодня.</em>
            </h2>
            <p className="lead">
              Один короткий раунд — и ты уже ближе к разговору. Бесплатно, без карты и
              без давления.
            </p>
          </div>
          <div className="landing-final-actions">
            <button
              type="button"
              className="btn btn-lime landing-cta"
              onClick={() => onEnter(lang.code)}
            >
              Открыть Parlyo
              <ArrowUpRight size={16} />
            </button>
            <span>
              <ShieldCheck size={13} />
              Прогресс сохраняется локально и синхронизируется после входа
            </span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <Logo compact />
        <span>© 2026 Parlyo. Язык, ритм, прогресс.</span>
        <span className="landing-footer-note">
          Сделано для тех, кто хочет говорить, а не «учить».
        </span>
      </footer>
    </div>
  );
}
