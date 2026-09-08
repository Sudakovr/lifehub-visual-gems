import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Avatar, Button, PriorityChip, StatusChip } from "@/components/kit/primitives";
import { taskStatusTone } from "@/components/projects/shared";
import { taskDescription, type ProjectTask } from "@/mock/projects";
import { cn } from "@/lib/utils";

/*
  Панель «взглянуть»: выезжает справа поверх интерфейса.
  Ровно шесть полей и кнопка перехода. Ширина — 420 px, на телефоне во весь экран.
*/

export function TaskPeek({ task, onClose }: { task: ProjectTask; onClose: () => void }) {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div
        role="presentation"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/20 transition-opacity duration-base",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Быстрый просмотр задачи ${task.code}`}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-peek flex-col overflow-y-auto border-l border-border bg-surface shadow-e2 transition-transform duration-base",
          shown ? "translate-x-0" : "translate-x-full",
        )}
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
    </div>
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
