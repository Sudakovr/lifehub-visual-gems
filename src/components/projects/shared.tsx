import * as React from "react";
import { Link } from "@tanstack/react-router";
import { StatusChip, Tag, type Tone } from "@/components/kit/primitives";
import type { ProjectStatus, RiskLevel } from "@/mock/projects";
import type { TaskStatus } from "@/mock/kit";
import { cn } from "@/lib/utils";

export const projectStatusTone: Record<ProjectStatus, Tone> = {
  Черновик: "neutral",
  Активен: "info",
  Пауза: "neutral",
  Завершён: "ok",
  Отменён: "danger",
  "В архиве": "neutral",
};

export const taskStatusTone: Record<TaskStatus, Tone> = {
  Новая: "neutral",
  "В работе": "info",
  Пауза: "neutral",
  "На приёмке": "warn",
  Готово: "ok",
  Отменена: "danger",
};

export const riskTone: Record<RiskLevel, Tone> = {
  Низкий: "neutral",
  Средний: "warn",
  Высокий: "danger",
};

export function ProjectStatusChip({ status }: { status: ProjectStatus }) {
  return <StatusChip tone={projectStatusTone[status]}>{status}</StatusChip>;
}

export function RiskChip({ level }: { level: RiskLevel }) {
  return <StatusChip tone={riskTone[level]}>Риск: {level}</StatusChip>;
}

export function TagDot({ name }: { name: string }) {
  const colors: Record<string, string> = {
    Интеграции: "var(--color-accent)",
    Платежи: "var(--color-ok)",
    Q3: "var(--color-warn)",
    Клиенты: "var(--color-danger)",
    Внутреннее: "var(--color-border-strong)",
  };
  return <Tag color={colors[name] ?? "var(--color-info)"}>{name}</Tag>;
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
    </div>
  );
}

export function DueText({
  due,
  overdue,
  note,
}: {
  due: string;
  overdue?: boolean | undefined;
  note?: string | undefined;
}) {
  return (
    <span className="flex flex-col">
      <span className={cn("num text-body", overdue ? "font-medium text-danger-foreground" : "text-foreground")}>
        {overdue ? `Просрочено ${due}` : due}
      </span>
      {note ? <span className="text-meta text-muted-foreground">{note}</span> : null}
    </span>
  );
}

export function SectionHead({
  title,
  note,
  action,
}: {
  title: string;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-md border-b border-border pb-sm">
      <div className="flex items-baseline gap-sm">
        <h2 className="text-body font-semibold text-foreground">{title}</h2>
        {note ? <span className="num text-meta text-muted-foreground">{note}</span> : null}
      </div>
      {action}
    </div>
  );
}

export function TaskLink({ code, title }: { code: string; title?: string }) {
  return (
    <Link
      to="/tasks/$id"
      params={{ id: "2481" }}
      className="text-foreground transition-fast hover:text-accent"
    >
      {title ? (
        <>
          <span className="num text-muted-foreground">{code}</span> {title}
        </>
      ) : (
        <span className="num">{code}</span>
      )}
    </Link>
  );
}

export function TaskTitle({
  code,
  title,
  onOpen,
}: {
  code: string;
  title: string;
  onOpen?: () => void;
}) {
  const content = (
    <>
      <span className="num shrink-0 text-meta text-muted-foreground">{code}</span>
      <span className="min-w-0 text-body font-medium text-foreground transition-fast group-hover/task-title:text-accent">
        {title}
      </span>
    </>
  );

  return onOpen ? (
    <button type="button" onClick={onOpen} className="group/task-title flex min-w-0 items-baseline gap-sm text-left">
      {content}
    </button>
  ) : (
    <Link
      to="/tasks/$id"
      params={{ id: "2481" }}
      className="group/task-title flex min-w-0 items-baseline gap-sm"
    >
      {content}
    </Link>
  );
}
