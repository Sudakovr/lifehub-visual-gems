/* Демонстрационные данные блока «С чего начать с ИИ» на экране «Сегодня».
   Все примеры помечаются в интерфейсе как демонстрация — это не статистика пользователя. */

export type Composition = "expressive" | "compact";
export type Visit = "first" | "repeat";
export type AiState =
  | "ready"
  | "no-tasks"
  | "ai-off"
  | "loading"
  | "error"
  | "limit"
  | "stale"
  | "low-confidence";

export const aiStates: { id: AiState; label: string }[] = [
  { id: "ready", label: "Есть задачи" },
  { id: "no-tasks", label: "Пока нет задач" },
  { id: "ai-off", label: "ИИ отключён" },
  { id: "loading", label: "Запрос выполняется" },
  { id: "error", label: "Ошибка" },
  { id: "limit", label: "Исчерпан лимит" },
  { id: "stale", label: "План устарел" },
  { id: "low-confidence", label: "Мало данных" },
];

export type ParsedDraft = { title: string; due: string; priority: "Критический" | "Высокий" | "Обычный" | "Низкий" };

export const parseExample = {
  input: "Отправить КП клиенту завтра до 15:00",
  draft: { title: "Отправить КП клиенту", due: "завтра, 15:00", priority: "Обычный" } satisfies ParsedDraft,
  caption: "Проверьте поля перед созданием",
};

export type PlanExampleItem = { title: string; reason: string; code: string; lowConfidence?: boolean };

export const planExample: PlanExampleItem[] = [
  { title: "Подготовить КП", reason: "срок завтра", code: "LH-2540" },
  { title: "Проверить расчёт", reason: "нужно перед отправкой КП", code: "LH-2541", lowConfidence: true },
];

export const weekExample = {
  metrics: [
    { label: "Закрыто", value: "6 задач" },
    { label: "Без движения", value: "2" },
    { label: "Учтено", value: "8 ч 30 мин" },
  ],
  attention: "Смета ждёт решения",
  caption: "Посмотрите, что продвинулось и что требует внимания",
};
