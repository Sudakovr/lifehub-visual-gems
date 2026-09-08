/* Данные оболочки: пространства, уведомления, активный таймер, командное меню. */

export type Space = {
  id: string;
  name: string;
  kind: "личное" | "рабочее";
  tone: "accent" | "ok" | "warn" | "info";
  role: "owner" | "member" | "viewer";
};

export const spaces: Space[] = [
  { id: "s-personal", name: "Личное", kind: "личное", tone: "ok", role: "owner" },
  { id: "s-work", name: "Работа", kind: "рабочее", tone: "accent", role: "owner" },
  { id: "s-studio", name: "Студия «Пирс»", kind: "рабочее", tone: "info", role: "member" },
];

export const roleLabel: Record<Space["role"], string> = {
  owner: "Владелец",
  member: "Участник",
  viewer: "Только чтение",
};

export const activeTimer = {
  taskCode: "LH-2481",
  taskTitle: "Свести отчёт по кварталу",
  started: "14:06",
  elapsed: "1:12:40",
};

export type Notification = {
  id: string;
  text: string;
  when: string;
  unread: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", text: "Пётр Соколов отправил LH-2481 на приёмку", when: "12 минут назад", unread: true },
  { id: "n2", text: "Мария Ким упомянула вас в задаче LH-2455", when: "час назад", unread: true },
  { id: "n3", text: "Файл «Смета_итог.xlsx» обработан", when: "сегодня, 09:40", unread: true },
  { id: "n4", text: "Проект «Переезд офиса» переведён в Паузу", when: "вчера", unread: false },
];

export const unreadCount = notifications.filter((n) => n.unread).length;

export type CommandItem = {
  id: string;
  group: "Задачи" | "Проекты" | "Заметки" | "Действия";
  title: string;
  note: string;
  to?: string;
  params?: Record<string, string>;
  shortcut?: string;
};

export const commandItems: CommandItem[] = [
  { id: "c1", group: "Задачи", title: "LH-2481 · Свести отчёт по кварталу", note: "На приёмке · Пётр Соколов", to: "/tasks/$id", params: { id: "2481" } },
  { id: "c2", group: "Задачи", title: "LH-2455 · Согласовать смету подрядчика", note: "В работе · срок сегодня", to: "/tasks/$id", params: { id: "2481" } },
  { id: "c3", group: "Задачи", title: "LH-2390 · Забрать ключи от помещения", note: "Просрочено на 2 дня", to: "/tasks/$id", params: { id: "2481" } },
  { id: "c4", group: "Проекты", title: "Переезд офиса", note: "Активен · 18 из 44 задач открыто", to: "/projects/$id", params: { id: "p-1" } },
  { id: "c5", group: "Проекты", title: "Все проекты пространства", note: "Список и архив", to: "/projects" },
  { id: "c6", group: "Заметки", title: "Договорённости по подрядчику", note: "Изменена вчера · тег «Смета»", to: "/notes" },
  { id: "c7", group: "Заметки", title: "Список вопросов к арендодателю", note: "Изменена 3 дня назад", to: "/notes" },
  { id: "c8", group: "Действия", title: "Создать задачу", note: "Быстрый ввод фразой", shortcut: "N" },
  { id: "c9", group: "Действия", title: "Остановить таймер", note: "LH-2481 · идёт 1:12:40" },
  { id: "c10", group: "Действия", title: "Открыть учёт времени", note: "Отчёт за период", to: "/time" },
  { id: "c11", group: "Действия", title: "Переключить тему", note: "Светлая и тёмная" },
];

export type SpaceNote = { id: string; title: string; excerpt: string; project: string; changed: string; tags: string[] };

export const spaceNotes: SpaceNote[] = [
  { id: "n-1", title: "Договорённости по подрядчику", excerpt: "Работы принимаем поэтапно, оплата после подписания акта каждого этапа.", project: "Переезд офиса", changed: "вчера, 18:20", tags: ["Смета"] },
  { id: "n-2", title: "Список вопросов к арендодателю", excerpt: "Парковка, доступ по выходным, кто платит за интернет-канал.", project: "Переезд офиса", changed: "3 дня назад", tags: ["Аренда"] },
  { id: "n-3", title: "Итоги встречи с командой", excerpt: "Переносим релиз на неделю, приёмку задач ведёт постановщик.", project: "Сайт компании", changed: "неделю назад", tags: ["Встречи"] },
];

export type SpaceFile = {
  id: string;
  name: string;
  size: string;
  project: string;
  task: string;
  author: string;
  state: "в очереди" | "обработан" | "ошибка";
};

export const spaceFiles: SpaceFile[] = [
  { id: "f-1", name: "Смета_итог.xlsx", size: "248 КБ", project: "Переезд офиса", task: "LH-2455", author: "Мария Ким", state: "обработан" },
  { id: "f-2", name: "Договор_аренды.pdf", size: "1,2 МБ", project: "Переезд офиса", task: "LH-2390", author: "Анна Верёвкина", state: "в очереди" },
  { id: "f-3", name: "План_этажа.png", size: "3,4 МБ", project: "Переезд офиса", task: "LH-2481", author: "Пётр Соколов", state: "ошибка" },
];
