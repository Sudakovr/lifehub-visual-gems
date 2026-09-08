import type { TaskPriority, TaskStatus } from "./kit";

/* ------------------------------------------------------------------
   Данные модуля «Проекты». Модель повторяет продуктовую:
   проект, задача, файл, заметка, запись времени, участник.
------------------------------------------------------------------ */

export type ProjectStatus =
  | "Черновик"
  | "Активен"
  | "Пауза"
  | "Завершён"
  | "Отменён"
  | "В архиве";

export type RiskLevel = "Низкий" | "Средний" | "Высокий";

export type SpaceTag = { id: string; name: string; color: string };

export type ProjectMember = {
  id: string;
  name: string;
  role: "owner" | "member" | "viewer";
  title: string;
};

export type ProjectRow = {
  id: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  progress: number;
  nextDue: string;
  nextDueNote: string;
  overdue?: boolean;
  members: string[];
  tasksOpen: number;
  tasksTotal: number;
  risk: RiskLevel;
  riskReason: string;
  tags: string[];
  archived?: boolean;
};

export const spaceTags: SpaceTag[] = [
  { id: "tg-1", name: "Интеграции", color: "oklch(0.62 0.12 258)" },
  { id: "tg-2", name: "Платежи", color: "oklch(0.63 0.12 155)" },
  { id: "tg-3", name: "Q3", color: "oklch(0.66 0.12 70)" },
  { id: "tg-4", name: "Клиенты", color: "oklch(0.62 0.13 25)" },
  { id: "tg-5", name: "Внутреннее", color: "oklch(0.6 0.03 260)" },
];

export const projects: ProjectRow[] = [
  {
    id: "p-1",
    name: "Запуск платёжного шлюза",
    summary: "Подключение шлюза ЦБ, сверка транзакций и приёмка до релиза.",
    status: "Активен",
    progress: 64,
    nextDue: "14 июн",
    nextDueNote: "Приёмка сверки",
    members: ["Анна Верёвкина", "Дмитрий Соловьёв", "Ирина Ковалёва", "Олег Гринь"],
    tasksOpen: 14,
    tasksTotal: 39,
    risk: "Высокий",
    riskReason: "Две задачи просрочены, нагрузочное тестирование не начато",
    tags: ["Интеграции", "Платежи", "Q3"],
  },
  {
    id: "p-2",
    name: "Переезд на новый складской учёт",
    summary: "Миграция остатков и обучение кладовщиков в трёх филиалах.",
    status: "Активен",
    progress: 41,
    nextDue: "18 июн",
    nextDueNote: "Миграция остатков",
    members: ["Марина Панова", "Сергей Штейн", "Нина Кац"],
    tasksOpen: 22,
    tasksTotal: 48,
    risk: "Средний",
    riskReason: "Филиал в Казани не подтвердил дату обучения",
    tags: ["Внутреннее"],
  },
  {
    id: "p-3",
    name: "Редизайн личного кабинета",
    summary: "Новая навигация, тёмная тема и мобильные экраны кабинета.",
    status: "Активен",
    progress: 78,
    nextDue: "11 июн",
    nextDueNote: "Приёмка макетов",
    overdue: true,
    members: ["Олег Гринь", "Анна Верёвкина"],
    tasksOpen: 6,
    tasksTotal: 31,
    risk: "Средний",
    riskReason: "Приёмка макетов просрочена на 1 день",
    tags: ["Клиенты", "Q3"],
  },
  {
    id: "p-4",
    name: "Договоры с подрядчиками",
    summary: "Сбор закрывающих документов и сверка актов за второй квартал.",
    status: "Пауза",
    progress: 33,
    nextDue: "01 июл",
    nextDueNote: "Возврат к работе",
    members: ["Ирина Ковалёва", "Нина Кац"],
    tasksOpen: 9,
    tasksTotal: 17,
    risk: "Низкий",
    riskReason: "Проект на паузе по решению владельца",
    tags: ["Внутреннее"],
  },
  {
    id: "p-5",
    name: "Онбординг новых клиентов",
    summary: "Сценарии первых семи дней и письма поддержки.",
    status: "Активен",
    progress: 52,
    nextDue: "20 июн",
    nextDueNote: "Черновик писем",
    members: ["Марина Панова", "Олег Гринь", "Анна Верёвкина", "Сергей Штейн", "Нина Кац"],
    tasksOpen: 17,
    tasksTotal: 35,
    risk: "Низкий",
    riskReason: "Сроки выдерживаются, свободных исполнителей достаточно",
    tags: ["Клиенты"],
  },
  {
    id: "p-6",
    name: "Мобильное приложение — бета",
    summary: "Сборка беты, закрытый список тестировщиков, сбор отзывов.",
    status: "Черновик",
    progress: 8,
    nextDue: "25 июн",
    nextDueNote: "Утверждение объёма",
    members: ["Дмитрий Соловьёв"],
    tasksOpen: 4,
    tasksTotal: 4,
    risk: "Средний",
    riskReason: "Объём работ не утверждён, исполнители не назначены",
    tags: ["Q3"],
  },
  {
    id: "p-7",
    name: "Отчётность для ЦБ",
    summary: "Ежемесячные выгрузки и проверка форматов перед отправкой.",
    status: "Активен",
    progress: 71,
    nextDue: "16 июн",
    nextDueNote: "Выгрузка за май",
    members: ["Ирина Ковалёва", "Дмитрий Соловьёв", "Марина Панова"],
    tasksOpen: 8,
    tasksTotal: 27,
    risk: "Низкий",
    riskReason: "Все сроки в пределах плана",
    tags: ["Платежи"],
  },
  {
    id: "p-8",
    name: "Переговоры с банком-партнёром",
    summary: "Условия эквайринга и подготовка пилота на двух точках.",
    status: "Активен",
    progress: 27,
    nextDue: "13 июн",
    nextDueNote: "Ответ по тарифам",
    overdue: true,
    members: ["Ирина Ковалёва", "Сергей Штейн"],
    tasksOpen: 11,
    tasksTotal: 15,
    risk: "Высокий",
    riskReason: "Банк не ответил по тарифам, пилот сдвигается",
    tags: ["Платежи", "Клиенты"],
  },
  {
    id: "p-9",
    name: "Обновление базы знаний",
    summary: "Переписать инструкции поддержки под новый интерфейс.",
    status: "Активен",
    progress: 46,
    nextDue: "27 июн",
    nextDueNote: "Раздел «Оплата»",
    members: ["Нина Кац", "Марина Панова"],
    tasksOpen: 13,
    tasksTotal: 24,
    risk: "Низкий",
    riskReason: "Работа идёт равномерно",
    tags: ["Внутреннее"],
  },
  {
    id: "p-10",
    name: "Летний интенсив для команды",
    summary: "Программа обучения, расписание и материалы.",
    status: "Завершён",
    progress: 100,
    nextDue: "—",
    nextDueNote: "Все задачи закрыты",
    members: ["Олег Гринь", "Нина Кац"],
    tasksOpen: 0,
    tasksTotal: 19,
    risk: "Низкий",
    riskReason: "Проект закрыт 04 июня",
    tags: ["Внутреннее"],
  },
  {
    id: "p-11",
    name: "Пилот с сетью аптек",
    summary: "Тестовая интеграция и обучение двух аптек сети.",
    status: "Отменён",
    progress: 22,
    nextDue: "—",
    nextDueNote: "Отменён 29 мая",
    members: ["Сергей Штейн"],
    tasksOpen: 0,
    tasksTotal: 12,
    risk: "Низкий",
    riskReason: "Клиент отказался от пилота",
    tags: ["Клиенты"],
  },
  {
    id: "p-12",
    name: "Каталог поставщиков 2025",
    summary: "Ежегодная сверка и архив прошлогодних условий.",
    status: "В архиве",
    progress: 100,
    nextDue: "—",
    nextDueNote: "В архиве с 12 января",
    members: ["Марина Панова"],
    tasksOpen: 0,
    tasksTotal: 41,
    risk: "Низкий",
    riskReason: "Архивный проект",
    tags: ["Внутреннее"],
    archived: true,
  },
  {
    id: "p-13",
    name: "Миграция почтовых рассылок",
    summary: "Перенос шаблонов и списков в новый сервис.",
    status: "В архиве",
    progress: 100,
    nextDue: "—",
    nextDueNote: "В архиве с 03 марта",
    members: ["Дмитрий Соловьёв", "Нина Кац"],
    tasksOpen: 0,
    tasksTotal: 23,
    risk: "Низкий",
    riskReason: "Архивный проект",
    tags: ["Внутреннее"],
    archived: true,
  },
];

export function getProject(id: string): ProjectRow {
  return projects.find((p) => p.id === id) ?? projects[0];
}

/* --- Обзор проекта --------------------------------------------- */

export type SummarySource = { label: string; hint: string };

export const projectSummary: { text: string; sources: SummarySource[] }[] = [
  {
    text: "Шлюз подключён на тестовом стенде, сверка проходит на всех типовых операциях.",
    sources: [
      { label: "LH-2481", hint: "Интеграция с платёжным шлюзом ЦБ" },
      { label: "gateway-timeout.log", hint: "Файл от 10 июня" },
    ],
  },
  {
    text: "Остаётся нагрузочное тестирование: на батчах больше 500 записей шлюз отдавал таймаут, повтор с задержкой помог, но проверка на объёме не проводилась.",
    sources: [{ label: "LH-2484", hint: "Модуль возврата средств" }],
  },
  {
    text: "Два пункта чек-листа просрочены на один и два дня — обработка вебхуков и лимиты платёжной группы.",
    sources: [{ label: "Чек-лист LH-2481", hint: "5 пунктов, 2 просрочены" }],
  },
  {
    text: "Ирина согласовала лимиты 11 июня, поэтому блокировка снята и приёмку можно готовить.",
    sources: [{ label: "Комментарий Ирины", hint: "11 июня, 12:40" }],
  },
  {
    text: "При текущем темпе приёмка успевает к 14 июня, если нагрузочное тестирование стартует не позже 12 июня.",
    sources: [{ label: "Отчёт по времени", hint: "112 ч из 148 ч плана" }],
  },
];

export const statusBreakdown: { status: TaskStatus; count: number }[] = [
  { status: "Новая", count: 6 },
  { status: "В работе", count: 5 },
  { status: "Пауза", count: 1 },
  { status: "На приёмке", count: 2 },
  { status: "Готово", count: 24 },
  { status: "Отменена", count: 1 },
];

export const upcoming: { code: string; title: string; due: string; assignee: string; overdue?: boolean }[] = [
  { code: "LH-2481", title: "Интеграция с платёжным шлюзом ЦБ", due: "14 июн, 12:00", assignee: "Анна Верёвкина" },
  { code: "LH-2486", title: "Отчёт по сверке для ЦБ", due: "13 июн, 18:00", assignee: "Олег Гринь" },
  { code: "LH-2490", title: "Проверить обработку вебхуков", due: "10 июн, 18:00", assignee: "Дмитрий Соловьёв", overdue: true },
  { code: "LH-2492", title: "Согласовать лимиты с платёжной группой", due: "11 июн, 12:00", assignee: "Ирина Ковалёва", overdue: true },
  { code: "LH-2494", title: "Нагрузочное тестирование", due: "16 июн, 10:00", assignee: "Дмитрий Соловьёв" },
];

export const riskReasons: { text: string; tone: "danger" | "warn" | "neutral" }[] = [
  { text: "Две задачи просрочены дольше суток", tone: "danger" },
  { text: "Нагрузочное тестирование не начато за 2 дня до приёмки", tone: "warn" },
  { text: "На Анне Верёвкиной 4 из 8 открытых задач", tone: "warn" },
  { text: "Оценка выработана на 76 %, запас 36 часов", tone: "neutral" },
];

export const projectMembers: ProjectMember[] = [
  { id: "u-ik", name: "Ирина Ковалёва", role: "owner", title: "Владелец проекта" },
  { id: "u-av", name: "Анна Верёвкина", role: "member", title: "Разработка интеграции" },
  { id: "u-ds", name: "Дмитрий Соловьёв", role: "member", title: "Бэкенд и нагрузка" },
  { id: "u-og", name: "Олег Гринь", role: "member", title: "Отчётность" },
  { id: "u-mp", name: "Марина Панова", role: "member", title: "Аналитика" },
  { id: "u-nk", name: "Нина Кац", role: "viewer", title: "Наблюдатель от поддержки" },
];

export const projectEvents: { id: string; actor: string; text: string; date: string; time: string }[] = [
  { id: "e-1", actor: "Дмитрий Соловьёв", text: "приложил файл gateway-timeout.log", date: "12 июн", time: "09:15" },
  { id: "e-2", actor: "Ирина Ковалёва", text: "перенесла дедлайн LH-2481 с 12 на 14 июня", date: "12 июн", time: "09:10" },
  { id: "e-3", actor: "Анна Верёвкина", text: "отметила пункт «Настроить шифрование ключей»", date: "11 июн", time: "18:02" },
  { id: "e-4", actor: "Ирина Ковалёва", text: "согласовала лимиты платёжной группы", date: "11 июн", time: "12:40" },
  { id: "e-5", actor: "Олег Гринь", text: "отправил LH-2486 на приёмку", date: "11 июн", time: "10:20" },
  { id: "e-6", actor: "Марина Панова", text: "создала заметку «Схема вебхуков v2»", date: "10 июн", time: "16:44" },
];

export const projectTime = {
  totalMin: 6720,
  billableMin: 4980,
  planMin: 8880,
  weekMin: 1140,
};

/* --- Задачи проекта -------------------------------------------- */

export type ProjectTask = {
  id: string;
  code: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  author: string;
  due: string;
  overdue?: boolean;
  estimateMin: number;
  spentMin: number;
  comments: number;
  checklistDone: number;
  checklistTotal: number;
  tags: string[];
  parentId?: string;
};

export const projectTasks: ProjectTask[] = [
  { id: "t-1", code: "LH-2481", title: "Интеграция с платёжным шлюзом ЦБ", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", author: "Ирина Ковалёва", due: "14 июн", estimateMin: 480, spentMin: 320, comments: 6, checklistDone: 2, checklistTotal: 5, tags: ["Интеграции"] },
  { id: "t-2", code: "LH-2483", title: "API сверки остатков", status: "Готово", priority: "Обычный", assignee: "Дмитрий Соловьёв", author: "Ирина Ковалёва", due: "08 июн", estimateMin: 240, spentMin: 260, comments: 3, checklistDone: 4, checklistTotal: 4, tags: ["Интеграции"], parentId: "t-1" },
  { id: "t-3", code: "LH-2484", title: "Модуль возврата средств", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", author: "Ирина Ковалёва", due: "13 июн", estimateMin: 300, spentMin: 180, comments: 4, checklistDone: 1, checklistTotal: 3, tags: ["Платежи"], parentId: "t-1" },
  { id: "t-4", code: "LH-2487", title: "Обработка частичного возврата", status: "Новая", priority: "Обычный", assignee: "Олег Гринь", author: "Анна Верёвкина", due: "17 июн", estimateMin: 120, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 2, tags: ["Платежи"], parentId: "t-3" },
  { id: "t-5", code: "LH-2485", title: "Дашборд по ошибкам транзакций", status: "Новая", priority: "Низкий", assignee: "Марина Панова", author: "Ирина Ковалёва", due: "21 июн", estimateMin: 180, spentMin: 60, comments: 1, checklistDone: 0, checklistTotal: 3, tags: ["Интеграции"] },
  { id: "t-6", code: "LH-2486", title: "Отчёт по сверке для ЦБ", status: "На приёмке", priority: "Высокий", assignee: "Олег Гринь", author: "Ирина Ковалёва", due: "13 июн", estimateMin: 120, spentMin: 140, comments: 5, checklistDone: 3, checklistTotal: 3, tags: ["Платежи"] },
  { id: "t-7", code: "LH-2490", title: "Проверить обработку вебхуков", status: "В работе", priority: "Критический", assignee: "Дмитрий Соловьёв", author: "Анна Верёвкина", due: "10 июн", overdue: true, estimateMin: 180, spentMin: 210, comments: 8, checklistDone: 1, checklistTotal: 4, tags: ["Интеграции"] },
  { id: "t-8", code: "LH-2491", title: "Подпись HMAC для входящих вебхуков", status: "Готово", priority: "Обычный", assignee: "Дмитрий Соловьёв", author: "Дмитрий Соловьёв", due: "09 июн", estimateMin: 90, spentMin: 80, comments: 2, checklistDone: 2, checklistTotal: 2, tags: ["Интеграции"], parentId: "t-7" },
  { id: "t-9", code: "LH-2492", title: "Согласовать лимиты с платёжной группой", status: "Пауза", priority: "Высокий", assignee: "Ирина Ковалёва", author: "Ирина Ковалёва", due: "11 июн", overdue: true, estimateMin: 60, spentMin: 45, comments: 4, checklistDone: 0, checklistTotal: 1, tags: ["Платежи"] },
  { id: "t-10", code: "LH-2494", title: "Нагрузочное тестирование шлюза", status: "Новая", priority: "Критический", assignee: "Дмитрий Соловьёв", author: "Ирина Ковалёва", due: "16 июн", estimateMin: 300, spentMin: 0, comments: 2, checklistDone: 0, checklistTotal: 5, tags: ["Интеграции", "Q3"] },
  { id: "t-11", code: "LH-2495", title: "Сценарий на 5000 операций", status: "Новая", priority: "Обычный", assignee: "Марина Панова", author: "Дмитрий Соловьёв", due: "15 июн", estimateMin: 120, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 2, tags: ["Q3"], parentId: "t-10" },
  { id: "t-12", code: "LH-2496", title: "Мониторинг ошибок на стенде", status: "Новая", priority: "Низкий", assignee: "Марина Панова", author: "Дмитрий Соловьёв", due: "19 июн", estimateMin: 90, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 1, tags: ["Внутреннее"], parentId: "t-10" },
  { id: "t-13", code: "LH-2497", title: "Инструкция для поддержки по возвратам", status: "В работе", priority: "Обычный", assignee: "Нина Кац", author: "Марина Панова", due: "18 июн", estimateMin: 120, spentMin: 40, comments: 1, checklistDone: 1, checklistTotal: 4, tags: ["Внутреннее"] },
  { id: "t-14", code: "LH-2498", title: "Тексты ошибок оплаты", status: "На приёмке", priority: "Обычный", assignee: "Нина Кац", author: "Ирина Ковалёва", due: "12 июн", estimateMin: 90, spentMin: 95, comments: 3, checklistDone: 2, checklistTotal: 2, tags: ["Клиенты"] },
  { id: "t-15", code: "LH-2499", title: "Сверка тестовых транзакций за май", status: "Готово", priority: "Обычный", assignee: "Олег Гринь", author: "Ирина Ковалёва", due: "07 июн", estimateMin: 180, spentMin: 170, comments: 2, checklistDone: 3, checklistTotal: 3, tags: ["Платежи"] },
  { id: "t-16", code: "LH-2500", title: "Хранение ключей в защищённом контуре", status: "Готово", priority: "Высокий", assignee: "Дмитрий Соловьёв", author: "Ирина Ковалёва", due: "06 июн", estimateMin: 240, spentMin: 300, comments: 7, checklistDone: 5, checklistTotal: 5, tags: ["Интеграции"] },
  { id: "t-17", code: "LH-2501", title: "Ротация ключей раз в квартал", status: "Новая", priority: "Низкий", assignee: "Дмитрий Соловьёв", author: "Дмитрий Соловьёв", due: "30 июн", estimateMin: 60, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 2, tags: ["Внутреннее"], parentId: "t-16" },
  { id: "t-18", code: "LH-2502", title: "Регламент инцидентов по платежам", status: "В работе", priority: "Обычный", assignee: "Марина Панова", author: "Ирина Ковалёва", due: "20 июн", estimateMin: 150, spentMin: 55, comments: 2, checklistDone: 1, checklistTotal: 3, tags: ["Внутреннее"] },
  { id: "t-19", code: "LH-2503", title: "Дежурство на релизе 14 июня", status: "Новая", priority: "Высокий", assignee: "Анна Верёвкина", author: "Ирина Ковалёва", due: "14 июн", estimateMin: 240, spentMin: 0, comments: 1, checklistDone: 0, checklistTotal: 3, tags: ["Q3"] },
  { id: "t-20", code: "LH-2504", title: "Проверить откат релиза", status: "Новая", priority: "Обычный", assignee: "Дмитрий Соловьёв", author: "Анна Верёвкина", due: "14 июн", estimateMin: 90, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 2, tags: ["Q3"], parentId: "t-19" },
  { id: "t-21", code: "LH-2505", title: "Письмо клиентам о новом способе оплаты", status: "Новая", priority: "Низкий", assignee: "Нина Кац", author: "Марина Панова", due: "22 июн", estimateMin: 60, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 2, tags: ["Клиенты"] },
  { id: "t-22", code: "LH-2506", title: "Обновить схему данных для отчётов", status: "Готово", priority: "Обычный", assignee: "Марина Панова", author: "Олег Гринь", due: "05 июн", estimateMin: 120, spentMin: 110, comments: 1, checklistDone: 2, checklistTotal: 2, tags: ["Интеграции"] },
  { id: "t-23", code: "LH-2507", title: "Отменить старый способ сверки", status: "Отменена", priority: "Низкий", assignee: "Олег Гринь", author: "Ирина Ковалёва", due: "09 июн", estimateMin: 30, spentMin: 10, comments: 1, checklistDone: 0, checklistTotal: 1, tags: ["Платежи"] },
  { id: "t-24", code: "LH-2508", title: "Согласовать формат журнала операций", status: "Готово", priority: "Обычный", assignee: "Олег Гринь", author: "Ирина Ковалёва", due: "04 июн", estimateMin: 90, spentMin: 85, comments: 2, checklistDone: 2, checklistTotal: 2, tags: ["Платежи"] },
  { id: "t-25", code: "LH-2509", title: "Чек-лист приёмки для ЦБ", status: "В работе", priority: "Высокий", assignee: "Ирина Ковалёва", author: "Ирина Ковалёва", due: "13 июн", estimateMin: 120, spentMin: 60, comments: 3, checklistDone: 2, checklistTotal: 6, tags: ["Платежи", "Q3"] },
  { id: "t-26", code: "LH-2510", title: "Демонстрация шлюза для руководства", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", author: "Ирина Ковалёва", due: "24 июн", estimateMin: 90, spentMin: 0, comments: 0, checklistDone: 0, checklistTotal: 3, tags: ["Внутреннее"] },
];

/* --- Файлы ------------------------------------------------------ */

export type ProjectFile = {
  id: string;
  name: string;
  kind: string;
  sizeKb: number;
  uploader: string;
  date: string;
  task?: string;
  extraction: "В очереди" | "Обработан" | "Ошибка";
};

export const projectFiles: ProjectFile[] = [
  { id: "f-1", name: "gateway-timeout.log", kind: "Журнал", sizeKb: 842, uploader: "Дмитрий Соловьёв", date: "12 июн", task: "LH-2490", extraction: "Обработан" },
  { id: "f-2", name: "Спецификация шлюза v2.pdf", kind: "PDF", sizeKb: 3120, uploader: "Ирина Ковалёва", date: "11 июн", task: "LH-2481", extraction: "Обработан" },
  { id: "f-3", name: "Сверка май.xlsx", kind: "Таблица", sizeKb: 517, uploader: "Олег Гринь", date: "10 июн", task: "LH-2499", extraction: "Обработан" },
  { id: "f-4", name: "Лист согласования ЦБ.docx", kind: "Документ", sizeKb: 96, uploader: "Ирина Ковалёва", date: "10 июн", task: "LH-2486", extraction: "В очереди" },
  { id: "f-5", name: "Схема вебхуков.png", kind: "Изображение", sizeKb: 1440, uploader: "Марина Панова", date: "09 июн", task: "LH-2490", extraction: "Ошибка" },
  { id: "f-6", name: "Нагрузочный сценарий.json", kind: "Данные", sizeKb: 34, uploader: "Дмитрий Соловьёв", date: "09 июн", task: "LH-2494", extraction: "Обработан" },
  { id: "f-7", name: "Тарифы банка-партнёра.pdf", kind: "PDF", sizeKb: 780, uploader: "Сергей Штейн", date: "08 июн", extraction: "Ошибка" },
  { id: "f-8", name: "Протокол встречи 06.06.md", kind: "Текст", sizeKb: 12, uploader: "Марина Панова", date: "06 июн", extraction: "Обработан" },
  { id: "f-9", name: "Ключи стенда (зашифровано).zip", kind: "Архив", sizeKb: 24, uploader: "Дмитрий Соловьёв", date: "05 июн", task: "LH-2500", extraction: "В очереди" },
  { id: "f-10", name: "Журнал операций пример.csv", kind: "Данные", sizeKb: 210, uploader: "Олег Гринь", date: "04 июн", task: "LH-2508", extraction: "Обработан" },
];

/* --- Заметки ---------------------------------------------------- */

export type ProjectNote = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  task?: string;
  attachments: number;
};

export const projectNotes: ProjectNote[] = [
  { id: "n-1", title: "Схема вебхуков v2", excerpt: "Подпись HMAC SHA-256, версия payload v2, повтор с задержкой 2 секунды на 504.", author: "Марина Панова", date: "10 июн", tags: ["Интеграции"], task: "LH-2490", attachments: 1 },
  { id: "n-2", title: "Итоги встречи с ЦБ", excerpt: "Лист согласования подписывают до 14 июня, отчёт присылаем в формате CSV с разделителем «;».", author: "Ирина Ковалёва", date: "09 июн", tags: ["Платежи"], task: "LH-2486", attachments: 2 },
  { id: "n-3", title: "Что проверять на нагрузке", excerpt: "Батчи 500 / 2000 / 5000, таймауты, повторные отправки, поведение очереди при отказе шлюза.", author: "Дмитрий Соловьёв", date: "08 июн", tags: ["Q3"], task: "LH-2494", attachments: 0 },
  { id: "n-4", title: "Тексты ошибок оплаты", excerpt: "Пользователь должен видеть причину и следующее действие: повторить, сменить карту, обратиться в банк.", author: "Нина Кац", date: "07 июн", tags: ["Клиенты"], attachments: 0 },
  { id: "n-5", title: "Лимиты платёжной группы", excerpt: "Дневной лимит 12 млн, разовый 700 тыс. Пересмотр раз в квартал, инициатор — Ирина.", author: "Ирина Ковалёва", date: "06 июн", tags: ["Платежи"], attachments: 1 },
  { id: "n-6", title: "Регламент инцидента", excerpt: "Дежурный фиксирует в задаче, поднимает канал, через 30 минут эскалация владельцу проекта.", author: "Марина Панова", date: "05 июн", tags: ["Внутреннее"], attachments: 0 },
];

/* --- Учёт времени ---------------------------------------------- */

export type TimeEntry = {
  id: string;
  task: string;
  taskCode: string;
  person: string;
  date: string;
  start: string;
  end: string;
  minutes: number;
  billable: boolean;
  comment: string;
};

export const timeEntries: TimeEntry[] = [
  { id: "te-1", taskCode: "LH-2481", task: "Интеграция с платёжным шлюзом ЦБ", person: "Анна Верёвкина", date: "12 июн", start: "09:30", end: "12:10", minutes: 160, billable: true, comment: "Сверка на стенде" },
  { id: "te-2", taskCode: "LH-2490", task: "Проверить обработку вебхуков", person: "Дмитрий Соловьёв", date: "12 июн", start: "10:05", end: "13:35", minutes: 210, billable: true, comment: "Разбор таймаутов" },
  { id: "te-3", taskCode: "LH-2486", task: "Отчёт по сверке для ЦБ", person: "Олег Гринь", date: "11 июн", start: "14:00", end: "16:20", minutes: 140, billable: true, comment: "Формат выгрузки" },
  { id: "te-4", taskCode: "LH-2492", task: "Согласовать лимиты", person: "Ирина Ковалёва", date: "11 июн", start: "12:00", end: "12:45", minutes: 45, billable: false, comment: "Звонок с платёжной группой" },
  { id: "te-5", taskCode: "LH-2484", task: "Модуль возврата средств", person: "Анна Верёвкина", date: "11 июн", start: "09:15", end: "12:15", minutes: 180, billable: true, comment: "Частичные возвраты" },
  { id: "te-6", taskCode: "LH-2500", task: "Хранение ключей", person: "Дмитрий Соловьёв", date: "10 июн", start: "10:00", end: "15:00", minutes: 300, billable: true, comment: "Защищённый контур" },
  { id: "te-7", taskCode: "LH-2497", task: "Инструкция по возвратам", person: "Нина Кац", date: "10 июн", start: "13:00", end: "13:40", minutes: 40, billable: false, comment: "Первый черновик" },
  { id: "te-8", taskCode: "LH-2506", task: "Схема данных для отчётов", person: "Марина Панова", date: "09 июн", start: "11:00", end: "12:50", minutes: 110, billable: true, comment: "Поля журнала" },
  { id: "te-9", taskCode: "LH-2499", task: "Сверка транзакций за май", person: "Олег Гринь", date: "09 июн", start: "09:00", end: "11:50", minutes: 170, billable: true, comment: "Ручная проверка" },
  { id: "te-10", taskCode: "LH-2509", task: "Чек-лист приёмки для ЦБ", person: "Ирина Ковалёва", date: "08 июн", start: "16:00", end: "17:00", minutes: 60, billable: false, comment: "Структура чек-листа" },
];

export const timeByPerson = [
  { person: "Дмитрий Соловьёв", minutes: 2130, billable: 1890 },
  { person: "Анна Верёвкина", minutes: 1840, billable: 1620 },
  { person: "Олег Гринь", minutes: 1210, billable: 1010 },
  { person: "Марина Панова", minutes: 890, billable: 460 },
  { person: "Ирина Ковалёва", minutes: 650, billable: 0 },
];

export const timeByTask = [
  { code: "LH-2481", title: "Интеграция с платёжным шлюзом ЦБ", minutes: 1520, billable: 1360 },
  { code: "LH-2490", title: "Проверить обработку вебхуков", minutes: 1240, billable: 1180 },
  { code: "LH-2500", title: "Хранение ключей в защищённом контуре", minutes: 980, billable: 980 },
  { code: "LH-2484", title: "Модуль возврата средств", minutes: 860, billable: 760 },
  { code: "LH-2486", title: "Отчёт по сверке для ЦБ", minutes: 620, billable: 500 },
  { code: "LH-2509", title: "Чек-лист приёмки для ЦБ", minutes: 340, billable: 0 },
];

export function hoursMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}
