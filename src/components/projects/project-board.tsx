import * as React from "react";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Avatar, Button, StatusChip } from "@/components/kit/primitives";
import { TaskPeek } from "@/components/projects/task-peek";
import { SectionHead, taskStatusTone } from "@/components/projects/shared";
import { projectTasks, type ProjectTask } from "@/mock/projects";
import type { TaskStatus } from "@/mock/kit";
import { cn } from "@/lib/utils";

const columnsOrder: TaskStatus[] = ["Новая", "В работе", "Пауза", "На приёмке", "Готово", "Отменена"];

export function ProjectBoard() {
  const [items, setItems] = React.useState(projectTasks);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [target, setTarget] = React.useState<TaskStatus | null>(null);
  const [collapsed, setCollapsed] = React.useState<TaskStatus[]>([]);
  const [peekId, setPeekId] = React.useState<string | null>(null);
  const moved = React.useRef(false);
  const start = React.useRef({ x: 0, y: 0 });

  const peek = items.find((t) => t.id === peekId) ?? null;

  function move(id: string, status: TaskStatus) {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function onPointerDown(e: React.PointerEvent, id: string) {
    if (e.button && e.button !== 0) return;
    moved.current = false;
    start.current = { x: e.clientX, y: e.clientY };
    setDragId(id);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragId) return;
    if (Math.abs(e.clientX - start.current.x) > 4 || Math.abs(e.clientY - start.current.y) > 4) {
      moved.current = true;
    }
    e.preventDefault();
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const col = el?.closest<HTMLElement>("[data-column]");
    setTarget((col?.dataset["column"] as TaskStatus) ?? null);
  }

  function onPointerUp() {
    if (dragId && moved.current && target) move(dragId, target);
    setDragId(null);
    setTarget(null);
  }

  return (
    <div className="flex flex-col gap-lg" onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <SectionHead
        title="Канбан проекта"
        note={`${items.length} задач`}
        action={
          <span className="text-meta text-muted-foreground">
            Карточку можно перетащить в другую колонку, клик открывает панель просмотра
          </span>
        }
      />

      <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 touch-pan-y gap-lg overflow-x-auto pb-lg">
        {columnsOrder.map((status) => {
          const cards = items.filter((t) => t.status === status);
          const isCollapsed = collapsed.includes(status);
          const isTarget = dragId !== null && target === status;

          if (isCollapsed) {
            return (
              <div
                key={status}
                data-column={status}
                className={cn(
                  "flex w-12 shrink-0 flex-col items-center gap-md rounded-md border border-border bg-surface-sunken py-md",
                  isTarget && "border-accent bg-accent-soft",
                )}
              >
                <button
                  aria-label={`Развернуть колонку «${status}»`}
                  title={`Развернуть колонку «${status}»`}
                  onClick={() => setCollapsed((c) => c.filter((s) => s !== status))}
                  className="text-muted-foreground transition-fast hover:text-foreground"
                >
                  <ChevronRight className="size-4" strokeWidth={1.75} />
                </button>
                <span className="num text-meta text-muted-foreground">{cards.length}</span>
                <span className="vertical-label whitespace-nowrap text-meta text-muted-foreground">
                  {status}
                </span>
              </div>
            );
          }

          return (
            <section
              key={status}
              data-column={status}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-md border border-border bg-surface-sunken",
                isTarget && "border-accent bg-accent-soft",
              )}
            >
              <header className="sticky top-14 z-10 flex items-center gap-sm rounded-t-md border-b border-border bg-surface-sunken px-md py-sm">
                <StatusChip tone={taskStatusTone[status]}>{status}</StatusChip>
                <span className="num text-meta text-muted-foreground">{cards.length}</span>
                <button
                  aria-label={`Свернуть колонку «${status}»`}
                  title={`Свернуть колонку «${status}»`}
                  onClick={() => setCollapsed((c) => [...c, status])}
                  className="ml-auto text-muted-foreground transition-fast hover:text-foreground"
                >
                  <ChevronLeft className="size-4" strokeWidth={1.75} />
                </button>
              </header>

              <div className="flex min-h-40 flex-col gap-sm p-md">
                {cards.map((task) => (
                  <BoardCard
                    key={task.id}
                    task={task}
                    dragging={dragId === task.id}
                    active={peekId === task.id}
                    onPointerDown={(e) => onPointerDown(e, task.id)}
                    onOpen={() => {
                      if (!moved.current) setPeekId(task.id);
                    }}
                  />
                ))}
                {isTarget ? (
                  <div className="rounded-md border border-dashed border-accent bg-surface px-md py-sm text-meta text-accent">
                    Перенести сюда
                  </div>
                ) : null}
                {cards.length === 0 && !isTarget ? (
                  <p className="px-xs py-md text-meta text-muted-foreground">Пока пусто. Перетащите сюда задачу.</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      {peek ? <TaskPeek task={peek} onClose={() => setPeekId(null)} /> : null}
      </div>
    </div>
  );
}

function BoardCard({
  task,
  dragging,
  active,
  onPointerDown,
  onOpen,
}: {
  task: ProjectTask;
  dragging: boolean;
  active: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onOpen: () => void;
}) {
  const subtasks = projectTasks.filter((t) => t.parentId === task.id).length;
  return (
    <article
      onPointerDown={onPointerDown}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Задача ${task.code}. Клик открывает панель просмотра, перетаскивание меняет статус`}
      className={cn(
        "cursor-grab touch-none rounded-md border border-border bg-surface px-md py-sm select-none",
        dragging ? "cursor-grabbing border-accent shadow-e3" : "shadow-e1",
        active ? "border-accent" : null,
      )}
    >
      <div className="flex items-start justify-between gap-sm">
        <span className="num text-meta text-muted-foreground">{task.code}</span>
        <span
          className={cn(
            "text-meta",
            task.priority === "Критический"
              ? "text-danger-foreground"
              : task.priority === "Высокий"
                ? "text-warn-foreground"
                : "text-muted-foreground",
          )}
        >
          {task.priority}
        </span>
      </div>
      <h3 className="mt-2xs text-body text-foreground">{task.title}</h3>
      <div className="mt-sm flex flex-wrap items-center gap-md text-meta text-muted-foreground">
        <span className="flex items-center gap-xs">
          <Avatar name={task.assignee} size="sm" />
          {task.assignee.split(" ")[0]}
        </span>
        <span className={cn("num", task.overdue && "font-medium text-danger-foreground")}>
          {task.overdue ? `Просрочено ${task.due}` : task.due}
        </span>
      </div>
      <div className="mt-xs flex flex-wrap items-center gap-md text-meta text-muted-foreground">
        <span className="num">
          Чек-лист {task.checklistDone}/{task.checklistTotal}
        </span>
        {subtasks ? <span className="num">Подзадач {subtasks}</span> : null}
        {task.comments ? (
          <span className="flex items-center gap-xs">
            <MessageSquare className="size-3" strokeWidth={1.75} />
            <span className="num">{task.comments}</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}
