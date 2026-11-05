# Parlyo

Приложение для изучения английского языка на русском (уровни A1–C1). В репозитории есть две версии:

- **Web (Vite + React + TypeScript)** — в `src/`
- **Flutter (Android/iOS/Web)** — в `lib/`

## Запуск

### Веб-версия (Vite)
Требования: Node.js 18+, npm.

```bash
npm install
npm run dev
```

Приложение запустится на `http://127.0.0.1:5183`.

Сборка и предпросмотр:
```bash
npm run build
npm run preview
```

### Flutter-версия
Требования: Flutter SDK (совместим с Dart ^3.12.1).

```bash
flutter pub get
flutter run
```

Для запуска в Chrome (Flutter Web):
```bash
flutter run -d chrome
flutter build web
```

## Сборка APK (Android)
Требования: настроенный Android SDK.

Собрать release APK:
```bash
flutter build apk --release
```

Готовый файл:
```
build/app/outputs/flutter-apk/app-release.apk
```

Установить на подключённое устройство:
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

Если нужен отдельный APK под каждую архитектуру:
```bash
flutter build apk --split-per-abi --release
```
