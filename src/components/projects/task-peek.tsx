import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Avatar, Button, PriorityChip, StatusChip } from "@/components/kit/primitives";
import { taskStatusTone } from "@/components/projects/shared";
import { taskDescription, type ProjectTask } from "@/mock/projects";
import { cn } from "@/lib/utils";

/*
  Панель «взглянуть»: ровно шесть полей и кнопка перехода.
  Порядок полей повторяет экран задачи. Ширина фиксирована — 420 px.
*/

export function TaskPeek({ task, onClose }: { task: ProjectTask; onClose: () => void }) {
  return (
    <aside
      aria-label={`Быстрый просмотр задачи ${task.code}`}
      className="w-full shrink-0 self-start rounded-lg border border-border bg-surface lg:sticky lg:top-20 lg:w-peek"
    >
      <div className="flex items-start gap-md border-b border-border px-lg py-md">
        <div className="min-w-0 flex-1">
          <span className="num text-meta text-muted-foreground">{task.code}</span>
          <h2 className="text-title font-semibold text-foreground">{task.title}</h2>
        </div>
        <Button variant="ghost" size="icon" aria-label="Закрыть панель просмотра" onClick={onClose}>
          <X className="size-4" strokeWidth={1.75} />
        </Button>
      </div>

      <dl className="flex flex-col divide-y divide-border px-lg">
        <Row label="Статус">
          <StatusChip tone={taskStatusTone[task.status]}>{task.status}</StatusChip>
        </Row>
        <Row label="Приоритет">
          <PriorityChip level={task.priority} />
        </Row>
        <Row label="Срок">
          <span className={cn("num text-body", task.overdue ? "font-medium text-danger-foreground" : "text-foreground")}>
            {task.overdue ? `Просрочено ${task.due}` : task.due}
          </span>
        </Row>
        <Row label="Исполнитель">
          <span className="flex items-center gap-sm text-body text-foreground">
            <Avatar name={task.assignee} size="sm" />
            {task.assignee}
          </span>
        </Row>
      </dl>

      <div className="flex flex-col gap-sm border-t border-border px-lg py-md">
        <span className="text-meta text-muted-foreground">Описание</span>
        <p className="text-body text-foreground">{taskDescription(task)}</p>
      </div>

      <div className="border-t border-border px-lg py-md">
        <Link
          to="/tasks/$id"
          params={{ id: "2481" }}
          className="inline-flex h-9 items-center rounded-md bg-accent px-lg text-body font-medium text-accent-foreground transition-fast hover:bg-accent-hover"
        >
          Открыть задачу
        </Link>
      </div>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-md py-sm">
      <dt className="text-meta text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}
