import type { ProjectTask } from "@/mock/projects";

/* Данные экранов ежедневной работы: «Сегодня», «Входящие», «Мои задачи». */

export type DailyTask = ProjectTask & {
  /** Проект задачи. Отсутствует у входящих. */
  project?: string;
  projectId?: string;
  space: "Работа" | "Личное";
  /** Я наблюдатель, а не исполнитель. */
  watching?: boolean;
};

export type PlanItem = {
  id: string;
  action: string;
  reason: string;
  code: string;
  minutes: number;
};

/** План дня от ИИ: три-пять действий, у каждого причина и задача-источник. */
export const dayPlan: PlanItem[] = [
  {
    id: "pl-1",
    action: "Закрыть обработку вебхуков",
    reason: "Просрочена вторые сутки и держит приёмку шлюза 14 июня",
    code: "LH-2490",
    minutes: 90,
  },
  {
    id: "pl-2",
    action: "Принять отчёт по сверке для ЦБ",
    reason: "Олег ждёт приёмки со вчера, работа уже сделана",
    code: "LH-2486",
    minutes: 20,
  },
  {
    id: "pl-3",
    action: "Согласовать лимиты с платёжной группой",
    reason: "Без ответа встаёт модуль возврата средств",
    code: "LH-2492",
    minutes: 45,
  },
  {
    id: "pl-4",
    action: "Разобрать три входящие задачи по проектам",
    reason: "Копятся с понедельника, у них нет владельца",
    code: "LH-2530",
    minutes: 15,
  },
];

const base = {
  author: "Ирина Ковалёва",
  estimateMin: 60,
  spentMin: 0,
  comments: 0,
  checklistDone: 0,
  checklistTotal: 0,
  tags: [] as string[],
};

export const overdueTasks: DailyTask[] = [
  { ...base, id: "d-1", code: "LH-2490", title: "Проверить обработку вебхуков", status: "В работе", priority: "Критический", assignee: "Анна Верёвкина", due: "10 июн, 18:00", overdue: true, estimateMin: 180, spentMin: 210, comments: 8, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Интеграции"] },
  { ...base, id: "d-2", code: "LH-2492", title: "Согласовать лимиты с платёжной группой", status: "Пауза", priority: "Высокий", assignee: "Анна Верёвкина", due: "11 июн, 12:00", overdue: true, estimateMin: 60, spentMin: 45, comments: 4, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Платежи"] },
  { ...base, id: "d-3", code: "LH-2461", title: "Ответить на замечания по макетам кабинета", status: "На приёмке", priority: "Обычный", assignee: "Анна Верёвкина", due: "11 июн, 19:00", overdue: true, estimateMin: 90, spentMin: 70, comments: 3, project: "Редизайн личного кабинета", projectId: "p-3", space: "Работа", tags: ["Клиенты"] },
  { ...base, id: "d-4", code: "LH-2402", title: "Продлить страховку автомобиля", status: "Новая", priority: "Высокий", assignee: "Анна Верёвкина", due: "09 июн", overdue: true, estimateMin: 30, project: "Личные дела", projectId: "p-personal", space: "Личное" },
];

export const todayTasks: DailyTask[] = [
  { ...base, id: "d-5", code: "LH-2481", title: "Интеграция с платёжным шлюзом ЦБ", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", due: "сегодня, 18:00", estimateMin: 480, spentMin: 320, comments: 6, checklistDone: 2, checklistTotal: 5, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Интеграции"] },
  { ...base, id: "d-6", code: "LH-2486", title: "Отчёт по сверке для ЦБ", status: "На приёмке", priority: "Высокий", assignee: "Олег Гринь", due: "сегодня, 13:00", estimateMin: 120, spentMin: 140, comments: 5, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", watching: true, tags: ["Платежи"] },
  { ...base, id: "d-7", code: "LH-2509", title: "Чек-лист приёмки для ЦБ", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", due: "сегодня, 16:00", estimateMin: 120, spentMin: 60, comments: 3, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Q3"] },
  { ...base, id: "d-8", code: "LH-2503", title: "Дежурство на релизе 14 июня", status: "Новая", priority: "Высокий", assignee: "Анна Верёвкина", due: "сегодня, 20:00", estimateMin: 240, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Q3"] },
  { ...base, id: "d-9", code: "LH-2472", title: "Собрать отклики по онбордингу", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "сегодня", estimateMin: 45, project: "Онбординг новых клиентов", projectId: "p-5", space: "Работа", tags: ["Клиенты"] },
  { ...base, id: "d-10", code: "LH-2415", title: "Записать сына на секцию", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "сегодня, 19:00", estimateMin: 15, project: "Личные дела", projectId: "p-personal", space: "Личное" },
];

export const inboxTasks: DailyTask[] = [
  { ...base, id: "i-1", code: "LH-2530", title: "Уточнить формат акта у бухгалтерии", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "13 июн", space: "Работа" },
  { ...base, id: "i-2", code: "LH-2531", title: "Позвонить в банк по лимиту карты", status: "Новая", priority: "Высокий", assignee: "Анна Верёвкина", due: "12 июн, 15:00", space: "Личное", estimateMin: 15 },
  { ...base, id: "i-3", code: "LH-2532", title: "Разобрать заметки со встречи 06.06", status: "Новая", priority: "Низкий", assignee: "Анна Верёвкина", due: "—", space: "Работа", estimateMin: 30 },
  { ...base, id: "i-4", code: "LH-2533", title: "Купить кабель для стенда", status: "Новая", priority: "Низкий", assignee: "Анна Верёвкина", due: "—", space: "Работа", estimateMin: 20 },
  { ...base, id: "i-5", code: "LH-2534", title: "Проверить счёт от подрядчика", status: "Новая", priority: "Высокий", assignee: "Анна Верёвкина", due: "14 июн", space: "Работа", estimateMin: 25 },
  { ...base, id: "i-6", code: "LH-2535", title: "Записаться к стоматологу", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "—", space: "Личное", estimateMin: 10 },
  { ...base, id: "i-7", code: "LH-2536", title: "Собрать вопросы к ретро", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "16 июн", space: "Работа", estimateMin: 40 },
  { ...base, id: "i-8", code: "LH-2537", title: "Обновить резюме команды на сайте", status: "Новая", priority: "Низкий", assignee: "Анна Верёвкина", due: "—", space: "Работа", estimateMin: 60 },
  { ...base, id: "i-9", code: "LH-2538", title: "Отдать ноутбук в сервис", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "17 июн", space: "Личное", estimateMin: 30 },
  { ...base, id: "i-10", code: "LH-2539", title: "Сверить остатки по договору аренды", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "18 июн", space: "Работа", estimateMin: 45 },
  { ...base, id: "i-11", code: "LH-2540", title: "Подготовить список подрядчиков на Q3", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "20 июн", space: "Работа", estimateMin: 50 },
  { ...base, id: "i-12", code: "LH-2541", title: "Оплатить продление домена", status: "Новая", priority: "Высокий", assignee: "Анна Верёвкина", due: "12 июн", space: "Личное", estimateMin: 10 },
];

/** Сколько входящих на самом деле — список показывает первую страницу. */
export const inboxTotal = 137;

export const myTasks: DailyTask[] = [
  ...overdueTasks,
  ...todayTasks,
  { ...base, id: "m-1", code: "LH-2484", title: "Модуль возврата средств", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", due: "13 июн", estimateMin: 300, spentMin: 180, comments: 4, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Платежи"] },
  { ...base, id: "m-2", code: "LH-2510", title: "Демонстрация шлюза для руководства", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "24 июн", estimateMin: 90, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", tags: ["Внутреннее"] },
  { ...base, id: "m-3", code: "LH-2494", title: "Нагрузочное тестирование шлюза", status: "Новая", priority: "Критический", assignee: "Дмитрий Соловьёв", due: "16 июн", estimateMin: 300, comments: 2, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", watching: true, tags: ["Интеграции"] },
  { ...base, id: "m-4", code: "LH-2455", title: "Новая навигация кабинета", status: "В работе", priority: "Обычный", assignee: "Анна Верёвкина", due: "19 июн", estimateMin: 240, spentMin: 90, comments: 2, project: "Редизайн личного кабинета", projectId: "p-3", space: "Работа", tags: ["Клиенты"] },
  { ...base, id: "m-5", code: "LH-2456", title: "Тёмная тема кабинета", status: "Новая", priority: "Низкий", assignee: "Анна Верёвкина", due: "26 июн", estimateMin: 180, project: "Редизайн личного кабинета", projectId: "p-3", space: "Работа", tags: ["Клиенты"] },
  { ...base, id: "m-6", code: "LH-2473", title: "Письма поддержки первых семи дней", status: "На приёмке", priority: "Обычный", assignee: "Нина Кац", due: "15 июн", estimateMin: 120, spentMin: 110, comments: 3, project: "Онбординг новых клиентов", projectId: "p-5", space: "Работа", watching: true, tags: ["Клиенты"] },
  { ...base, id: "m-7", code: "LH-2474", title: "Сценарий первого входа", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", due: "17 июн", estimateMin: 150, spentMin: 45, comments: 1, project: "Онбординг новых клиентов", projectId: "p-5", space: "Работа", tags: ["Клиенты"] },
  { ...base, id: "m-8", code: "LH-2431", title: "Разобрать документы по квартире", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "21 июн", estimateMin: 60, project: "Личные дела", projectId: "p-personal", space: "Личное" },
  { ...base, id: "m-9", code: "LH-2432", title: "Спланировать отпуск на август", status: "Пауза", priority: "Низкий", assignee: "Анна Верёвкина", due: "30 июн", estimateMin: 90, project: "Личные дела", projectId: "p-personal", space: "Личное" },
  { ...base, id: "m-10", code: "LH-2444", title: "Согласовать смету на ремонт кухни", status: "В работе", priority: "Высокий", assignee: "Анна Верёвкина", due: "18 июн", estimateMin: 120, spentMin: 30, comments: 2, project: "Ремонт", projectId: "p-personal", space: "Личное" },
  { ...base, id: "m-11", code: "LH-2445", title: "Выбрать плитку", status: "Новая", priority: "Обычный", assignee: "Анна Верёвкина", due: "23 июн", estimateMin: 90, project: "Ремонт", projectId: "p-personal", space: "Личное" },
  { ...base, id: "m-12", code: "LH-2502", title: "Регламент инцидентов по платежам", status: "В работе", priority: "Обычный", assignee: "Марина Панова", due: "20 июн", estimateMin: 150, spentMin: 55, comments: 2, project: "Запуск платёжного шлюза", projectId: "p-1", space: "Работа", watching: true, tags: ["Внутреннее"] },
];

export const savedFilters = [
  { id: "sf-1", name: "Горит на этой неделе", note: "Критический и высокий, срок до 15 июня" },
  { id: "sf-2", name: "Жду приёмки", note: "Статус «На приёмке», я постановщик" },
  { id: "sf-3", name: "Личное пространство", note: "Только пространство «Личное»" },
];

export const inboxProjects = [
  "Запуск платёжного шлюза",
  "Редизайн личного кабинета",
  "Онбординг новых клиентов",
  "Договоры с подрядчиками",
  "Ремонт",
  "Личные дела",
];

/** Разбор фразы ИИ в черновик задачи. */
export type ParsedField = { label: string; value: string; recognized: boolean };

export const quickAddExample = "Позвонить в банк завтра в 15:00, высокий, проект Ремонт";

export const quickAddParsed: ParsedField[] = [
  { label: "Название", value: "Позвонить в банк", recognized: true },
  { label: "Срок", value: "12 июня, 15:00", recognized: true },
  { label: "Приоритет", value: "Высокий", recognized: true },
  { label: "Проект", value: "Ремонт", recognized: true },
  { label: "Исполнитель", value: "Анна Верёвкина", recognized: false },
  { label: "Оценка", value: "15 мин", recognized: false },
];
