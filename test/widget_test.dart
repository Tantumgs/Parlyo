import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:parlyo/main.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Parlyo opens in Russian with the English learning path', (
    tester,
  ) async {
    final progress = ProgressController()..loaded = true;
    await tester.pumpWidget(ParlyoApp(progress: progress));
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Parlyo'), findsOneWidget);
    expect(find.text('Главная'), findsOneWidget);
    expect(find.text('Твой маршрут'), findsOneWidget);
    expect(find.textContaining('A1'), findsWidgets);
    expect(find.text('Слова'), findsOneWidget);
    expect(find.text('Куизы'), findsOneWidget);
  });

  test('Learning a new word awards XP only once', () {
    final progress = ProgressController();
    expect(progress.learn('A1-hello'), isTrue);
    expect(progress.xp, 10);
    expect(progress.learn('A1-hello'), isFalse);
    expect(progress.xp, 10);
  });

  test('A passing A1 score unlocks A2 and marks A1 complete', () {
    final progress = ProgressController();
    expect(progress.isLevelUnlocked('A1'), isTrue);
    expect(progress.isLevelUnlocked('A2'), isFalse);

    final passed = progress.completeQuiz(correct: 6, total: 8, levelCode: 'A1');

    expect(passed, isTrue);
    expect(progress.isLevelCompleted('A1'), isTrue);
    expect(progress.isLevelUnlocked('A2'), isTrue);
    expect(progress.isLevelUnlocked('B1'), isFalse);
    expect(progress.xp, 30);
    expect(progress.quizzesDone, 1);
  });

  test('A score below the pass threshold keeps the next level locked', () {
    final progress = ProgressController();
    final passed = progress.completeQuiz(correct: 5, total: 8, levelCode: 'A1');

    expect(passed, isFalse);
    expect(progress.isLevelCompleted('A1'), isFalse);
    expect(progress.isLevelUnlocked('A2'), isFalse);
  });

  test('A thematic quiz does not complete a language level', () {
    final progress = ProgressController();
    final passed = progress.completeQuiz(
      correct: 8,
      total: 8,
      levelCode: 'theme-Еда',
    );

    expect(passed, isFalse);
    expect(progress.completedLevels, isEmpty);
    expect(progress.isLevelUnlocked('A2'), isFalse);
  });

  test(
    'Completed and unlocked levels survive loading saved progress',
    () async {
      SharedPreferences.setMockInitialValues({});
      final progress = ProgressController();
      progress.completeQuiz(correct: 6, total: 8, levelCode: 'A1');
      await Future<void>.delayed(const Duration(milliseconds: 100));

      final restored = ProgressController();
      await restored.load();

      expect(restored.isLevelCompleted('A1'), isTrue);
      expect(restored.isLevelUnlocked('A2'), isTrue);
      expect(restored.isLevelUnlocked('B1'), isFalse);
      expect(restored.xp, 30);
    },
  );

  test(
    'Older saves migrate completed levels to the next unlocked level',
    () async {
      SharedPreferences.setMockInitialValues({
        'parlyo.progress.v1': jsonEncode({
          'xp': 60,
          'completedLevels': ['A1'],
        }),
      });

      final restored = ProgressController();
      await restored.load();

      expect(restored.isLevelCompleted('A1'), isTrue);
      expect(restored.isLevelUnlocked('A2'), isTrue);
      expect(restored.isLevelUnlocked('B1'), isFalse);

      final preferences = await SharedPreferences.getInstance();
      final saved =
          jsonDecode(preferences.getString('parlyo.progress.v1')!)
              as Map<String, dynamic>;
      expect(saved['unlockedLevels'], contains('A2'));
    },
  );
}
