/* Данные администрирования: настройки пространства, профиль, модули, уведомления. */

export type SpaceRole = "owner" | "member" | "viewer";

export type SpaceMember = {
  id: string;
  name: string;
  email: string;
  role: SpaceRole;
  joined: string;
  lastSeen: string;
  invitePending?: boolean;
};

export const spaceMembers: SpaceMember[] = [
  { id: "m1", name: "Роман Гладков", email: "roman@lifehub.ru", role: "owner", joined: "12.01.2026", lastSeen: "сейчас" },
  { id: "m2", name: "Мария Ким", email: "maria@lifehub.ru", role: "member", joined: "03.02.2026", lastSeen: "18 минут назад" },
  { id: "m3", name: "Пётр Соколов", email: "petr@lifehub.ru", role: "member", joined: "17.02.2026", lastSeen: "сегодня, 11:20" },
  { id: "m4", name: "Ирина Власова", email: "irina@lifehub.ru", role: "viewer", joined: "02.03.2026", lastSeen: "вчера" },
  { id: "m5", name: "Дмитрий Панов", email: "dmitry@partner.ru", role: "member", joined: "—", lastSeen: "—", invitePending: true },
];

export const roleTitle: Record<SpaceRole, string> = {
  owner: "Владелец",
  member: "Участник",
  viewer: "Только чтение",
};

export const roleNote: Record<SpaceRole, string> = {
  owner: "Меняет настройки, управляет участниками и удаляет объекты.",
  member: "Создаёт и меняет проекты, задачи, файлы и заметки.",
  viewer: "Читает данные пространства, ничего не меняет и не загружает.",
};

export type SpaceTag = { id: string; name: string; color: string; used: number };

export const adminTags: SpaceTag[] = [
  { id: "t1", name: "Платежи", color: "var(--color-accent)", used: 24 },
  { id: "t2", name: "Клиент", color: "var(--color-ok)", used: 18 },
  { id: "t3", name: "Срочно", color: "var(--color-danger)", used: 11 },
  { id: "t4", name: "Дизайн", color: "var(--color-info)", used: 9 },
  { id: "t5", name: "Документы", color: "var(--color-warn)", used: 7 },
  { id: "t6", name: "Доки", color: "var(--color-warn)", used: 2 },
];

export type ModuleItem = {
  id: string;
  name: string;
  note: string;
  enabled: boolean;
  locked?: boolean;
};

export const spaceModules: ModuleItem[] = [
  { id: "tasks", name: "Задачи", note: "Списки, канбан, подзадачи и приёмка работы.", enabled: true, locked: true },
  { id: "files", name: "Файлы", note: "Загружайте файлы к проектам и задачам, извлекайте текст.", enabled: true },
  { id: "notes", name: "Заметки", note: "Решения и договорённости со связями и вложениями.", enabled: true },
  { id: "time", name: "Учёт времени", note: "Таймер и ручные записи, отчёты по задачам и людям.", enabled: true },
  { id: "search", name: "Поиск по содержимому", note: "Поиск внутри задач, заметок и текста файлов.", enabled: true },
  { id: "ai", name: "AI-помощь", note: "Сводки проектов, план дня и разбор задач на подзадачи.", enabled: false },
];

export type SystemModule = ModuleItem & {
  version: string;
  spaces: number;
  state: "Работает" | "Ошибка" | "Выключен";
};

export const systemModules: SystemModule[] = [
  { id: "tasks", name: "Задачи", note: "Ядро продукта, отключить нельзя.", enabled: true, locked: true, version: "4.2.0", spaces: 12, state: "Работает" },
  { id: "files", name: "Файлы", note: "Хранилище и очередь извлечения текста.", enabled: true, version: "2.8.1", spaces: 12, state: "Работает" },
  { id: "notes", name: "Заметки", note: "Редактор заметок и связи.", enabled: true, version: "1.9.4", spaces: 11, state: "Работает" },
  { id: "time", name: "Учёт времени", note: "Таймер и отчёты.", enabled: true, version: "1.4.0", spaces: 9, state: "Работает" },
  { id: "search", name: "Поиск", note: "Индекс задач, заметок и файлов.", enabled: true, version: "3.1.2", spaces: 12, state: "Ошибка" },
  { id: "ai", name: "AI-помощь", note: "Сводки и разбор задач.", enabled: false, version: "0.9.7", spaces: 3, state: "Выключен" },
];

export type NotificationKind = "Упоминание" | "Назначение" | "Приёмка" | "Комментарий";

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  who: string;
  when: string;
  source: string;
  unread: boolean;
};

export const notificationFeed: NotificationItem[] = [
  {
    id: "nf1",
    kind: "Приёмка",
    title: "Пётр Соколов отправил задачу на приёмку",
    detail: "LH-2481 · Свести отчёт по кварталу",
    who: "Пётр Соколов",
    when: "12 минут назад",
    source: "Задача LH-2481",
    unread: true,
  },
  {
    id: "nf2",
    kind: "Упоминание",
    title: "Мария Ким упомянула вас в обсуждении",
    detail: "«@Роман смета сходится, остаётся согласовать сроки оплаты»",
    who: "Мария Ким",
    when: "час назад",
    source: "Задача LH-2455",
    unread: true,
  },
  {
    id: "nf3",
    kind: "Назначение",
    title: "Вас назначили исполнителем",
    detail: "LH-2502 · Подготовить регламент возвратов",
    who: "Ирина Власова",
    when: "сегодня, 10:15",
    source: "Задача LH-2502",
    unread: true,
  },
  {
    id: "nf4",
    kind: "Комментарий",
    title: "Новый комментарий в задаче",
    detail: "«Шлюз тестовый ответил ошибкой 402, повторю после обеда»",
    who: "Пётр Соколов",
    when: "вчера, 17:42",
    source: "Задача LH-2470",
    unread: false,
  },
  {
    id: "nf5",
    kind: "Приёмка",
    title: "Работа принята",
    detail: "LH-2436 · Обновить макеты корзины",
    who: "Роман Гладков",
    when: "вчера, 12:03",
    source: "Задача LH-2436",
    unread: false,
  },
  {
    id: "nf6",
    kind: "Упоминание",
    title: "Мария Ким упомянула вас в заметке",
    detail: "«Решение по срокам зафиксировали, @Роман подтверди»",
    who: "Мария Ким",
    when: "3 марта",
    source: "Заметка «Договорённости по шлюзу»",
    unread: false,
  },
];

export const notificationSettings: { id: string; name: string; note: string; email: boolean; push: boolean }[] = [
  { id: "s1", name: "Упоминания", note: "Когда вас упоминают через @ в комментарии или заметке.", email: true, push: true },
  { id: "s2", name: "Назначения", note: "Когда вас ставят исполнителем или наблюдателем.", email: true, push: true },
  { id: "s3", name: "Приёмка", note: "Отправка на приёмку, приём работы и возврат в работу.", email: true, push: false },
  { id: "s4", name: "Комментарии", note: "Новые комментарии в задачах, где вы участвуете.", email: false, push: true },
  { id: "s5", name: "Сроки", note: "Задача подходит к дедлайну или просрочена.", email: false, push: true },
];

export type EmptyState = {
  id: string;
  where: string;
  title: string;
  text: string;
  action: string;
};

export const emptyStates: EmptyState[] = [
  { id: "e1", where: "Проекты", title: "Проектов пока нет", text: "Проект собирает задачи, файлы и время в одном месте.", action: "Создать проект" },
  { id: "e2", where: "Задачи проекта", title: "В проекте нет задач", text: "Первая задача задаёт направление работы всей команде.", action: "Добавить задачу" },
  { id: "e3", where: "Колонка канбана", title: "В колонке «На приёмке» пусто", text: "Сюда попадают задачи, которые исполнитель отправил на проверку.", action: "Перетащить задачу" },
  { id: "e4", where: "Файлы", title: "Файлов нет", text: "Перетащите документы сюда — текст внутри станет доступен поиску.", action: "Загрузить файл" },
  { id: "e5", where: "Заметки", title: "Заметок нет", text: "Заметка хранит решение и договорённость рядом с задачами.", action: "Написать заметку" },
  { id: "e6", where: "Поиск", title: "Ничего не нашлось", text: "Проверьте написание или уберите фильтр по типу и пространству.", action: "Сбросить фильтры" },
  { id: "e7", where: "Уведомления", title: "Уведомлений нет", text: "Здесь появятся упоминания, назначения и приёмка работы.", action: "Настроить уведомления" },
  { id: "e8", where: "Время", title: "Записей времени нет", text: "Запустите таймер или добавьте запись вручную за прошедший день.", action: "Запустить таймер" },
  { id: "e9", where: "Нет доступа", title: "У вас нет доступа к этому проекту", text: "Доступ выдаёт владелец пространства «Работа».", action: "Запросить доступ" },
];

export type ErrorState = {
  code: string;
  title: string;
  text: string;
  action: string;
  secondary: string;
};

export const errorStates: ErrorState[] = [
  {
    code: "403",
    title: "Доступ закрыт",
    text: "Роль «Только чтение» не позволяет открыть настройки пространства.",
    action: "Вернуться к задачам",
    secondary: "Написать владельцу",
  },
  {
    code: "404",
    title: "Страница не найдена",
    text: "Объект удалён или ссылка ведёт в другое пространство.",
    action: "Открыть «Сегодня»",
    secondary: "Искать по названию",
  },
  {
    code: "500",
    title: "Сервер не ответил",
    text: "Сбой на нашей стороне. Мы уже знаем о нём, повторите попытку через минуту.",
    action: "Повторить",
    secondary: "Открыть «Сегодня»",
  },
  {
    code: "Сеть",
    title: "Связь пропала",
    text: "Изменения сохранены на устройстве и уйдут на сервер, когда сеть вернётся.",
    action: "Повторить сейчас",
    secondary: "Работать без сети",
  },
];

export const offlineQueue = [
  { id: "o1", what: "Комментарий в LH-2481", when: "14:22" },
  { id: "o2", what: "Статус LH-2455 → В работе", when: "14:19" },
  { id: "o3", what: "Запись времени 45 минут", when: "13:58" },
];
