import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final progress = ProgressController();
  await progress.load();
  runApp(ParlyoApp(progress: progress));
}

const ink = Color(0xFF17142B);
const muted = Color(0xFF77748B);
const purple = Color(0xFF7357E8);
const lilac = Color(0xFFEDE8FF);
const green = Color(0xFF51B886);
const orange = Color(0xFFFFA95A);
const pink = Color(0xFFE8789A);
const sky = Color(0xFF64BCE9);

class WordItem {
  const WordItem(
    this.word,
    this.translation,
    this.example,
    this.exampleRu,
    this.topic,
  );
  final String word;
  final String translation;
  final String example;
  final String exampleRu;
  final String topic;
}

class LevelData {
  const LevelData(this.code, this.title, this.subtitle, this.color, this.words);
  final String code;
  final String title;
  final String subtitle;
  final Color color;
  final List<WordItem> words;
}

const levels = <LevelData>[
  LevelData('A1', 'Начальный', 'Первые слова и простые фразы', green, [
    WordItem(
      'hello',
      'привет',
      'Hello, my name is Anna.',
      'Привет, меня зовут Анна.',
      'Основы',
    ),
    WordItem(
      'water',
      'вода',
      'Can I have some water?',
      'Можно мне воды?',
      'Еда',
    ),
    WordItem(
      'friend',
      'друг',
      'My friend lives nearby.',
      'Мой друг живёт рядом.',
      'Люди',
    ),
    WordItem(
      'book',
      'книга',
      'This book is very good.',
      'Эта книга очень хорошая.',
      'Предметы',
    ),
    WordItem(
      'happy',
      'счастливый',
      'I am happy today.',
      'Я сегодня счастлив.',
      'Чувства',
    ),
    WordItem(
      'morning',
      'утро',
      'Good morning, everyone!',
      'Доброе утро всем!',
      'Время',
    ),
    WordItem('cat', 'кошка', 'The cat is sleeping.', 'Кошка спит.', 'Животные'),
    WordItem(
      'house',
      'дом',
      'Their house is small.',
      'Их дом маленький.',
      'Город',
    ),
  ]),
  LevelData('A2', 'Базовый', 'Повседневные ситуации и общение', sky, [
    WordItem(
      'delicious',
      'вкусный',
      'This soup is delicious.',
      'Этот суп вкусный.',
      'Еда',
    ),
    WordItem(
      'journey',
      'путешествие',
      'The journey took two hours.',
      'Путешествие заняло два часа.',
      'Путешествия',
    ),
    WordItem(
      'neighbour',
      'сосед',
      'Our neighbour is very kind.',
      'Наш сосед очень добрый.',
      'Люди',
    ),
    WordItem(
      'weather',
      'погода',
      'The weather looks sunny.',
      'Погода обещает быть солнечной.',
      'Природа',
    ),
    WordItem(
      'careful',
      'осторожный',
      'Be careful on the stairs.',
      'Будь осторожен на лестнице.',
      'Прилагательные',
    ),
    WordItem(
      'usually',
      'обычно',
      'I usually walk to work.',
      'Обычно я хожу на работу пешком.',
      'Время',
    ),
    WordItem(
      'market',
      'рынок',
      'We bought apples at the market.',
      'Мы купили яблоки на рынке.',
      'Город',
    ),
    WordItem(
      'borrow',
      'одолжить',
      'Can I borrow your pen?',
      'Можно одолжить твою ручку?',
      'Действия',
    ),
  ]),
  LevelData(
    'B1',
    'Средний',
    'Рассказывай, объясняй, обсуждай',
    Color(0xFF6C83E8),
    [
      WordItem(
        'improve',
        'улучшать',
        'Reading can improve your vocabulary.',
        'Чтение помогает улучшить словарный запас.',
        'Учёба',
      ),
      WordItem(
        'opportunity',
        'возможность',
        'This is a great opportunity.',
        'Это отличная возможность.',
        'Работа',
      ),
      WordItem(
        'environment',
        'окружающая среда',
        'We should protect the environment.',
        'Нужно беречь окружающую среду.',
        'Природа',
      ),
      WordItem(
        'advice',
        'совет',
        'Thanks for your helpful advice.',
        'Спасибо за полезный совет.',
        'Общение',
      ),
      WordItem(
        'instead',
        'вместо этого',
        'Let’s take the bus instead.',
        'Давай вместо этого поедем на автобусе.',
        'Связки',
      ),
      WordItem(
        'confident',
        'уверенный',
        'She feels confident about the exam.',
        'Она уверена в экзамене.',
        'Чувства',
      ),
      WordItem(
        'schedule',
        'расписание',
        'My schedule is quite busy.',
        'У меня довольно плотное расписание.',
        'Работа',
      ),
      WordItem(
        'experience',
        'опыт',
        'Travel gives you new experience.',
        'Путешествия дают новый опыт.',
        'Жизнь',
      ),
    ],
  ),
  LevelData(
    'B2',
    'Выше среднего',
    'Аргументы, оттенки смысла, беглая речь',
    orange,
    [
      WordItem(
        'nevertheless',
        'тем не менее',
        'It was difficult; nevertheless, we succeeded.',
        'Было трудно, тем не менее мы справились.',
        'Связки',
      ),
      WordItem(
        'substantial',
        'значительный',
        'The project requires substantial investment.',
        'Проект требует значительных вложений.',
        'Работа',
      ),
      WordItem(
        'outcome',
        'результат',
        'We are pleased with the outcome.',
        'Мы довольны результатом.',
        'Общение',
      ),
      WordItem(
        'drawback',
        'недостаток',
        'The main drawback is the cost.',
        'Главный недостаток — стоимость.',
        'Аргументы',
      ),
      WordItem(
        'maintain',
        'поддерживать',
        'It is important to maintain balance.',
        'Важно поддерживать баланс.',
        'Действия',
      ),
      WordItem(
        'awareness',
        'осведомлённость',
        'The campaign raised awareness.',
        'Кампания повысила осведомлённость.',
        'Общество',
      ),
      WordItem(
        'reliable',
        'надёжный',
        'We need a reliable source.',
        'Нам нужен надёжный источник.',
        'Прилагательные',
      ),
      WordItem(
        'approach',
        'подход',
        'We need a different approach.',
        'Нам нужен другой подход.',
        'Работа',
      ),
    ],
  ),
  LevelData('C1', 'Продвинутый', 'Тонкие смыслы и свободное владение', pink, [
    WordItem(
      'compelling',
      'убедительный',
      'She made a compelling argument.',
      'Она привела убедительный аргумент.',
      'Аргументы',
    ),
    WordItem(
      'subtle',
      'тонкий, едва заметный',
      'There is a subtle difference in meaning.',
      'Есть тонкое различие в значении.',
      'Прилагательные',
    ),
    WordItem(
      'thrive',
      'процветать',
      'Small businesses can thrive here.',
      'Малый бизнес может здесь процветать.',
      'Работа',
    ),
    WordItem(
      'inevitable',
      'неизбежный',
      'Change is an inevitable part of life.',
      'Перемены — неизбежная часть жизни.',
      'Жизнь',
    ),
    WordItem(
      'insight',
      'глубокое понимание',
      'The book offers insight into history.',
      'Книга даёт глубокое понимание истории.',
      'Учёба',
    ),
    WordItem(
      'reluctant',
      'неохотно соглашающийся',
      'He was reluctant to leave.',
      'Он не хотел уходить.',
      'Чувства',
    ),
    WordItem(
      'undermine',
      'подрывать',
      'Rumours can undermine trust.',
      'Слухи могут подрывать доверие.',
      'Общение',
    ),
    WordItem(
      'versatile',
      'универсальный',
      'It is a versatile tool for learners.',
      'Это универсальный инструмент для учащихся.',
      'Учёба',
    ),
  ]),
];

class ProgressController extends ChangeNotifier {
  static const _storageKey = 'parlyo.progress.v1';
  int xp = 0;
  int selectedLevel = 0;
  final Set<String> learnedWords = {};
  final Set<String> completedLevels = {};
  final Set<String> unlockedLevels = {'A1'};
  int quizzesDone = 0;
  int correctAnswers = 0;
  int totalAnswers = 0;
  int streak = 0;
  int bestStreak = 0;
  String lastActive = '';
  String displayName = 'Ученик';
  final Map<String, int> dailyXp = {};
  bool loaded = false;

  int get userLevel {
    var remaining = xp;
    var level = 1;
    var threshold = 100;
    while (remaining >= threshold && level < 99) {
      remaining -= threshold;
      level++;
      threshold = 100 + (level - 1) * 50;
    }
    return level;
  }

  int get xpInLevel {
    var remaining = xp;
    var threshold = 100;
    var level = 1;
    while (remaining >= threshold && level < 99) {
      remaining -= threshold;
      level++;
      threshold = 100 + (level - 1) * 50;
    }
    return remaining;
  }

  int get xpToNext => max(0, 100 + (userLevel - 1) * 50 - xpInLevel);
  int get dailyGoal => 50;
  int get todayXp => dailyXp[_dateKey(DateTime.now())] ?? 0;
  double get accuracy => totalAnswers == 0 ? 0 : correctAnswers / totalAnswers;

  Future<void> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_storageKey);
      if (raw != null) {
        final data = jsonDecode(raw) as Map<String, dynamic>;
        xp = data['xp'] as int? ?? 0;
        selectedLevel = (data['selectedLevel'] as int? ?? 0).clamp(
          0,
          levels.length - 1,
        );
        learnedWords.addAll(
          (data['learnedWords'] as List<dynamic>? ?? []).cast<String>(),
        );
        completedLevels.addAll(
          (data['completedLevels'] as List<dynamic>? ?? []).cast<String>(),
        );
        unlockedLevels.addAll(
          (data['unlockedLevels'] as List<dynamic>? ?? []).cast<String>(),
        );
        // Migrate saves from before unlock state was stored separately.
        for (var index = 0; index < levels.length; index++) {
          if (completedLevels.contains(levels[index].code)) {
            unlockedLevels.add(levels[index].code);
            if (index + 1 < levels.length) {
              unlockedLevels.add(levels[index + 1].code);
            }
          }
        }
        unlockedLevels.add('A1');
        quizzesDone = data['quizzesDone'] as int? ?? 0;
        correctAnswers = data['correctAnswers'] as int? ?? 0;
        totalAnswers = data['totalAnswers'] as int? ?? 0;
        streak = data['streak'] as int? ?? 0;
        bestStreak = data['bestStreak'] as int? ?? 0;
        lastActive = data['lastActive'] as String? ?? '';
        displayName = data['displayName'] as String? ?? 'Ученик';
        final savedDaily = data['dailyXp'] as Map<String, dynamic>? ?? {};
        dailyXp.addAll(
          savedDaily.map((key, value) => MapEntry(key, value as int)),
        );
      }
      _updateStreakForToday();
    } catch (_) {
      // If local storage is unavailable or corrupted, start with fresh progress.
    }
    loaded = true;
    notifyListeners();
    // Persist the normalized unlock chain after loading/migrating older saves.
    unawaited(_save());
  }

  Future<void> _save() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        _storageKey,
        jsonEncode({
          'xp': xp,
          'selectedLevel': selectedLevel,
          'learnedWords': learnedWords.toList(),
          'completedLevels': completedLevels.toList(),
          'unlockedLevels': unlockedLevels.toList(),
          'quizzesDone': quizzesDone,
          'correctAnswers': correctAnswers,
          'totalAnswers': totalAnswers,
          'streak': streak,
          'bestStreak': bestStreak,
          'lastActive': lastActive,
          'displayName': displayName,
          'dailyXp': dailyXp,
        }),
      );
    } catch (_) {
      // UI remains usable if local storage is unavailable.
    }
  }

  void _updateStreakForToday() {
    final today = _dateKey(DateTime.now());
    if (lastActive == today) return;
    final yesterday = _dateKey(
      DateTime.now().subtract(const Duration(days: 1)),
    );
    if (lastActive != yesterday) streak = 0;
  }

  void _recordActivity(int earned) {
    final today = _dateKey(DateTime.now());
    if (lastActive != today) {
      final yesterday = _dateKey(
        DateTime.now().subtract(const Duration(days: 1)),
      );
      streak = lastActive == yesterday ? streak + 1 : 1;
      bestStreak = max(streak, bestStreak);
      lastActive = today;
    }
    dailyXp[today] = (dailyXp[today] ?? 0) + earned;
  }

  bool learn(String id) {
    if (!learnedWords.add(id)) return false;
    xp += 10;
    _recordActivity(10);
    notifyListeners();
    unawaited(_save());
    return true;
  }

  bool isLevelUnlocked(String code) => unlockedLevels.contains(code);

  bool isLevelCompleted(String code) => completedLevels.contains(code);

  bool completeQuiz({
    required int correct,
    required int total,
    required String levelCode,
  }) {
    final levelIndex = levels.indexWhere((level) => level.code == levelCode);
    final isLevelQuiz = levelIndex >= 0;
    // Require a strong result to complete a lesson, but don't demand perfection.
    final passed = isLevelQuiz && total > 0 && correct / total >= 0.75;
    final bonus = passed && correct == total ? 20 : 0;
    final earned = correct * 5 + bonus;
    xp += earned;
    quizzesDone++;
    correctAnswers += correct;
    totalAnswers += total;
    _recordActivity(earned);

    if (passed) {
      completedLevels.add(levelCode);
      if (levelIndex + 1 < levels.length) {
        unlockedLevels.add(levels[levelIndex + 1].code);
      }
    }

    notifyListeners();
    unawaited(_save());
    return passed;
  }

  void selectLevel(int index) {
    selectedLevel = index.clamp(0, levels.length - 1);
    notifyListeners();
    unawaited(_save());
  }

  void rename(String name) {
    displayName = name.trim().isEmpty ? 'Ученик' : name.trim();
    notifyListeners();
    unawaited(_save());
  }

  void reset() {
    xp = 0;
    learnedWords.clear();
    completedLevels.clear();
    unlockedLevels
      ..clear()
      ..add('A1');
    quizzesDone = 0;
    correctAnswers = 0;
    totalAnswers = 0;
    streak = 0;
    bestStreak = 0;
    lastActive = '';
    dailyXp.clear();
    notifyListeners();
    unawaited(_save());
  }
}

String _dateKey(DateTime date) =>
    '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';

class ParlyoApp extends StatelessWidget {
  const ParlyoApp({super.key, required this.progress});
  final ProgressController progress;

  @override
  Widget build(BuildContext context) {
    final scheme = ColorScheme.fromSeed(
      seedColor: purple,
      brightness: Brightness.light,
      surface: const Color(0xFFFFFCF7),
    );
    return AnimatedBuilder(
      animation: progress,
      builder: (context, _) => MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Parlyo — учи английский',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: scheme,
          scaffoldBackgroundColor: const Color(0xFFFFFCF7),
          fontFamily: 'Roboto',
          textTheme: ThemeData.light().textTheme.apply(
            bodyColor: ink,
            displayColor: ink,
          ),
          cardTheme: CardThemeData(
            color: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(26),
            ),
          ),
        ),
        home: progress.loaded
            ? ParlyoShell(progress: progress)
            : const _LoadingScreen(),
      ),
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: CircularProgressIndicator(color: purple)),
  );
}

class ParlyoShell extends StatefulWidget {
  const ParlyoShell({super.key, required this.progress});
  final ProgressController progress;
  @override
  State<ParlyoShell> createState() => _ParlyoShellState();
}

class _ParlyoShellState extends State<ParlyoShell> {
  int _tab = 0;
  late int _selectedLevel;

  @override
  void initState() {
    super.initState();
    _selectedLevel = widget.progress.selectedLevel;
  }

  void _selectLevel(int index) {
    setState(() => _selectedLevel = index);
    widget.progress.selectLevel(index);
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomePage(
        progress: widget.progress,
        onNavigate: (tab) => setState(() => _tab = tab),
        onLevel: _selectLevel,
      ),
      WordsPage(
        progress: widget.progress,
        initialLevel: _selectedLevel,
        onLevel: _selectLevel,
      ),
      QuizzesPage(
        progress: widget.progress,
        selectedLevel: _selectedLevel,
        onLevel: _selectLevel,
      ),
      ProfilePage(progress: widget.progress),
    ];
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            _TopBar(progress: widget.progress),
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 360),
                switchInCurve: Curves.easeOutCubic,
                switchOutCurve: Curves.easeInCubic,
                transitionBuilder: (child, animation) => FadeTransition(
                  opacity: animation,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(.035, 0),
                      end: Offset.zero,
                    ).animate(animation),
                    child: child,
                  ),
                ),
                child: KeyedSubtree(key: ValueKey(_tab), child: pages[_tab]),
              ),
            ),
            _BottomNav(
              index: _tab,
              onChanged: (value) => setState(() => _tab = value),
            ),
          ],
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({required this.progress});
  final ProgressController progress;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(22, 14, 22, 10),
    child: Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [purple, Color(0xFF9B7CF6)]),
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: purple.withAlpha(40),
                blurRadius: 14,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: const Icon(
            Icons.auto_awesome_rounded,
            color: Colors.white,
            size: 23,
          ),
        ),
        const SizedBox(width: 10),
        const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Parlyo',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 20,
                letterSpacing: -.6,
              ),
            ),
            Text(
              'ТВОЙ ЯЗЫК — ТВОЙ МИР',
              style: TextStyle(
                fontSize: 8,
                letterSpacing: 1.4,
                color: muted,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        const Spacer(),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF4DF),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.bolt_rounded,
                size: 18,
                color: Color(0xFFF3A02D),
              ),
              const SizedBox(width: 4),
              Text(
                '${progress.xp}',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF9C681D),
                ),
              ),
              const SizedBox(width: 3),
              const Text(
                'XP',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF9C681D),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Container(
          width: 39,
          height: 39,
          decoration: BoxDecoration(
            color: lilac,
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Center(
            child: Text('🇬🇧', style: TextStyle(fontSize: 21)),
          ),
        ),
      ],
    ),
  );
}

class _BottomNav extends StatelessWidget {
  const _BottomNav({required this.index, required this.onChanged});
  final int index;
  final ValueChanged<int> onChanged;
  static const items = [
    (Icons.home_rounded, 'Главная'),
    (Icons.menu_book_rounded, 'Слова'),
    (Icons.extension_rounded, 'Куизы'),
    (Icons.person_rounded, 'Профиль'),
  ];
  @override
  Widget build(BuildContext context) => Container(
    decoration: const BoxDecoration(
      color: Colors.white,
      border: Border(top: BorderSide(color: Color(0xFFF0EDF5))),
    ),
    padding: EdgeInsets.fromLTRB(
      8,
      8,
      8,
      MediaQuery.of(context).padding.bottom > 0 ? 8 : 12,
    ),
    child: Row(
      children: List.generate(items.length, (i) {
        final active = index == i;
        return Expanded(
          child: GestureDetector(
            onTap: () => onChanged(i),
            behavior: HitTestBehavior.opaque,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: active ? lilac : Colors.transparent,
                borderRadius: BorderRadius.circular(17),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedScale(
                    scale: active ? 1.12 : 1,
                    duration: const Duration(milliseconds: 200),
                    child: Icon(
                      items[i].$1,
                      size: 21,
                      color: active ? purple : const Color(0xFFAAA6B6),
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    items[i].$2,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: active ? FontWeight.w800 : FontWeight.w600,
                      color: active ? purple : const Color(0xFF9A97A7),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    ),
  );
}

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.progress,
    required this.onNavigate,
    required this.onLevel,
  });
  final ProgressController progress;
  final ValueChanged<int> onNavigate;
  final ValueChanged<int> onLevel;
  static const facts = [
    (
      'Did you know?',
      'Слово “nice” раньше означало «глупый»! За века оно полностью изменило смысл.',
      '🤓',
    ),
    (
      'Слово дня',
      '“Serendipity” — неожиданная удачная находка. Например, случайно найти любимое кафе.',
      '✨',
    ),
    (
      'Языковой факт',
      'В английском языке более 170 000 слов, но для свободного общения хватит примерно 3 000.',
      '🧠',
    ),
    (
      'Say it!',
      '“Piece of cake” — это не кусок торта, а «проще простого». Попробуй произнести!',
      '🍰',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final fact = facts[DateTime.now().day % facts.length];
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
      children: [
        Text(
          _greeting(),
          style: const TextStyle(
            color: muted,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          'Привет, ${progress.displayName}! 👋',
          style: const TextStyle(
            fontSize: 27,
            fontWeight: FontWeight.w900,
            letterSpacing: -.8,
          ),
        ),
        const SizedBox(height: 5),
        const Text(
          'Сегодня — отличный день для нового слова.',
          style: TextStyle(color: muted, fontSize: 13),
        ),
        const SizedBox(height: 19),
        _DailyCard(progress: progress),
        const SizedBox(height: 14),
        _FactCard(fact: fact),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Твой маршрут',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
            Text(
              '${progress.completedLevels.length}/${levels.length} уровней',
              style: const TextStyle(
                color: muted,
                fontWeight: FontWeight.w700,
                fontSize: 12,
              ),
            ),
          ],
        ),
        const SizedBox(height: 11),
        _DuolingoRoadmap(
          progress: progress,
          onSelected: (index) {
            onLevel(index);
            _startQuiz(context, progress, levels[index]);
          },
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            Expanded(
              child: _QuickCard(
                icon: Icons.menu_book_rounded,
                color: purple,
                title: 'Карточки слов',
                subtitle: 'Повторяй и запоминай',
                onTap: () => onNavigate(1),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _QuickCard(
                icon: Icons.extension_rounded,
                color: pink,
                title: 'Играть',
                subtitle: 'Куизы и испытания',
                onTap: () => onNavigate(2),
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),
        _DailyWordCard(progress: progress),
      ],
    );
  }
}

String _greeting() {
  final hour = DateTime.now().hour;
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

class _DailyCard extends StatelessWidget {
  const _DailyCard({required this.progress});
  final ProgressController progress;
  @override
  Widget build(BuildContext context) {
    final ratio = (progress.todayXp / progress.dailyGoal).clamp(0.0, 1.0);
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF785CE8), Color(0xFF9C81F1)],
        ),
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: purple.withAlpha(40),
            blurRadius: 18,
            offset: const Offset(0, 9),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(35),
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Icon(
                  Icons.local_fire_department_rounded,
                  color: Color(0xFFFFD585),
                ),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Цель на сегодня',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      'Немного практики — большой прогресс',
                      style: TextStyle(color: Color(0xFFE2DCFF), fontSize: 11),
                    ),
                  ],
                ),
              ),
              Text(
                '🔥 ${progress.streak}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 15,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${progress.todayXp} / ${progress.dailyGoal} XP',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 12,
                ),
              ),
              Text(
                '${(ratio * 100).round()}%',
                style: const TextStyle(
                  color: Color(0xFFE2DCFF),
                  fontWeight: FontWeight.w700,
                  fontSize: 11,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: ratio,
              minHeight: 8,
              backgroundColor: Colors.white.withAlpha(55),
              valueColor: const AlwaysStoppedAnimation(Color(0xFFFFDC8C)),
            ),
          ),
        ],
      ),
    );
  }
}

class _FactCard extends StatelessWidget {
  const _FactCard({required this.fact});
  final (String, String, String) fact;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: const Color(0xFFFFF5E9),
      borderRadius: BorderRadius.circular(23),
      border: Border.all(color: const Color(0xFFFFEAD2)),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(fact.$3, style: const TextStyle(fontSize: 27)),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                fact.$1,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 14,
                  color: Color(0xFF9A6332),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                fact.$2,
                style: const TextStyle(
                  fontSize: 12,
                  height: 1.45,
                  color: Color(0xFF775B43),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

/// Вертикальная извилистая карта уроков: узлы, соединительная дорожка,
/// закрытые и пройденные уроки и текущий подпрыгивающий узел.
class _DuolingoRoadmap extends StatelessWidget {
  const _DuolingoRoadmap({required this.progress, required this.onSelected});
  final ProgressController progress;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    final current = _currentLessonIndex(progress);
    const rowHeight = 88.0;
    return Container(
      padding: const EdgeInsets.fromLTRB(8, 18, 8, 20),
      decoration: BoxDecoration(
        color: const Color(0xFFF4F0FF),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFE8E0FF)),
      ),
      child: Column(
        children: [
          _UnitHeader(
            index: _currentLessonIndex(progress),
            level: levels[_currentLessonIndex(progress)],
            progress: progress,
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: levels.length * rowHeight,
            child: Stack(
              children: [
                Positioned.fill(
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final centers = List.generate(
                        levels.length,
                        (index) => constraints.maxWidth * _nodeFraction(index),
                      );
                      return CustomPaint(
                        painter: _RoadPainter(
                          centers: centers,
                          colors: levels.map((item) => item.color).toList(),
                          completed: Set<String>.of(progress.completedLevels),
                        ),
                      );
                    },
                  ),
                ),
                ...List.generate(levels.length, (index) {
                  final level = levels[index];
                  final unlocked = progress.isLevelUnlocked(level.code);
                  final completed = progress.isLevelCompleted(level.code);
                  final isCurrent = index == current;
                  final lessonCount = level.words.length;
                  final learned = progress.learnedWords
                      .where((id) => id.startsWith('${level.code}-'))
                      .length;
                  final fraction = lessonCount == 0
                      ? 0.0
                      : learned / lessonCount;
                  final center = _nodeFraction(index);
                  return Positioned.fill(
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        final nodeCenter = constraints.maxWidth * center;
                        final diameter = isCurrent ? 66.0 : 60.0;
                        return Stack(
                          children: [
                            Positioned(
                              top: index * rowHeight + 12,
                              left: nodeCenter - diameter / 2,
                              child: _LessonNode(
                                level: level,
                                completed: completed,
                                unlocked: unlocked,
                                current: isCurrent,
                                fraction: fraction,
                                onTap: () {
                                  if (!unlocked) {
                                    _toast(
                                      context,
                                      'Сначала набери 75% в ${levels[index - 1].code}, чтобы открыть этот шаг.',
                                    );
                                    return;
                                  }
                                  HapticFeedback.selectionClick();
                                  onSelected(index);
                                },
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 3),
          Text(
            'Набери 75% в куизе — следующий уровень откроется автоматически',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: purple.withAlpha(210),
              fontWeight: FontWeight.w700,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  double _nodeFraction(int index) {
    const positions = [0.50, 0.78, 0.67, 0.27, 0.40];
    return positions[index];
  }
}

int _currentLessonIndex(ProgressController progress) {
  for (var index = 0; index < levels.length; index++) {
    if (!progress.completedLevels.contains(levels[index].code) &&
        progress.isLevelUnlocked(levels[index].code)) {
      return index;
    }
  }
  return levels.length - 1;
}

class _UnitHeader extends StatelessWidget {
  const _UnitHeader({
    required this.index,
    required this.level,
    required this.progress,
  });
  final int index;
  final LevelData level;
  final ProgressController progress;

  @override
  Widget build(BuildContext context) {
    final completed = progress.completedLevels.contains(level.code);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 13),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [level.color, level.color.withAlpha(210)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: level.color.withAlpha(40),
            blurRadius: 12,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 37,
            height: 37,
            decoration: BoxDecoration(
              color: Colors.white.withAlpha(38),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              completed ? Icons.check_rounded : Icons.flag_rounded,
              color: Colors.white,
              size: 21,
            ),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'РАЗДЕЛ ${index + 1} · ${level.code}',
                  style: TextStyle(
                    color: Colors.white.withAlpha(205),
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.2,
                  ),
                ),
                Text(
                  level.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
                Text(
                  level.subtitle,
                  style: TextStyle(
                    color: Colors.white.withAlpha(215),
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.expand_more_rounded, color: Colors.white.withAlpha(220)),
        ],
      ),
    );
  }
}

class _LessonNode extends StatefulWidget {
  const _LessonNode({
    required this.level,
    required this.completed,
    required this.unlocked,
    required this.current,
    required this.fraction,
    required this.onTap,
  });
  final LevelData level;
  final bool completed;
  final bool unlocked;
  final bool current;
  final double fraction;
  final VoidCallback onTap;
  @override
  State<_LessonNode> createState() => _LessonNodeState();
}

class _LessonNodeState extends State<_LessonNode>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulse;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
      lowerBound: .96,
      upperBound: 1.04,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.level.color;
    final node = widget.current
        ? ScaleTransition(scale: _pulse, child: _buildNode(color))
        : _buildNode(color);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Semantics(
          button: true,
          label:
              '${widget.level.code}, ${widget.level.title}${widget.completed
                  ? ', пройден'
                  : widget.unlocked
                  ? ', доступен'
                  : ', закрыт'}',
          child: GestureDetector(
            onTap: widget.onTap,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              width: widget.current ? 66 : 60,
              height: widget.current ? 66 : 60,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(
                  color: widget.current
                      ? color
                      : color.withAlpha(widget.completed ? 120 : 60),
                  width: widget.current ? 4 : 3,
                ),
                boxShadow: [
                  BoxShadow(
                    color: color.withAlpha(widget.current ? 85 : 30),
                    blurRadius: widget.current ? 18 : 9,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: node,
            ),
          ),
        ),
        const SizedBox(height: 5),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(9),
            boxShadow: [BoxShadow(color: ink.withAlpha(10), blurRadius: 5)],
          ),
          child: Text(
            widget.completed ? '✓ ${widget.level.code}' : widget.level.code,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              color: widget.unlocked ? color : muted,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildNode(Color color) {
    final icon = widget.completed
        ? Icons.check_rounded
        : widget.unlocked
        ? (widget.current ? Icons.play_arrow_rounded : Icons.menu_book_rounded)
        : Icons.lock_rounded;
    return Center(
      child: Stack(
        alignment: Alignment.center,
        children: [
          if (widget.fraction > 0 && !widget.completed)
            SizedBox(
              width: 51,
              height: 51,
              child: CircularProgressIndicator(
                value: widget.fraction,
                strokeWidth: 3.5,
                backgroundColor: color.withAlpha(24),
                valueColor: AlwaysStoppedAnimation(color),
              ),
            ),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 420),
            switchInCurve: Curves.elasticOut,
            transitionBuilder: (child, animation) => ScaleTransition(
              scale: animation,
              child: FadeTransition(opacity: animation, child: child),
            ),
            child: Icon(
              icon,
              key: ValueKey(icon),
              size: widget.current ? 29 : 25,
              color: widget.unlocked ? color : const Color(0xFFBBB8C3),
            ),
          ),
          if (widget.completed)
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                width: 19,
                height: 19,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFC857),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.star_rounded,
                  size: 13,
                  color: Colors.white,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _RoadPainter extends CustomPainter {
  _RoadPainter({
    required this.centers,
    required this.colors,
    required this.completed,
  });
  final List<double> centers;
  final List<Color> colors;
  final Set<String> completed;

  @override
  void paint(Canvas canvas, Size size) {
    if (centers.length < 2) return;
    final height = size.height / centers.length;
    for (var index = 0; index < centers.length - 1; index++) {
      final start = Offset(centers[index], index * height + 43);
      final end = Offset(centers[index + 1], (index + 1) * height + 5);
      final path = Path()..moveTo(start.dx, start.dy);
      final midY = (start.dy + end.dy) / 2;
      path.cubicTo(start.dx, midY, end.dx, midY, end.dx, end.dy);
      final passed = completed.contains(levels[index].code);
      final shadow = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.stroke
        ..strokeWidth = 14
        ..strokeCap = StrokeCap.round;
      canvas.drawPath(path, shadow);
      final paint = Paint()
        ..color = passed ? colors[index] : const Color(0xFFD9D2EB)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 8
        ..strokeCap = StrokeCap.round;
      canvas.drawPath(path, paint);
      if (!passed) {
        final dashes = Paint()
          ..color = Colors.white.withAlpha(230)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2.2
          ..strokeCap = StrokeCap.round;
        final metric = path.computeMetrics().first;
        for (var distance = 6.0; distance < metric.length; distance += 13) {
          canvas.drawPath(
            metric.extractPath(distance, min(distance + 5, metric.length)),
            dashes,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant _RoadPainter oldDelegate) =>
      oldDelegate.completed.length != completed.length ||
      !oldDelegate.completed.containsAll(completed) ||
      !completed.containsAll(oldDelegate.completed) ||
      oldDelegate.colors != colors ||
      oldDelegate.centers != centers;
}

class _QuickCard extends StatelessWidget {
  const _QuickCard({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    borderRadius: BorderRadius.circular(22),
    child: Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFF0EDF5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withAlpha(24),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 11),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
          ),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(color: muted, fontSize: 10)),
        ],
      ),
    ),
  );
}

class _DailyWordCard extends StatelessWidget {
  const _DailyWordCard({required this.progress});
  final ProgressController progress;
  @override
  Widget build(BuildContext context) {
    final word =
        levels[0].words[(DateTime.now().day - 1) % levels[0].words.length];
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFEAF7F0),
        borderRadius: BorderRadius.circular(23),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
            ),
            child: const Center(
              child: Text('💬', style: TextStyle(fontSize: 23)),
            ),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'СЛОВО ДНЯ',
                  style: TextStyle(
                    color: Color(0xFF408A65),
                    fontWeight: FontWeight.w900,
                    fontSize: 9,
                    letterSpacing: 1,
                  ),
                ),
                Text(
                  '${word.word}  ·  ${word.translation}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                  ),
                ),
                Text(
                  word.example,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 10, color: muted),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {
              final gained = progress.learn(
                'daily-${_dateKey(DateTime.now())}',
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    gained ? 'Новое слово! +10 XP' : 'Слово дня уже отмечено',
                  ),
                  behavior: SnackBarBehavior.floating,
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            icon: Icon(
              progress.learnedWords.contains(
                    'daily-${_dateKey(DateTime.now())}',
                  )
                  ? Icons.check_circle_rounded
                  : Icons.add_circle_rounded,
              color: green,
              size: 26,
            ),
          ),
        ],
      ),
    );
  }
}

class WordsPage extends StatefulWidget {
  const WordsPage({
    super.key,
    required this.progress,
    required this.initialLevel,
    required this.onLevel,
  });
  final ProgressController progress;
  final int initialLevel;
  final ValueChanged<int> onLevel;
  @override
  State<WordsPage> createState() => _WordsPageState();
}

class _WordsPageState extends State<WordsPage> {
  late int _levelIndex;
  String _topic = 'Все';
  bool _showTranslation = false;
  int _cursor = 0;
  @override
  void initState() {
    super.initState();
    _levelIndex = widget.initialLevel;
  }

  @override
  void didUpdateWidget(covariant WordsPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialLevel != widget.initialLevel) {
      _levelIndex = widget.initialLevel;
      _cursor = 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final level = levels[_levelIndex];
    final topics = [
      'Все',
      ...{for (final word in level.words) word.topic},
    ];
    final words = level.words
        .where((word) => _topic == 'Все' || word.topic == _topic)
        .toList();
    if (words.isEmpty) return const Center(child: Text('Нет слов в этой теме'));
    _cursor %= words.length;
    final current = words[_cursor];
    final learned = widget.progress.learnedWords.contains(
      '${level.code}-${current.word}',
    );

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const _PageHeading(
          eyebrow: 'ТВОЯ КОЛОДА',
          title: 'Слова',
          subtitle: 'Шаг за шагом пополняй словарный запас.',
        ),
        const SizedBox(height: 14),
        _LevelSelector(
          selected: _levelIndex,
          progress: widget.progress,
          onSelected: (value) {
            setState(() {
              _levelIndex = value;
              _cursor = 0;
              _topic = 'Все';
              _showTranslation = false;
            });
            widget.onLevel(value);
          },
        ),
        const SizedBox(height: 13),
        SizedBox(
          height: 39,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: topics.map<Widget>((topic) {
              return Padding(
                padding: const EdgeInsets.only(right: 7),
                child: ChoiceChip(
                  label: Text(topic),
                  selected: topic == _topic,
                  onSelected: (_) => setState(() {
                    _topic = topic;
                    _cursor = 0;
                    _showTranslation = false;
                  }),
                  selectedColor: lilac,
                  backgroundColor: Colors.white,
                  side: BorderSide(
                    color: topic == _topic
                        ? purple.withAlpha(90)
                        : const Color(0xFFECE9F0),
                  ),
                  labelStyle: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: topic == _topic ? purple : muted,
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 14),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 280),
          transitionBuilder: (child, animation) => FadeTransition(
            opacity: animation,
            child: ScaleTransition(
              scale: Tween<double>(begin: .97, end: 1).animate(animation),
              child: child,
            ),
          ),
          child: _WordCard(
            key: ValueKey('${level.code}-${current.word}'),
            level: level,
            word: current,
            learned: learned,
            showTranslation: _showTranslation,
            onFlip: () => setState(() => _showTranslation = !_showTranslation),
            onLearn: () {
              final got = widget.progress.learn(
                '${level.code}-${current.word}',
              );
              if (got)
                _toast(context, 'Новое слово — +10 XP!');
              else
                _toast(context, 'Ты уже изучил это слово');
            },
            onSpeak: () => _speak(context, current.word),
          ),
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => setState(() {
                  _cursor = (_cursor - 1 + words.length) % words.length;
                  _showTranslation = false;
                }),
                icon: const Icon(Icons.arrow_back_rounded),
                label: const Text('Назад'),
              ),
            ),
            const SizedBox(width: 10),
            Text(
              '${_cursor + 1} / ${words.length}',
              style: const TextStyle(
                color: muted,
                fontWeight: FontWeight.w800,
                fontSize: 12,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: FilledButton.icon(
                onPressed: () => setState(() {
                  _cursor = (_cursor + 1) % words.length;
                  _showTranslation = false;
                }),
                icon: const Icon(Icons.arrow_forward_rounded),
                label: const Text('Дальше'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          '${widget.progress.learnedWords.where((id) => id.startsWith('${level.code}-')).length} из ${level.words.length} слов отмечено изученными',
          style: const TextStyle(
            fontSize: 11,
            color: muted,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 7),
        ClipRRect(
          borderRadius: BorderRadius.circular(9),
          child: LinearProgressIndicator(
            value:
                widget.progress.learnedWords
                    .where((id) => id.startsWith('${level.code}-'))
                    .length /
                level.words.length,
            minHeight: 7,
            backgroundColor: const Color(0xFFECE9F0),
            color: level.color,
          ),
        ),
      ],
    );
  }
}

class _WordCard extends StatelessWidget {
  const _WordCard({
    super.key,
    required this.level,
    required this.word,
    required this.learned,
    required this.showTranslation,
    required this.onFlip,
    required this.onLearn,
    required this.onSpeak,
  });
  final LevelData level;
  final WordItem word;
  final bool learned;
  final bool showTranslation;
  final VoidCallback onFlip;
  final VoidCallback onLearn;
  final VoidCallback onSpeak;
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onFlip,
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 320),
      curve: Curves.easeOutCubic,
      width: double.infinity,
      constraints: const BoxConstraints(minHeight: 315),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.white, level.color.withAlpha(10)],
        ),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: level.color.withAlpha(35)),
        boxShadow: [
          BoxShadow(
            color: level.color.withAlpha(18),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: level.color.withAlpha(24),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${level.code} · ${word.topic}',
                  style: TextStyle(
                    color: level.color,
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const Spacer(),
              if (learned)
                const Icon(Icons.check_circle_rounded, color: green, size: 20),
              IconButton(
                onPressed: onSpeak,
                icon: const Icon(Icons.volume_up_rounded, color: purple),
              ),
            ],
          ),
          const Spacer(),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 220),
            child: Column(
              key: ValueKey(showTranslation),
              children: [
                Text(
                  showTranslation ? word.translation : word.word,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 37,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.3,
                  ),
                ),
                if (showTranslation) ...[
                  const SizedBox(height: 18),
                  Text(
                    word.word,
                    style: TextStyle(
                      color: level.color,
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Text(
                    word.example,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 14,
                      fontStyle: FontStyle.italic,
                      color: ink,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    word.exampleRu,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 12, color: muted),
                  ),
                ] else
                  const Padding(
                    padding: EdgeInsets.only(top: 10),
                    child: Text(
                      'Нажми, чтобы увидеть перевод',
                      style: TextStyle(color: muted, fontSize: 12),
                    ),
                  ),
              ],
            ),
          ),
          const Spacer(),
          if (!learned)
            FilledButton.icon(
              onPressed: onLearn,
              icon: const Icon(Icons.check_rounded),
              label: const Text('Я запомнил · +10 XP'),
            )
          else
            const Text(
              '✓ Уже в твоём словаре',
              style: TextStyle(
                color: green,
                fontWeight: FontWeight.w800,
                fontSize: 12,
              ),
            ),
        ],
      ),
    ),
  );
}

class _LevelSelector extends StatelessWidget {
  const _LevelSelector({
    required this.selected,
    required this.progress,
    required this.onSelected,
  });
  final int selected;
  final ProgressController progress;
  final ValueChanged<int> onSelected;
  @override
  Widget build(BuildContext context) => SizedBox(
    height: 64,
    child: ListView(
      scrollDirection: Axis.horizontal,
      children: List.generate(levels.length, (index) {
        final level = levels[index];
        final unlocked = progress.isLevelUnlocked(level.code);
        final active = selected == index;
        return GestureDetector(
          onTap: unlocked
              ? () => onSelected(index)
              : () => _toast(
                  context,
                  'Сначала набери не менее 75% в ${levels[index - 1].code}, чтобы открыть этот уровень.',
                ),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            width: 76,
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              color: active ? level.color : Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: active ? level.color : const Color(0xFFECE9F0),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  unlocked ? level.code : '🔒',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                    color: active
                        ? Colors.white
                        : unlocked
                        ? level.color
                        : muted,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  level.title,
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: active ? Colors.white.withAlpha(210) : muted,
                  ),
                ),
              ],
            ),
          ),
        );
      }),
    ),
  );
}

class QuizzesPage extends StatefulWidget {
  const QuizzesPage({
    super.key,
    required this.progress,
    required this.selectedLevel,
    required this.onLevel,
  });
  final ProgressController progress;
  final int selectedLevel;
  final ValueChanged<int> onLevel;
  @override
  State<QuizzesPage> createState() => _QuizzesPageState();
}

class _QuizzesPageState extends State<QuizzesPage> {
  int _tab = 0;
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.fromLTRB(20, 12, 20, 25),
    children: [
      const _PageHeading(
        eyebrow: 'ВРЕМЯ ИГРАТЬ',
        title: 'Куизы',
        subtitle: 'Каждый ответ приближает тебя к свободной речи.',
      ),
      const SizedBox(height: 16),
      Row(
        children: [
          Expanded(
            child: _QuizModeTab(
              label: 'Уровни',
              icon: Icons.route_rounded,
              active: _tab == 0,
              onTap: () => setState(() => _tab = 0),
            ),
          ),
          const SizedBox(width: 9),
          Expanded(
            child: _QuizModeTab(
              label: 'Темы',
              icon: Icons.grid_view_rounded,
              active: _tab == 1,
              onTap: () => setState(() => _tab = 1),
            ),
          ),
          const SizedBox(width: 9),
          Expanded(
            child: _QuizModeTab(
              label: 'Голос',
              icon: Icons.graphic_eq_rounded,
              active: _tab == 2,
              onTap: () => setState(() => _tab = 2),
            ),
          ),
        ],
      ),
      const SizedBox(height: 16),
      AnimatedSwitcher(
        duration: const Duration(milliseconds: 280),
        child: _tab == 0
            ? _LevelQuizList(
                key: const ValueKey('levels'),
                progress: widget.progress,
                selected: widget.selectedLevel,
                onLevel: widget.onLevel,
              )
            : _tab == 1
            ? _ThemeQuizList(
                key: const ValueKey('themes'),
                progress: widget.progress,
              )
            : _VoiceQuizCard(
                key: const ValueKey('voice'),
                progress: widget.progress,
                levelIndex: widget.selectedLevel,
              ),
      ),
    ],
  );
}

class _QuizModeTab extends StatelessWidget {
  const _QuizModeTab({
    required this.label,
    required this.icon,
    required this.active,
    required this.onTap,
  });
  final String label;
  final IconData icon;
  final bool active;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      padding: const EdgeInsets.symmetric(vertical: 11),
      decoration: BoxDecoration(
        color: active ? ink : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: active ? ink : const Color(0xFFECE9F0)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 16, color: active ? Colors.white : purple),
          const SizedBox(width: 5),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: active ? Colors.white : ink,
            ),
          ),
        ],
      ),
    ),
  );
}

class _LevelQuizList extends StatelessWidget {
  const _LevelQuizList({
    super.key,
    required this.progress,
    required this.selected,
    required this.onLevel,
  });
  final ProgressController progress;
  final int selected;
  final ValueChanged<int> onLevel;
  @override
  Widget build(BuildContext context) => Column(
    children: List.generate(levels.length, (index) {
      final level = levels[index];
      final unlocked = progress.isLevelUnlocked(level.code);
      final completed = progress.completedLevels.contains(level.code);
      return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: _QuizCard(
          emoji: completed
              ? '🏆'
              : unlocked
              ? '🎯'
              : '🔒',
          title: '${level.code} · ${level.title}',
          subtitle: unlocked
              ? level.subtitle
              : 'Набери не менее 75% в предыдущем уровне',
          color: level.color,
          trailing: completed
              ? 'ПРОЙДЕН'
              : unlocked
              ? '8 вопросов'
              : 'ЗАКРЫТ',
          onTap: unlocked
              ? () {
                  onLevel(index);
                  _startQuiz(context, progress, level);
                }
              : () => _toast(
                  context,
                  'Этот уровень откроется после завершения ${levels[index - 1].code}.',
                ),
        ),
      );
    }),
  );
}

class _QuizCard extends StatelessWidget {
  const _QuizCard({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.trailing,
    required this.onTap,
  });
  final String emoji, title, subtitle, trailing;
  final Color color;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    borderRadius: BorderRadius.circular(22),
    child: Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: color.withAlpha(35)),
      ),
      child: Row(
        children: [
          Container(
            width: 43,
            height: 43,
            decoration: BoxDecoration(
              color: color.withAlpha(25),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Center(
              child: Text(emoji, style: const TextStyle(fontSize: 21)),
            ),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: muted, fontSize: 10),
                ),
              ],
            ),
          ),
          const SizedBox(width: 7),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                trailing,
                style: TextStyle(
                  color: color,
                  fontSize: 8,
                  fontWeight: FontWeight.w900,
                  letterSpacing: .6,
                ),
              ),
              const SizedBox(height: 5),
              Icon(Icons.arrow_forward_rounded, color: color, size: 17),
            ],
          ),
        ],
      ),
    ),
  );
}

class _ThemeQuizList extends StatelessWidget {
  const _ThemeQuizList({super.key, required this.progress});
  final ProgressController progress;
  static const topics = [
    ('🍜', 'Еда'),
    ('✈️', 'Путешествия'),
    ('🐾', 'Животные'),
    ('🏙️', 'Город'),
    ('😊', 'Чувства'),
    ('🌿', 'Природа'),
    ('💼', 'Работа'),
    ('⚽', 'Спорт'),
  ];
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text(
        'Выбери тему — куиз начнётся сразу',
        style: TextStyle(color: muted, fontSize: 12),
      ),
      const SizedBox(height: 10),
      ...topics.map(
        (topic) => Padding(
          padding: const EdgeInsets.only(bottom: 9),
          child: _QuizCard(
            emoji: topic.$1,
            title: 'Тема: ${topic.$2}',
            subtitle: '8 вопросов · слова со всех уровней',
            color: purple,
            trailing: 'НАЧАТЬ',
            onTap: () => _startTopicQuiz(context, progress, topic.$2),
          ),
        ),
      ),
    ],
  );
}

class _VoiceQuizCard extends StatelessWidget {
  const _VoiceQuizCard({
    super.key,
    required this.progress,
    required this.levelIndex,
  });
  final ProgressController progress;
  final int levelIndex;
  @override
  Widget build(BuildContext context) {
    final level = levels[levelIndex.clamp(0, levels.length - 1)];
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(23),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF302853), Color(0xFF59468D)],
            ),
            borderRadius: BorderRadius.circular(27),
          ),
          child: Column(
            children: [
              Container(
                width: 75,
                height: 75,
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(25),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.graphic_eq_rounded,
                  color: Colors.white,
                  size: 38,
                ),
              ),
              const SizedBox(height: 13),
              const Text(
                'На слух',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 5),
              const Text(
                'Слушай английское слово и выбери правильный перевод. Можно повторить озвучку!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFFD9D2F1),
                  fontSize: 12,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: () =>
                    _startQuiz(context, progress, level, voice: true),
                icon: const Icon(Icons.play_arrow_rounded),
                label: Text('Играть · ${level.code}'),
              ),
              const SizedBox(height: 7),
              Text(
                'Уровень ${level.code} · ${level.title}',
                style: const TextStyle(
                  color: Color(0xFFD9D2F1),
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        _QuizCard(
          emoji: '🗣️',
          title: 'Произношение',
          subtitle: 'Слушай слово и узнай, как оно пишется',
          color: orange,
          trailing: 'НАЧАТЬ',
          onTap: () => _startQuiz(context, progress, level, voice: true),
        ),
      ],
    );
  }
}

class QuizQuestion {
  const QuizQuestion({
    required this.prompt,
    required this.options,
    required this.answer,
    required this.word,
    required this.translation,
    this.voice = false,
  });
  final String prompt;
  final List<String> options;
  final int answer;
  final String word;
  final String translation;
  final bool voice;
}

void _startQuiz(
  BuildContext context,
  ProgressController progress,
  LevelData level, {
  bool voice = false,
}) {
  final source = List<WordItem>.from(level.words)..shuffle();
  final questions = source.take(min(8, source.length)).map((word) {
    final distractors =
        level.words
            .where((item) => item.word != word.word)
            .map((item) => item.translation)
            .toList()
          ..shuffle();
    final answers = <String>[word.translation, ...distractors.take(3)]
      ..shuffle();
    return QuizQuestion(
      prompt: voice
          ? 'Что означает услышанное слово?'
          : 'Как переводится «${word.word}»?',
      options: answers,
      answer: answers.indexOf(word.translation),
      word: word.word,
      translation: word.translation,
      voice: voice,
    );
  }).toList();
  Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => QuizScreen(
        progress: progress,
        title: '${level.code} · ${level.title}',
        levelCode: level.code,
        questions: questions,
      ),
    ),
  );
}

void _startTopicQuiz(
  BuildContext context,
  ProgressController progress,
  String topic,
) {
  final source =
      levels
          .expand((level) => level.words)
          .where((word) => word.topic == topic)
          .toList()
        ..shuffle();
  final questions = source.take(min(8, source.length)).map((word) {
    final pool =
        levels
            .expand((level) => level.words)
            .where((item) => item.word != word.word)
            .toList()
          ..shuffle();
    final options = <String>[
      word.translation,
      ...pool.take(3).map((item) => item.translation),
    ]..shuffle();
    return QuizQuestion(
      prompt: 'Как переводится «${word.word}»?',
      options: options,
      answer: options.indexOf(word.translation),
      word: word.word,
      translation: word.translation,
    );
  }).toList();
  Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => QuizScreen(
        progress: progress,
        title: 'Тема · $topic',
        levelCode: 'theme-$topic',
        questions: questions,
      ),
    ),
  );
}

class QuizScreen extends StatefulWidget {
  const QuizScreen({
    super.key,
    required this.progress,
    required this.title,
    required this.levelCode,
    required this.questions,
  });
  final ProgressController progress;
  final String title;
  final String levelCode;
  final List<QuizQuestion> questions;
  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _index = 0;
  int? _selected;
  int _correct = 0;
  bool _finished = false;
  bool _saved = false;
  bool _unlockedNext = false;
  bool get _answered => _selected != null;
  @override
  Widget build(BuildContext context) {
    final question = widget.questions[_index];
    if (question.voice && !_answered) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _speak(context, question.word);
      });
    }
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(
          widget.title,
          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
        ),
        centerTitle: true,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.close_rounded),
        ),
      ),
      body: SafeArea(
        child: _finished
            ? _result()
            : Padding(
                padding: const EdgeInsets.fromLTRB(22, 10, 22, 22),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: TweenAnimationBuilder<double>(
                        tween: Tween(
                          begin: 0,
                          end:
                              (_index + (_answered ? 1 : 0)) /
                              widget.questions.length,
                        ),
                        duration: const Duration(milliseconds: 350),
                        builder: (context, value, _) => LinearProgressIndicator(
                          value: value,
                          minHeight: 8,
                          backgroundColor: const Color(0xFFECE9F0),
                          color: purple,
                        ),
                      ),
                    ),
                    const SizedBox(height: 9),
                    Text(
                      'Вопрос ${_index + 1} из ${widget.questions.length}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: muted,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const Spacer(),
                    if (question.voice)
                      Center(
                        child: InkWell(
                          onTap: () => _speak(context, question.word),
                          borderRadius: BorderRadius.circular(50),
                          child: Container(
                            width: 100,
                            height: 100,
                            decoration: const BoxDecoration(
                              color: lilac,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.volume_up_rounded,
                              color: purple,
                              size: 44,
                            ),
                          ),
                        ),
                      ),
                    if (question.voice) const SizedBox(height: 18),
                    Text(
                      question.prompt,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 22),
                    ...List.generate(question.options.length, (optionIndex) {
                      final correct = optionIndex == question.answer;
                      final selected = optionIndex == _selected;
                      final color = !_answered
                          ? Colors.white
                          : correct
                          ? const Color(0xFFE7F7EE)
                          : selected
                          ? const Color(0xFFFFE9EC)
                          : Colors.white;
                      final border = !_answered
                          ? const Color(0xFFECE9F0)
                          : correct
                          ? green
                          : selected
                          ? pink
                          : const Color(0xFFECE9F0);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 9),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: color,
                            borderRadius: BorderRadius.circular(17),
                            border: Border.all(color: border),
                          ),
                          child: InkWell(
                            onTap: _answered
                                ? null
                                : () {
                                    HapticFeedback.selectionClick();
                                    setState(() {
                                      _selected = optionIndex;
                                      if (correct) _correct++;
                                    });
                                  },
                            borderRadius: BorderRadius.circular(17),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 15,
                                vertical: 14,
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      question.options[optionIndex],
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w800,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  if (_answered && correct)
                                    const Icon(
                                      Icons.check_circle_rounded,
                                      color: green,
                                    )
                                  else if (_answered && selected)
                                    const Icon(
                                      Icons.cancel_rounded,
                                      color: pink,
                                    ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                    if (_answered)
                      Container(
                        margin: const EdgeInsets.only(top: 2, bottom: 10),
                        padding: const EdgeInsets.all(13),
                        decoration: BoxDecoration(
                          color: _selected == question.answer
                              ? const Color(0xFFEAF7F0)
                              : const Color(0xFFFFF1F0),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          _selected == question.answer
                              ? 'Отлично! ${question.word} — ${question.translation}'
                              : 'Правильный ответ: ${question.word} — ${question.translation}',
                          style: TextStyle(
                            color: _selected == question.answer
                                ? const Color(0xFF37815C)
                                : const Color(0xFFAC5E5C),
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    const Spacer(),
                    FilledButton(
                      onPressed: !_answered
                          ? null
                          : () {
                              if (_index + 1 == widget.questions.length) {
                                setState(() => _finished = true);
                              } else {
                                setState(() {
                                  _index++;
                                  _selected = null;
                                });
                              }
                            },
                      child: Text(
                        _index + 1 == widget.questions.length
                            ? 'Завершить куиз'
                            : 'Далее',
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _result() {
    if (!_saved) {
      _saved = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          final passed = widget.progress.completeQuiz(
            correct: _correct,
            total: widget.questions.length,
            levelCode: widget.levelCode,
          );
          if (mounted) {
            setState(() => _unlockedNext = passed);
          }
        }
      });
    }
    final percent = (_correct / widget.questions.length * 100).round();
    final earned =
        _correct * 5 + (_correct == widget.questions.length ? 20 : 0);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(25),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ScaleTransitionDemo(
              child: Text(
                percent == 100
                    ? '🏆'
                    : percent >= 60
                    ? '🎉'
                    : '💪',
                style: const TextStyle(fontSize: 67),
              ),
            ),
            const SizedBox(height: 13),
            Text(
              percent == 100
                  ? 'Идеально!'
                  : percent >= 75
                  ? 'Отличный результат!'
                  : percent >= 50
                  ? 'Хорошая попытка!'
                  : 'Продолжай тренироваться!',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Text(
              'Правильных ответов: $_correct из ${widget.questions.length}',
              style: const TextStyle(color: muted),
            ),
            const SizedBox(height: 19),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 11),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF4DF),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Text(
                '⚡ +$earned XP',
                style: const TextStyle(
                  color: Color(0xFF9C681D),
                  fontWeight: FontWeight.w900,
                  fontSize: 17,
                ),
              ),
            ),
            const SizedBox(height: 20),
            if (_unlockedNext &&
                levels.indexWhere((level) => level.code == widget.levelCode) <
                    levels.length - 1)
              _UnlockCelebration(
                key: ValueKey('unlock-${widget.levelCode}'),
                nextLevel:
                    levels[levels.indexWhere(
                          (level) => level.code == widget.levelCode,
                        ) +
                        1],
              ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Продолжить'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _UnlockCelebration extends StatefulWidget {
  const _UnlockCelebration({super.key, required this.nextLevel});
  final LevelData nextLevel;

  @override
  State<_UnlockCelebration> createState() => _UnlockCelebrationState();
}

class _UnlockCelebrationState extends State<_UnlockCelebration>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 850),
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final entrance = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutBack,
    );
    return FadeTransition(
      opacity: CurvedAnimation(parent: _controller, curve: Curves.easeOut),
      child: ScaleTransition(
        scale: entrance,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFE8F8EF), Color(0xFFF2FCEB)],
            ),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: green.withAlpha(85)),
            boxShadow: [
              BoxShadow(
                color: green.withAlpha(25),
                blurRadius: 16,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Row(
            children: [
              const ScaleTransitionDemo(
                child: Text('🔓', style: TextStyle(fontSize: 27)),
              ),
              const SizedBox(width: 11),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'НОВЫЙ УРОВЕНЬ ОТКРЫТ!',
                      style: TextStyle(
                        color: Color(0xFF37815C),
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: .6,
                      ),
                    ),
                    Text(
                      '${widget.nextLevel.code} · ${widget.nextLevel.title}',
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.celebration_rounded, color: widget.nextLevel.color),
            ],
          ),
        ),
      ),
    );
  }
}

class ScaleTransitionDemo extends StatefulWidget {
  const ScaleTransitionDemo({super.key, required this.child});
  final Widget child;
  @override
  State<ScaleTransitionDemo> createState() => _ScaleTransitionDemoState();
}

class _ScaleTransitionDemoState extends State<ScaleTransitionDemo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 650),
  )..forward();
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ScaleTransition(
    scale: CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    child: widget.child,
  );
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key, required this.progress});
  final ProgressController progress;
  @override
  Widget build(BuildContext context) {
    final current = progress.userLevel;
    final nextXp = 100 + (current - 1) * 50;
    final ratio = nextXp == 0
        ? 0.0
        : (progress.xpInLevel / nextXp).clamp(0.0, 1.0);
    final accuracy = progress.accuracy;
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 28),
      children: [
        const _PageHeading(
          eyebrow: 'ТВОИ ПОБЕДЫ',
          title: 'Профиль',
          subtitle: 'Весь твой прогресс — в одном месте.',
        ),
        const SizedBox(height: 17),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF302853), Color(0xFF59468D)],
            ),
            borderRadius: BorderRadius.circular(27),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  GestureDetector(
                    onTap: () => _editName(context, progress),
                    child: Container(
                      width: 65,
                      height: 65,
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(25),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white.withAlpha(65)),
                      ),
                      child: const Center(
                        child: Text('🦊', style: TextStyle(fontSize: 36)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 13),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          progress.displayName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 19,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'Уровень $current · ${_levelTitle(current)}',
                          style: const TextStyle(
                            color: Color(0xFFD9D2F1),
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => _editName(context, progress),
                    icon: const Icon(
                      Icons.edit_rounded,
                      color: Colors.white70,
                      size: 19,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Text(
                    '$current ур.',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(width: 9),
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: ratio,
                        minHeight: 9,
                        backgroundColor: Colors.white.withAlpha(38),
                        color: const Color(0xFFFFD585),
                      ),
                    ),
                  ),
                  const SizedBox(width: 9),
                  Text(
                    '${current + 1} ур.',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${progress.xpInLevel} / $nextXp XP · ещё ${progress.xpToNext} XP до нового уровня',
                style: const TextStyle(color: Color(0xFFD9D2F1), fontSize: 10),
              ),
            ],
          ),
        ),
        const SizedBox(height: 13),
        Row(
          children: [
            Expanded(
              child: _StatTile(
                emoji: '⚡',
                number: '${progress.xp}',
                label: 'Всего XP',
                color: orange,
              ),
            ),
            const SizedBox(width: 9),
            Expanded(
              child: _StatTile(
                emoji: '📚',
                number: '${progress.learnedWords.length}',
                label: 'Слов изучено',
                color: sky,
              ),
            ),
          ],
        ),
        const SizedBox(height: 9),
        Row(
          children: [
            Expanded(
              child: _StatTile(
                emoji: '🧩',
                number: '${progress.quizzesDone}',
                label: 'Куизов',
                color: purple,
              ),
            ),
            const SizedBox(width: 9),
            Expanded(
              child: _StatTile(
                emoji: '🎯',
                number: '${(accuracy * 100).round()}%',
                label: 'Точность',
                color: green,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(17),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(23),
            border: Border.all(color: const Color(0xFFF0EDF5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Твой прогресс по уровням',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
              ),
              const SizedBox(height: 11),
              ...levels.map((level) {
                final completed = progress.completedLevels.contains(level.code);
                final unlocked = progress.isLevelUnlocked(level.code);
                final learned = progress.learnedWords
                    .where((id) => id.startsWith('${level.code}-'))
                    .length;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 9),
                  child: Row(
                    children: [
                      Container(
                        width: 34,
                        height: 34,
                        decoration: BoxDecoration(
                          color: level.color.withAlpha(25),
                          borderRadius: BorderRadius.circular(11),
                        ),
                        child: Icon(
                          completed
                              ? Icons.check_rounded
                              : unlocked
                              ? Icons.play_arrow_rounded
                              : Icons.lock_rounded,
                          color: level.color,
                          size: 18,
                        ),
                      ),
                      const SizedBox(width: 9),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${level.code} · ${level.title}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 11,
                              ),
                            ),
                            Text(
                              '$learned/${level.words.length} слов · ${completed
                                  ? 'Куиз пройден'
                                  : unlocked
                                  ? 'Доступен'
                                  : 'Закрыт'}',
                              style: const TextStyle(color: muted, fontSize: 9),
                            ),
                          ],
                        ),
                      ),
                      if (completed)
                        const Icon(
                          Icons.verified_rounded,
                          color: green,
                          size: 18,
                        ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
        const SizedBox(height: 13),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF5E9),
            borderRadius: BorderRadius.circular(22),
          ),
          child: Row(
            children: [
              const Text('🔥', style: TextStyle(fontSize: 26)),
              const SizedBox(width: 11),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${progress.streak} ${_daysWord(progress.streak)} подряд',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      'Лучшая серия: ${progress.bestStreak} ${_daysWord(progress.bestStreak)}',
                      style: const TextStyle(color: muted, fontSize: 10),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.local_fire_department_rounded,
                color: orange,
                size: 26,
              ),
            ],
          ),
        ),
        const SizedBox(height: 17),
        OutlinedButton.icon(
          onPressed: () => _confirmReset(context, progress),
          icon: const Icon(Icons.restart_alt_rounded),
          label: const Text('Сбросить весь прогресс'),
          style: OutlinedButton.styleFrom(
            foregroundColor: pink,
            side: BorderSide(color: pink.withAlpha(100)),
            padding: const EdgeInsets.symmetric(vertical: 13),
          ),
        ),
      ],
    );
  }
}

String _levelTitle(int level) {
  const titles = [
    'Новичок',
    'Ученик',
    'Знаток',
    'Практик',
    'Уверенный',
    'Продвинутый',
    'Мастер',
    'Эксперт',
    'Полиглот',
  ];
  return titles[(level - 1).clamp(0, titles.length - 1)];
}

String _daysWord(int count) {
  final m = count % 10;
  final h = count % 100;
  if (h >= 11 && h <= 14) return 'дней';
  if (m == 1) return 'день';
  if (m >= 2 && m <= 4) return 'дня';
  return 'дней';
}

class _StatTile extends StatelessWidget {
  const _StatTile({
    required this.emoji,
    required this.number,
    required this.label,
    required this.color,
  });
  final String emoji, number, label;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(21),
      border: Border.all(color: const Color(0xFFF0EDF5)),
    ),
    child: Row(
      children: [
        Container(
          width: 37,
          height: 37,
          decoration: BoxDecoration(
            color: color.withAlpha(22),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Text(emoji, style: const TextStyle(fontSize: 18)),
          ),
        ),
        const SizedBox(width: 9),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                number,
                style: const TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w900,
                ),
              ),
              Text(
                label,
                style: const TextStyle(
                  color: muted,
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

Future<void> _editName(
  BuildContext context,
  ProgressController progress,
) async {
  final controller = TextEditingController(text: progress.displayName);
  final result = await showDialog<String>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Как тебя называть?'),
      content: TextField(
        controller: controller,
        autofocus: true,
        maxLength: 20,
        decoration: const InputDecoration(hintText: 'Имя'),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Отмена'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context, controller.text),
          child: const Text('Сохранить'),
        ),
      ],
    ),
  );
  if (result != null) progress.rename(result);
  controller.dispose();
}

Future<void> _confirmReset(
  BuildContext context,
  ProgressController progress,
) async {
  final confirmed = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Сбросить прогресс?'),
      content: const Text(
        'XP, изученные слова и статистика будут удалены. Это действие нельзя отменить.',
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Отмена'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context, true),
          style: FilledButton.styleFrom(backgroundColor: pink),
          child: const Text('Сбросить'),
        ),
      ],
    ),
  );
  if (confirmed == true) {
    progress.reset();
    if (context.mounted) _toast(context, 'Прогресс сброшен');
  }
}

class _PageHeading extends StatelessWidget {
  const _PageHeading({
    required this.eyebrow,
    required this.title,
    required this.subtitle,
  });
  final String eyebrow, title, subtitle;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        eyebrow,
        style: const TextStyle(
          color: purple,
          fontSize: 9,
          fontWeight: FontWeight.w900,
          letterSpacing: 1.5,
        ),
      ),
      const SizedBox(height: 3),
      Text(
        title,
        style: const TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w900,
          letterSpacing: -.8,
        ),
      ),
      const SizedBox(height: 3),
      Text(subtitle, style: const TextStyle(color: muted, fontSize: 12)),
    ],
  );
}

void _toast(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 2),
    ),
  );
}

final FlutterTts _speech = FlutterTts();

Future<void> _speak(BuildContext context, String text) async {
  try {
    await _speech.setLanguage('en-US');
    await _speech.setSpeechRate(0.42);
    await _speech.speak(text);
  } catch (_) {
    if (context.mounted) _toast(context, 'Произнеси вслух: “$text”');
  }
}
