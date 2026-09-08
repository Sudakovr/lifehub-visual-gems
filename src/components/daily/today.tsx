import * as React from "react";
import { Check, ChevronDown, Clock, Sparkles } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button } from "@/components/kit/primitives";
import { TaskLink } from "@/components/projects/shared";
import { GroupHead, TaskRow, minutes } from "@/components/daily/task-row";
import { dayPlan, inboxTasks, overdueTasks, todayTasks } from "@/mock/daily";
import { cn } from "@/lib/utils";

const PLAN_KEY = "lifehub.today.plan";

export function TodayScreen() {
  const [planOpen, setPlanOpen] = React.useState(true);
  const [done, setDone] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (window.localStorage.getItem(PLAN_KEY) === "closed") setPlanOpen(false);
  }, []);

  function togglePlan() {
    setPlanOpen((v) => {
      window.localStorage.setItem(PLAN_KEY, v ? "closed" : "open");
      return !v;
    });
  }

  const inbox = inboxTasks.slice(0, 4);
  const overdue = overdueTasks.filter((t) => !done.includes(t.id));
  const today = todayTasks.filter((t) => !done.includes(t.id));
  const empty = overdue.length + today.length + inbox.length === 0;

  function complete(id: string) {
    setDone((d) => [...d, id]);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-xl">
        <PageHeading
          title="Сегодня, 12 июня"
          note="Просроченное, сегодняшнее и то, что ещё не разложено по проектам."
          actions={
            <span className="flex items-center gap-sm text-meta text-muted-foreground">
              <Clock className="size-4" strokeWidth={1.75} />
              План на день: <span className="num text-foreground">{minutes(dayPlan.reduce((s, p) => s + p.minutes, 0))}</span>
            </span>
          }
        />

        <section
          aria-label="План дня от ИИ"
          className={cn("rounded-lg border border-accent/30 bg-accent-soft", planOpen ? "max-h-1/4-screen" : "")}
        >
          <div className="flex flex-wrap items-center gap-md px-lg py-md">
            <Sparkles className="size-4 text-accent" strokeWidth={1.75} />
            <h2 className="text-body font-semibold text-foreground">План дня от ИИ</h2>
            <span className="num text-meta text-muted-foreground">{dayPlan.length} действия</span>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={togglePlan} aria-expanded={planOpen}>
              <ChevronDown className={cn("size-4 transition-base", planOpen ? "" : "-rotate-90")} strokeWidth={1.75} />
              {planOpen ? "Свернуть план" : "Развернуть план"}
            </Button>
          </div>
          {planOpen ? (
            <ol className="flex flex-col divide-y divide-accent/20 border-t border-accent/20">
              {dayPlan.map((p, i) => (
                <li key={p.id} className="flex flex-wrap items-baseline gap-md px-lg py-sm">
                  <span className="num w-4 text-meta text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="text-body font-medium text-foreground">{p.action}</span>
                    <span className="block text-meta text-muted-foreground">{p.reason}</span>
                  </span>
                  <span className="num text-meta text-muted-foreground">{minutes(p.minutes)}</span>
                  <TaskLink code={p.code} />
                </li>
              ))}
            </ol>
          ) : null}
        </section>

        {empty ? (
          <div className="flex flex-col items-center gap-md rounded-lg border border-ok/30 bg-ok-soft py-4xl text-center">
            <Check className="size-6 text-ok-foreground" strokeWidth={1.75} />
            <h2 className="text-title font-semibold text-foreground">День разобран</h2>
            <p className="max-w-prose text-body text-muted-foreground">
              Просроченного нет, сегодняшнее закрыто, входящие разложены по проектам. Ближайший срок — 13 июня.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-xl">
            <Group
              title="Просрочено"
              note="Эти сроки уже прошли — перенесите или закройте"
              tasks={overdue}
              onComplete={complete}
            />
            <Group title="Сегодня" note="Срок наступает сегодня" tasks={today} onComplete={complete} />
            <Group
              title="Входящие"
              note="Задачи без проекта — им нужен проект"
              tasks={inbox}
              onComplete={complete}
              inbox
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Group({
  title,
  note,
  tasks,
  onComplete,
  inbox,
}: {
  title: string;
  note: string;
  tasks: import("@/mock/daily").DailyTask[];
  onComplete: (id: string) => void;
  inbox?: boolean;
}) {
  return (
    <section className="flex flex-col gap-md">
      <GroupHead title={title} count={tasks.length} note={note} />
      {tasks.length === 0 ? (
        <p className="py-lg text-body text-muted-foreground">Здесь пусто — и это хорошо.</p>
      ) : (
        <ul className="divide-y divide-border border-b border-border">
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              menu={inbox ? ["В проект…", "Изменить срок", "Сменить исполнителя"] : undefined}
              actions={
                <>
                  <Button variant="secondary" size="sm" onClick={() => onComplete(t.id)}>
                    Отметить готовой
                  </Button>
                  <Button variant="ghost" size="sm">
                    {inbox ? "В проект…" : "Отложить"}
                  </Button>
                </>
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}
