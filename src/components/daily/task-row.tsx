import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, PriorityChip, StatusChip } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { TaskTitle, taskStatusTone } from "@/components/projects/shared";
import type { DailyTask } from "@/mock/daily";
import { cn } from "@/lib/utils";

/* Общая строка задачи для экранов дня: одинаковый порядок полей везде. */

export function minutes(min: number) {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? (m ? `${h} ч ${m} мин` : `${h} ч`) : `${m} мин`;
}

export function TaskRow({
  task,
  actions,
  menu,
  selectable,
  selected,
  onSelect,
  onPeek,
  compact,
}: {
  task: DailyTask;
  /** Действия строки: появляются при наведении и при фокусе с клавиатуры. */
  actions?: React.ReactNode;
  menu?: string[] | undefined;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (v: boolean) => void;
  /** Если задан — клик открывает панель «взглянуть», иначе ведёт на экран задачи. */
  onPeek?: (task: DailyTask) => void;
  compact?: boolean;
}) {
  return (
    <li
      className={cn(
        "group flex flex-col gap-sm transition-fast hover:bg-surface-pressed focus-within:bg-surface-pressed lg:flex-row lg:items-center lg:gap-md",
        compact ? "py-sm" : "py-md",
      )}
    >
      {selectable ? (
        <input
          type="checkbox"
          aria-label={`Выделить задачу ${task.code}`}
          checked={Boolean(selected)}
          onChange={(e) => onSelect?.(e.target.checked)}
          className="size-4 shrink-0 cursor-pointer appearance-none rounded-xs border border-border-strong bg-surface transition-fast checked:border-accent checked:bg-accent"
        />
      ) : null}

      <span className="w-24 shrink-0">
        <StatusChip tone={taskStatusTone[task.status]}>{task.status}</StatusChip>
      </span>

      <span className="flex min-w-0 flex-1 basis-64 flex-col gap-2xs">
        <span className="flex flex-wrap items-baseline gap-sm">
          {onPeek ? (
            <TaskTitle code={task.code} title={task.title} onOpen={() => onPeek(task)} />
          ) : (
            <TaskTitle code={task.code} title={task.title} />
          )}
          {task.watching ? (
            <span className="text-meta text-muted-foreground">я наблюдатель</span>
          ) : null}
        </span>
        <span className="flex flex-wrap items-center gap-md text-meta text-muted-foreground">
          {task.project ? (
            task.projectId && task.projectId !== "p-personal" ? (
              <Link
                to="/projects/$id"
                params={{ id: task.projectId }}
                className="transition-fast hover:text-accent"
              >
                {task.project}
              </Link>
            ) : (
              <span>{task.project}</span>
            )
          ) : (
            <span>Без проекта</span>
          )}
          <span>Пространство «{task.space}»</span>
        </span>
      </span>

      <span className="w-44 shrink-0 whitespace-nowrap lg:text-right">
        <span
          className={cn(
            "num text-meta",
            task.overdue ? "font-medium text-danger-foreground" : "text-foreground",
          )}
        >
          {task.overdue ? `Просрочено ${task.due}` : task.due}
        </span>
      </span>

      <span className="hidden w-32 shrink-0 2xl:block">
        <PriorityChip level={task.priority} />
      </span>

      <span className="flex w-32 shrink-0 items-center gap-sm text-meta text-muted-foreground">
        <Avatar name={task.assignee} size="sm" />
        <span className="truncate">{task.assignee}</span>
      </span>

      <span className="num hidden w-16 shrink-0 text-right text-meta text-muted-foreground 2xl:block">
        {minutes(task.estimateMin)}
      </span>

      <span className="flex shrink-0 items-center gap-xs opacity-100 transition-fast lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
        {actions}
        <KebabMenu
          items={(menu ?? ["Открыть задачу", "Изменить срок", "Сменить исполнителя", "Отложить на завтра"]).map(
            (label) => ({ label }),
          )}
          destructive={{ label: "Удалить задачу" }}
        />
      </span>
    </li>
  );
}

export function GroupHead({
  title,
  count,
  note,
  action,
}: {
  title: string;
  count: number;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-md border-b border-border pb-sm">
      <div className="flex items-baseline gap-sm">
        <h2 className="text-title font-semibold text-foreground">{title}</h2>
        <span className="num text-meta text-muted-foreground">{count}</span>
      </div>
      {note ? <span className="text-meta text-muted-foreground">{note}</span> : null}
      {action}
    </div>
  );
}
