import type { TaskPriority, TaskStatus } from "./kit";

export type Role = "owner" | "member" | "viewer";

export type Person = { id: string; name: string; role: Role };

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
  due?: string;
  /** срок прошёл — дата показывается красной и подписью «просрочено» */
  overdue?: boolean;
  position: number;
};


export type AcceptanceItem = { id: string; text: string; done: boolean; due?: string };

export type Subtask = {
  id: string;
  code: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  estimateMin: number;
  spentMin: number;
};

export type FeedItem =
  | {
      kind: "comment";
      id: string;
      author: string;
      date: string;
      time: string;
      text: string;
      mentions?: string[];
    }
  | {
      kind: "event";
      id: string;
      actor: string;
      date: string;
      time: string;
      text: string;
      tone: "neutral" | "ok" | "warn" | "info" | "danger";
    };

export type TaskTag = { id: string; name: string; color: string };

export type TaskDetail = {
  id: string;
  code: string;
  title: string;
  description: string;
  space: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  needsAcceptance: boolean;
  author: Person;
  assignee: Person;
  watchers: Person[];
  startDate: string;
  deadline: string;
  estimateMin: number;
  spentMin: number;
  tags: TaskTag[];
  checklist: ChecklistItem[];
  acceptance: AcceptanceItem[];
  subtasks: Subtask[];
  feed: FeedItem[];
  /** роль текущего пользователя в пространстве */
  viewerRole: Role;
  /** текущий пользователь */
  viewerId: string;
};

export const taskDetail: TaskDetail = {
  id: "2481",
  code: "LH-2481",
  title: "Интеграция с платёжным шлюзом ЦБ",
  description:
    "Подключить шлюз, закрыть сверку тестовых транзакций и пройти приёмку до релиза 14 июня. Отдельно проверить поведение при батчах больше 500 записей — на них раньше падал таймаут.",
  space: "Работа",
  project: "Запуск платёжного шлюза",
  status: "В работе",
  priority: "Высокий",
  needsAcceptance: true,
  author: { id: "u-ik", name: "Ирина Ковалёва", role: "owner" },
  assignee: { id: "u-av", name: "Анна Верёвкина", role: "member" },
  watchers: [
    { id: "u-ds", name: "Дмитрий Соловьёв", role: "member" },
    { id: "u-mp", name: "Марина Панова", role: "member" },
    { id: "u-ss", name: "Сергей Штейн", role: "viewer" },
    { id: "u-og", name: "Олег Гринь", role: "member" },
    { id: "u-nk", name: "Нина Кац", role: "viewer" },
  ],
  startDate: "02 июн",
  deadline: "14 июн, 12:00",
  estimateMin: 480,
  spentMin: 320,
  tags: [
    { id: "tg-1", name: "Интеграции", color: "oklch(0.62 0.12 258)" },
    { id: "tg-2", name: "Платежи", color: "oklch(0.63 0.12 155)" },
    { id: "tg-3", name: "Q3", color: "oklch(0.66 0.12 70)" },
  ],
  acceptance: [
    { id: "a-1", text: "Все тестовые транзакции проходят сверку", done: true, due: "08 июн" },
    { id: "a-2", text: "Подписан лист согласования с ЦБ", done: false, due: "14 июн" },
  ],
  checklist: [
    { id: "c-1", text: "Подключить тестовый стенд", done: true, due: "04 июн", position: 1 },
    { id: "c-2", text: "Настроить шифрование ключей", done: true, due: "06 июн", position: 2 },
    { id: "c-3", text: "Проверить обработку вебхуков", done: false, due: "10 июн", overdue: true, position: 3 },
    { id: "c-4", text: "Согласовать лимиты с платёжной группой", done: false, due: "11 июн", overdue: true, position: 4 },
    { id: "c-5", text: "Провести нагрузочное тестирование", done: false, due: "13 июн", position: 5 },
  ],

  subtasks: [
    { id: "s-1", code: "LH-2483", title: "API сверки остатков", status: "Готово", assignee: "Дмитрий Соловьёв", estimateMin: 240, spentMin: 120 },
    { id: "s-2", code: "LH-2484", title: "Модуль возврата средств", status: "В работе", assignee: "Анна Верёвкина", estimateMin: 300, spentMin: 180 },
    { id: "s-3", code: "LH-2485", title: "Дашборд по ошибкам транзакций", status: "Новая", assignee: "Марина Панова", estimateMin: 180, spentMin: 60 },
    { id: "s-4", code: "LH-2486", title: "Отчёт по сверке для ЦБ", status: "На приёмке", assignee: "Олег Гринь", estimateMin: 120, spentMin: 0 },
  ],
  feed: [
    {
      kind: "event",
      id: "f-1",
      actor: "Ирина Ковалёва",
      date: "09 июн",
      time: "17:40",
      text: "поставила задачу и назначила исполнителем Анну Верёвкину",
      tone: "neutral",
    },
    {
      kind: "comment",
      id: "f-2",
      author: "Анна Верёвкина",
      date: "10 июн",
      time: "10:24",
      text: "Закрыла сверку остатков на стенде — суммы приходят корректно даже с дробными значениями.",
    },
    {
      kind: "event",
      id: "f-3",
      actor: "Анна Верёвкина",
      date: "10 июн",
      time: "10:26",
      text: "перевела задачу из «Новая» в «В работе»",
      tone: "info",
    },
    {
      kind: "comment",
      id: "f-4",
      author: "Дмитрий Соловьёв",
      date: "10 июн",
      time: "11:02",
      text: "В логах шлюза таймаут 504 на /reconcile при батче больше 500 записей. Поднял повтор с задержкой 2 секунды.",
    },
    {
      kind: "event",
      id: "f-5",
      actor: "Дмитрий Соловьёв",
      date: "10 июн",
      time: "11:05",
      text: "приложил файл gateway-timeout.log, текст извлечён",
      tone: "neutral",
    },
    {
      kind: "comment",
      id: "f-6",
      author: "Ирина Ковалёва",
      date: "11 июн",
      time: "12:40",
      text: "@Анна Верёвкина лимиты согласованы с платёжной группой, можно продолжать.",
      mentions: ["Анна Верёвкина"],
    },
    {
      kind: "event",
      id: "f-7",
      actor: "Анна Верёвкина",
      date: "11 июн",
      time: "18:02",
      text: "отметила пункт чек-листа «Настроить шифрование ключей»",
      tone: "ok",
    },
    {
      kind: "event",
      id: "f-8",
      actor: "Ирина Ковалёва",
      date: "12 июн",
      time: "09:10",
      text: "перенесла дедлайн с 12 июня на 14 июня",
      tone: "warn",
    },
    {
      kind: "comment",
      id: "f-9",
      author: "Дмитрий Соловьёв",
      date: "12 июн",
      time: "09:15",
      text: "Обновил схему вебхуков: подпись HMAC SHA-256, версия payload v2. Стенд перезапущен.",
    },
  ],
  viewerRole: "owner",
  viewerId: "u-av",
};

export const taskHints: { id: string; text: string; important?: boolean }[] = [
  {
    id: "h-1",
    text: "Нагрузочное тестирование блокирует приёмку. Запустите его до 12 июня, иначе срок сдвинется на три дня.",
    important: true,
  },
  { id: "h-2", text: "Похожие задачи закрывались за 9 часов, здесь оценка 8 часов." },
  { id: "h-3", text: "Ирина уже согласовала лимиты — пункт «Согласовать лимиты» можно закрывать." },
];

/* --- Данные диалогов задачи --------------------------------- */

export const spaceProjects: { id: string; name: string; space: string }[] = [
  { id: "p-1", name: "Запуск платёжного шлюза", space: "Работа" },
  { id: "p-2", name: "Мобильный кабинет", space: "Работа" },
  { id: "p-3", name: "Реестр контрагентов", space: "Работа" },
  { id: "p-4", name: "Внутренние регламенты", space: "Работа" },
];

export const spaceMembers: Person[] = [
  { id: "u-av", name: "Анна Верёвкина", role: "member" },
  { id: "u-ds", name: "Дмитрий Соловьёв", role: "member" },
  { id: "u-mp", name: "Марина Панова", role: "member" },
  { id: "u-og", name: "Олег Гринь", role: "member" },
  { id: "u-nk", name: "Нина Кац", role: "viewer" },
  { id: "u-ss", name: "Сергей Штейн", role: "viewer" },
  { id: "u-ik", name: "Ирина Ковалёва", role: "owner" },
];

export const aiSubtaskSuggestions: {
  id: string;
  title: string;
  estimateMin: number;
  reason: string;
}[] = [
  { id: "ai-1", title: "Повтор запроса при таймауте /reconcile", estimateMin: 120, reason: "В ленте зафиксирован 504 на батчах больше 500 записей" },
  { id: "ai-2", title: "Нагрузочный прогон на 5 000 транзакций", estimateMin: 180, reason: "Блокирует приёмку, срок 12 июня" },
  { id: "ai-3", title: "Сверка подписи вебхуков HMAC SHA-256", estimateMin: 90, reason: "Схема обновлена до payload v2" },
  { id: "ai-4", title: "Инструкция по откату релиза", estimateMin: 60, reason: "Похожие задачи закрывались с этим пунктом" },
];
