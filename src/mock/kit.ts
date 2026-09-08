export type TaskStatus = "Новая" | "В работе" | "Пауза" | "На приёмке" | "Готово" | "Отменена";
export type TaskPriority = "Критический" | "Высокий" | "Обычный" | "Низкий";

export type KitTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  deadline: string;
  spent: string;
};

export const kitTasks: KitTask[] = [
  { id: "t-1", title: "Согласовать смету по кухне", status: "На приёмке", priority: "Высокий", assignee: "Аня Дорош", deadline: "08.09.2026", spent: "2:40" },
  { id: "t-2", title: "Замерить нишу под холодильник", status: "Готово", priority: "Обычный", assignee: "Роман Ким", deadline: "05.09.2026", spent: "0:35" },
  { id: "t-3", title: "Собрать документы для налоговой", status: "В работе", priority: "Критический", assignee: "Роман Ким", deadline: "10.09.2026", spent: "4:05" },
  { id: "t-4", title: "Перенести заметки из блокнота", status: "Новая", priority: "Низкий", assignee: "Не назначен", deadline: "17.09.2026", spent: "0:00" },
  { id: "t-5", title: "Обновить прайс для клиента", status: "Пауза", priority: "Обычный", assignee: "Павел Смирнов", deadline: "12.09.2026", spent: "1:20" },
  { id: "t-6", title: "Отказаться от старой подписки", status: "Отменена", priority: "Низкий", assignee: "Роман Ким", deadline: "03.09.2026", spent: "0:10" },
];

export type KitTimeEntry = {
  id: string;
  title: string;
  from: string;
  to: string;
  duration: string;
  billable: boolean;
  /** позиция и ширина на полосе времени, % */
  start: number;
  width: number;
};

export const kitTimeline: KitTimeEntry[] = [
  { id: "e-1", title: "Смета по кухне", from: "09:20", to: "11:05", duration: "1:45", billable: true, start: 3, width: 14 },
  { id: "e-2", title: "Документы для налоговой", from: "11:30", to: "14:10", duration: "2:40", billable: false, start: 21, width: 22 },
  { id: "e-3", title: "Созвон с подрядчиком", from: "15:00", to: "15:50", duration: "0:50", billable: true, start: 50, width: 7 },
  { id: "e-4", title: "Прайс для клиента", from: "16:30", to: "18:15", duration: "1:45", billable: true, start: 62, width: 15 },
];
