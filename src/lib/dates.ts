import { dayKey } from "../data";

export const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export const WEEKDAYS_RU = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

export const WEEKDAYS_SHORT = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

/** Сегодняшняя дата словами: «24 ноября, вторник». */
export function humanDate(date = new Date()): string {
  return `${date.getDate()} ${MONTHS_RU[date.getMonth()]}, ${WEEKDAYS_RU[date.getDay()]}`;
}

/** Последние n дней, от старых к новым. */
export function lastNDays(n: number, end = new Date()): Date[] {
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Array.from({ length: n }, (_, index) => {
    const date = new Date(endDay);
    date.setDate(endDay.getDate() - (n - 1 - index));
    return date;
  });
}

export function weekdayShortMon(date: Date): string {
  return WEEKDAYS_SHORT[(date.getDay() + 6) % 7];
}

export function isToday(date: Date): boolean {
  return dayKey(date) === dayKey(new Date());
}

export function lastNDayKeys(n: number, end = new Date()): string[] {
  return lastNDays(n, end).map((date) => dayKey(date));
}

/** Подпись месяца для начала периода — «нояб.». */
export function shortMonth(date: Date): string {
  return MONTHS_RU[date.getMonth()].slice(0, 3);
}
