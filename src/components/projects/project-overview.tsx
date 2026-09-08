import * as React from "react";
import { Sparkles } from "lucide-react";
import { Avatar, Button } from "@/components/kit/primitives";
import { Metric } from "@/components/app/app-shell";
import { ProjectAiAnswer } from "@/components/projects/project-ai";
import { TaskDialog } from "@/components/task/task-dialogs";
import { DueText, ProgressBar, SectionHead, TaskLink, taskStatusTone } from "@/components/projects/shared";
import {
  getProject,
  hoursMinutes,
  projectEvents,
  projectMembers,
  projectSummary,
  projectTime,
  riskReasons,
  statusBreakdown,
  upcoming,
} from "@/mock/projects";
import { cn } from "@/lib/utils";

const dotByTone: Record<string, string> = {
  neutral: "bg-border-strong",
  info: "bg-info",
  ok: "bg-ok",
  warn: "bg-warn",
  danger: "bg-danger",
  accent: "bg-accent",
};

export function ProjectOverview({ id }: { id: string }) {
  const project = getProject(id);
  const totalTasks = statusBreakdown.reduce((s, i) => s + i.count, 0);
  const [dialog, setDialog] = React.useState<"decompose" | null>(null);

  return (
    <div className="flex flex-col gap-2xl">
      {/* Сводка ИИ — единственный акцентный блок экрана */}
      <section className="rounded-lg border border-accent/25 bg-accent-soft px-xl py-lg">
        <div className="flex flex-wrap items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <Sparkles className="size-4 text-accent" strokeWidth={1.75} />
            <h2 className="text-body font-semibold text-foreground">Сводка проекта от ИИ</h2>
            <span className="text-meta text-muted-foreground">обновлена 12 июня, 09:20</span>
          </div>
          <div className="flex items-center gap-sm">
            <Button variant="ghost" size="sm">
              Обновить сводку
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setDialog("decompose")}>
              Разобрать на подзадачи
            </Button>
          </div>
        </div>
        <ol className="mt-md flex flex-col gap-sm">
          {projectSummary.map((s, i) => (
            <li key={s.text} className="flex gap-md text-body-lg text-foreground">
              <span className="num pt-0.5 text-meta text-muted-foreground">{i + 1}</span>
              <p>
                {s.text}{" "}
                {s.sources.map((src) => (
                  <button
                    key={src.label}
                    title={src.hint}
                    className="mr-xs inline-flex items-center rounded-xs border border-accent/30 bg-surface px-xs text-meta text-accent transition-fast hover:bg-surface-pressed"
                  >
                    {src.label}
                  </button>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-2xl lg:grid-cols-3">
        <div className="flex flex-col gap-lg lg:col-span-2">
          <SectionHead title="Ход по статусам" note={`${totalTasks} задач`} />
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-md">
              <ProgressBar value={project.progress} />
              <span className="num text-body font-medium text-foreground">{project.progress}%</span>
            </div>
            <div className="grid grid-cols-2 gap-lg sm:grid-cols-3 xl:grid-cols-6">
              {statusBreakdown.map((s) => (
                <div key={s.status} className="flex flex-col gap-2xs">
                  <span className="flex items-center gap-xs text-meta text-muted-foreground">
                    <span className={cn("size-2 rounded-full", dotByTone[taskStatusTone[s.status]])} aria-hidden />
                    {s.status}
                  </span>
                  <span className="num text-heading font-semibold text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          <SectionHead title="Время" note={`план ${hoursMinutes(projectTime.planMin)}`} />
          <div className="grid grid-cols-2 gap-lg">
            <Metric label="Потрачено" value={hoursMinutes(projectTime.totalMin)} note="76 % от плана" />
            <Metric label="Оплачиваемое" value={hoursMinutes(projectTime.billableMin)} note="74 % от потраченного" />
            <Metric label="За неделю" value={hoursMinutes(projectTime.weekMin)} note="пять участников" />
            <Metric label="Запас" value={hoursMinutes(projectTime.planMin - projectTime.totalMin)} note="до планового объёма" />
          </div>
        </div>
      </section>

      <section className="grid gap-2xl lg:grid-cols-3">
        <div className="flex flex-col gap-lg lg:col-span-2">
          <SectionHead title="Ближайшие сроки" note="5 задач" />
          <ul className="divide-y divide-border">
            {upcoming.map((u) => (
              <li key={u.code} className="flex flex-wrap items-center justify-between gap-md py-sm">
                <span className="min-w-0 text-body">
                  <TaskLink code={u.code} title={u.title} />
                </span>
                <span className="flex items-center gap-lg">
                  <span className="text-meta text-muted-foreground">{u.assignee}</span>
                  <DueText due={u.due} overdue={u.overdue} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-lg">
          <SectionHead title="Риск срыва" note={project.risk} />
          <p className="text-body text-foreground">{project.riskReason}.</p>
          <ul className="flex flex-col gap-sm">
            {riskReasons.map((r) => (
              <li key={r.text} className="flex gap-sm text-body text-foreground">
                <span
                  className={cn(
                    "mt-2 size-2 shrink-0 rounded-full",
                    r.tone === "danger" ? "bg-danger" : r.tone === "warn" ? "bg-warn" : "bg-border-strong",
                  )}
                  aria-hidden
                />
                <span>
                  {r.text}
                  <span className="sr-only">
                    {r.tone === "danger" ? " — критично" : r.tone === "warn" ? " — требует внимания" : " — в норме"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-2xl lg:grid-cols-3">
        <div className="flex flex-col gap-lg">
          <SectionHead title="Участники" note={`${projectMembers.length} человек`} />
          <ul className="divide-y divide-border">
            {projectMembers.map((m) => (
              <li key={m.id} className="flex items-center gap-md py-sm">
                <Avatar name={m.name} />
                <span className="flex min-w-0 flex-col">
                  <span className="text-body text-foreground">{m.name}</span>
                  <span className="text-meta text-muted-foreground">{m.title}</span>
                </span>
                <span className="ml-auto text-meta text-muted-foreground">
                  {m.role === "owner" ? "Владелец" : m.role === "member" ? "Участник" : "Только чтение"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-lg lg:col-span-2">
          <SectionHead title="Последние события" note="за три дня" />
          <ul className="divide-y divide-border">
            {projectEvents.map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline gap-sm py-sm text-body">
                <span className="font-medium text-foreground">{e.actor}</span>
                <span className="text-muted-foreground">{e.text}</span>
                <span className="num ml-auto text-meta text-muted-foreground">
                  {e.date}, {e.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProjectAiAnswer />

      {dialog ? <TaskDialog kind="decompose" onClose={() => setDialog(null)} /> : null}
    </div>
  );
}
