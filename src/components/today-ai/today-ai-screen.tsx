import * as React from "react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Select, StatusChip } from "@/components/kit/primitives";
import { TaskLink } from "@/components/projects/shared";
import { GroupHead, TaskRow, minutes } from "@/components/daily/task-row";
import { AiStart } from "@/components/today-ai/ai-start";
import { dayPlan, overdueTasks, todayTasks, type DailyTask } from "@/mock/daily";
import { aiStates, type AiState, type Composition, type ParsedDraft, type Visit } from "@/mock/today-ai";
import { cn } from "@/lib/utils";

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-xs">
      <legend className="text-meta text-muted-foreground">{label}</legend>
      <div className="flex rounded-md border border-border bg-surface-sunken p-xs">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
            className={cn("h-8 rounded-sm px-md text-meta transition-fast focus-visible:outline-2 focus-visible:outline-accent", value === o.id ? "bg-surface font-medium text-foreground shadow-e1" : "text-muted-foreground hover:text-foreground")}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function DayContent({ composition, visit, state }: { composition: Composition; visit: Visit; state: AiState }) {
  const [planReady, setPlanReady] = React.useState(visit === "repeat");
  const [created, setCreated] = React.useState<DailyTask[]>([]);
  React.useEffect(() => setPlanReady(visit === "repeat"), [visit]);
  const noTasks = state === "no-tasks";
  const today = noTasks ? created : [...created, ...todayTasks.slice(0, 4)];
  const overdue = noTasks ? [] : overdueTasks.slice(0, 3);

  function create(d: ParsedDraft) {
    setCreated((c) => [{ ...todayTasks[0]!, id: `new-${c.length}`, code: `LH-${2600 + c.length}`, title: d.title, due: d.due, priority: d.priority, status: "Новая", overdue: false, comments: 0, spentMin: 0 }, ...c]);
  }

  const plan = (
    <section aria-label="План дня" className="flex flex-col gap-sm">
      <GroupHead title="План дня" count={planReady && !noTasks ? dayPlan.length : 0} note={planReady ? "Рекомендация ИИ — сроки и статусы не меняются" : "План ещё не составлен"} />
      {noTasks ? (
        <p className="py-md text-body text-muted-foreground">Плану пока не из чего складываться. Запишите первое дело фразой выше — и план появится.</p>
      ) : planReady ? (
        <ol className="divide-y divide-border border-b border-border">
          {dayPlan.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-baseline gap-md py-sm">
              <span className="num w-4 text-meta text-muted-foreground">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="text-body font-medium text-foreground">{p.action}</span>
                <span className="block text-meta text-muted-foreground">{p.reason}</span>
              </span>
              {state === "low-confidence" && i === 2 ? <StatusChip tone="warn">Мало данных</StatusChip> : null}
              <span className="num text-meta text-muted-foreground">{minutes(p.minutes)}</span>
              <TaskLink code={p.code} />
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-md text-body text-muted-foreground">Нажмите «Составить план» — ИИ предложит порядок из ваших задач.</p>
      )}
      {state === "stale" && planReady ? <p className="text-meta text-warn-foreground">Устарело: после плана изменились две задачи. Нажмите «Обновить».</p> : null}
    </section>
  );

  return (
    <div className="flex flex-col gap-xl">
      <PageHeading title="Сегодня, 12 июня" note="Просроченное, сегодняшнее и то, что ещё не разложено по проектам." />
      <AiStart composition={composition} visit={visit} state={state} planReady={planReady} onMakePlan={() => setPlanReady(true)} onCreate={create} />
      {plan}
      {overdue.length ? <TaskGroup title="Просрочено" note="Сроки уже прошли — перенесите или закройте" tasks={overdue} /> : null}
      <TaskGroup title="Сегодня" note="Срок наступает сегодня" tasks={today} />
    </div>
  );
}

function TaskGroup({ title, note, tasks }: { title: string; note: string; tasks: DailyTask[] }) {
  return (
    <section className="flex flex-col gap-md">
      <GroupHead title={title} count={tasks.length} note={note} />
      {tasks.length ? <ul className="divide-y divide-border border-b border-border">{tasks.map((t) => <TaskRow key={t.id} task={t} />)}</ul> : <p className="text-body text-muted-foreground">Задач на сегодня нет.</p>}
    </section>
  );
}

export function TodayAiScreen() {
  const [composition, setComposition] = React.useState<Composition>("expressive");
  const [visit, setVisit] = React.useState<Visit>("first");
  const [state, setState] = React.useState<AiState>("ready");
  const [device, setDevice] = React.useState<"desktop" | "phone">("desktop");
  const key = `${composition}-${visit}-${state}-${device}`;

  return (
    <AppShell>
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-sm">
          <h1 className="text-title font-semibold text-foreground">«Сегодня» с ИИ — две композиции</h1>
          <p className="max-w-prose text-body text-muted-foreground">Прототип: переключайте композицию, визит, состояние и ширину. Все примеры в блоке помечены «Пример» и не выдаются за ваши данные.</p>
        </div>
        <div className="flex flex-wrap items-end gap-lg border-b border-border pb-lg">
          <Segmented label="Композиция" value={composition} onChange={setComposition} options={[{ id: "expressive", label: "1. Выразительная" }, { id: "compact", label: "2. Компактная" }]} />
          <Segmented label="Визит" value={visit} onChange={setVisit} options={[{ id: "first", label: "Первый" }, { id: "repeat", label: "Повторный" }]} />
          <Segmented label="Ширина" value={device} onChange={setDevice} options={[{ id: "desktop", label: "Desktop" }, { id: "phone", label: "Телефон 390" }]} />
          <label className="flex flex-col gap-xs">
            <span className="text-meta text-muted-foreground">Состояние</span>
            <Select value={state} onChange={(e) => setState(e.target.value as AiState)}>
              {aiStates.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </label>
        </div>

        <div className={cn(device === "phone" && "mx-auto w-phone max-w-full rounded-lg border border-border bg-background p-md")}>
          <DayContent key={key} composition={composition} visit={visit} state={state} />
        </div>

        <section aria-labelledby="rec" className="flex max-w-page flex-col gap-sm border-t border-border pt-lg">
          <h2 id="rec" className="text-body font-semibold text-foreground">Рекомендация: компактная композиция</h2>
          <p className="text-body text-muted-foreground">Выразительная лучше объясняет первый визит: живой пример разбора фразы сразу показывает пользу. Но «Сегодня» — ежедневный экран, и уже со второго дня крупный блок отодвигает задачи. Компактная держит поле фразы первым действием, план и итог — одной строкой кнопок, а примеры раскрываются по запросу; на 390 px видны и вход в ИИ, и начало плана дня. Для первого визита в ней достаточно раскрытого состояния.</p>
        </section>
      </div>
    </AppShell>
  );
}
