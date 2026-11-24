import * as React from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, ChevronDown, ListOrdered, Plus, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { Button, Field, Input, PriorityChip, Select, StatusChip } from "@/components/kit/primitives";
import { TaskLink } from "@/components/projects/shared";
import { cn } from "@/lib/utils";
import { parseExample, planExample, weekExample, type AiState, type Composition, type ParsedDraft, type Visit } from "@/mock/today-ai";

type Props = {
  composition: Composition;
  visit: Visit;
  state: AiState;
  planReady: boolean;
  onMakePlan: () => void;
  onCreate: (d: ParsedDraft) => void;
};

/** Плашка «Демонстрация» — примеры не выдаются за данные пользователя. */
function Demo() {
  return <span className="rounded-sm border border-border px-xs text-meta text-muted-foreground">Пример</span>;
}

function StateNote({ state, onRetry }: { state: AiState; onRetry: () => void }) {
  if (state === "error")
    return (
      <p role="alert" className="flex flex-wrap items-center gap-sm text-meta text-danger-foreground">
        <AlertTriangle className="size-4" strokeWidth={1.75} />
        Разбор не выполнен: сервис не ответил. Задачу можно создать вручную.
        <Button variant="secondary" size="sm" onClick={onRetry}>Повторить</Button>
      </p>
    );
  if (state === "limit")
    return (
      <p role="status" className="flex flex-wrap items-center gap-sm text-meta text-warn-foreground">
        <AlertTriangle className="size-4" strokeWidth={1.75} />
        Лимит запросов к ИИ на сегодня исчерпан. Он обновится в 00:00, а задачу можно создать вручную.
      </p>
    );
  return null;
}

/** Шаг А — разбор фразы: ввод → проверка полей → «Создать» или «Отмена». */
function ParseStep({ prominent, state, onCreate, showExample }: { prominent: boolean; state: AiState; onCreate: (d: ParsedDraft) => void; showExample: boolean }) {
  const [text, setText] = React.useState("");
  const [phase, setPhase] = React.useState<"idle" | "parsing" | "review">("idle");
  const [draft, setDraft] = React.useState<ParsedDraft>(parseExample.draft);
  const blocked = state === "error" || state === "limit";

  function parse() {
    setPhase("parsing");
    window.setTimeout(() => {
      setDraft({ ...parseExample.draft, title: text.trim() ? text.replace(/\s*завтра.*$/i, "").trim() || parseExample.draft.title : parseExample.draft.title });
      setPhase("review");
    }, 600);
  }
  function cancel() {
    setPhase("idle");
    setText("");
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-md", prominent && "rounded-lg border border-accent/30 bg-accent-soft p-lg")}>
      <div className="flex items-center gap-sm">
        <Wand2 className="size-4 text-accent" strokeWidth={1.75} />
        <h3 className="text-body font-semibold text-foreground">Запишите дело одной фразой</h3>
      </div>

      {phase !== "review" ? (
        <form
          className="flex flex-col gap-sm sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!blocked && state !== "loading") parse();
          }}
        >
          <label htmlFor="ai-phrase" className="sr-only">Фраза для разбора</label>
          <Input id="ai-phrase" className="h-11 sm:h-9" placeholder={parseExample.input} value={text} onChange={(e) => setText(e.target.value)} disabled={blocked} />
          <Button type="submit" className="h-11 shrink-0 sm:h-9" loading={phase === "parsing" || state === "loading"} disabled={blocked}>
            {phase === "parsing" || state === "loading" ? "Разбираю фразу" : "Разобрать фразу"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-md rounded-md border border-border bg-surface p-md" aria-label="Проверка черновика задачи">
          <p className="text-meta text-muted-foreground">{parseExample.caption}. Задача появится в списке только после «Создать».</p>
          <div className="grid gap-md sm:grid-cols-3">
            <Field id="d-title" label="Название">
              <Input id="d-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field id="d-due" label="Срок">
              <Input id="d-due" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} />
            </Field>
            <Field id="d-pri" label="Приоритет">
              <Select id="d-pri" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as ParsedDraft["priority"] })}>
                {(["Критический", "Высокий", "Обычный", "Низкий"] as const).map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-sm">
            <Button className="h-11 sm:h-9" onClick={() => { onCreate(draft); cancel(); }}>Создать</Button>
            <Button variant="ghost" className="h-11 sm:h-9" onClick={cancel}>Отмена</Button>
          </div>
        </div>
      )}

      <StateNote state={state} onRetry={() => undefined} />

      {showExample && phase === "idle" ? (
        <div className="flex min-w-0 flex-col gap-xs text-meta">
          <span className="flex items-center gap-sm text-muted-foreground"><Demo />«{parseExample.input}» превращается в:</span>
          <span className="flex flex-wrap items-center gap-sm text-foreground">
            <span className="font-medium">{parseExample.draft.title}</span>
            <span className="flex items-center gap-xs text-muted-foreground"><CalendarClock className="size-4" strokeWidth={1.75} />{parseExample.draft.due}</span>
            <PriorityChip level={parseExample.draft.priority} />
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** Шаг Б — план дня. Рекомендация, сроки и статусы не меняются. */
function PlanStep({ state, planReady, onMakePlan, showExample }: { state: AiState; planReady: boolean; onMakePlan: () => void; showExample: boolean }) {
  const stale = state === "stale";
  return (
    <div className="flex min-w-0 flex-col gap-sm">
      <div className="flex flex-wrap items-center gap-sm">
        <ListOrdered className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <h3 className="text-body font-semibold text-foreground">Выберите первое на сегодня</h3>
        {stale ? <StatusChip tone="warn">Устарело</StatusChip> : null}
      </div>
      {showExample ? (
        <ol className="flex flex-col gap-xs text-meta">
          <li className="text-muted-foreground"><Demo /> ИИ предлагает порядок, вы решаете</li>
          {planExample.map((p, i) => (
            <li key={p.code} className="flex flex-wrap items-baseline gap-sm">
              <span className="num text-muted-foreground">{i + 1}</span>
              <span className="font-medium text-foreground underline decoration-border underline-offset-4">{p.title}</span>
              <span className="text-muted-foreground">— {p.reason}</span>
              {p.lowConfidence && state === "low-confidence" ? <StatusChip tone="warn">Мало данных</StatusChip> : null}
            </li>
          ))}
        </ol>
      ) : null}
      <Button variant="secondary" size="sm" className="h-11 self-start sm:h-8" onClick={onMakePlan} disabled={state === "limit"}>
        {planReady || stale ? <RefreshCw className="size-4" strokeWidth={1.75} /> : null}
        {planReady || stale ? "Обновить" : "Составить план"}
      </Button>
    </div>
  );
}

/** Шаг В — итог недели. Числа считает система; в примере — демонстрация. */
function WeekStep({ showExample }: { showExample: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-sm">
      <div className="flex items-center gap-sm">
        <CalendarClock className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <h3 className="text-body font-semibold text-foreground">Посмотрите итоги недели</h3>
      </div>
      {showExample ? (
        <div className="flex flex-col gap-xs text-meta">
          <span className="text-muted-foreground"><Demo /> {weekExample.caption}</span>
          <span className="flex flex-wrap gap-x-md gap-y-xs">
            {weekExample.metrics.map((m) => (
              <span key={m.label}><span className="text-muted-foreground">{m.label} </span><span className="num font-medium text-foreground">{m.value}</span></span>
            ))}
          </span>
          <span className="text-foreground">{weekExample.attention}</span>
        </div>
      ) : null}
      <span className="self-start"><WeekLink /></span>
    </div>
  );
}

export function AiStart(props: Props) {
  const { composition, visit, state } = props;
  const [open, setOpen] = React.useState(visit === "first");
  React.useEffect(() => setOpen(visit === "first"), [visit]);

  if (state === "ai-off") {
    return (
      <section aria-label="Создание задачи" className="flex flex-wrap items-center gap-md border-y border-border py-md">
        <p className="min-w-0 flex-1 text-body text-muted-foreground">Помощь ИИ отключена в настройках пространства. Задачи создаются вручную.</p>
        <Button onClick={() => window.dispatchEvent(new Event("lifehub:quick-add"))}><Plus className="size-4" strokeWidth={1.75} />Создать задачу</Button>
      </section>
    );
  }

  const expressive = composition === "expressive";
  const showExample = open;

  return (
    <section aria-labelledby="ai-start-title" className={cn("flex flex-col gap-lg", !expressive && "border-y border-border py-md")}>
      <div className="flex flex-wrap items-start gap-md">
        <Sparkles className="mt-xs size-4 text-accent" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <h2 id="ai-start-title" className="text-body font-semibold text-foreground">С чего начать с ИИ</h2>
          {open ? (
            <p className="text-meta text-muted-foreground">Запишите дело одной фразой, выберите первое на сегодня или посмотрите итоги недели.</p>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" className="h-11 sm:h-8" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <ChevronDown className={cn("size-4 transition-base", open ? "" : "-rotate-90")} strokeWidth={1.75} />
          {open ? "Скрыть примеры" : "Показать примеры"}
        </Button>
      </div>

      {expressive ? (
        <div className="grid gap-lg lg:grid-cols-5">
          <div className="lg:col-span-3"><ParseStep prominent state={state} onCreate={props.onCreate} showExample={showExample} /></div>
          <div className="flex flex-col gap-lg lg:col-span-2">
            <PlanStep state={state} planReady={props.planReady} onMakePlan={props.onMakePlan} showExample={showExample} />
            <div className="border-t border-border pt-lg"><WeekStep showExample={showExample} /></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          <ParseStep prominent={false} state={state} onCreate={props.onCreate} showExample={showExample} />
          {open ? (
            <div className="grid gap-lg border-t border-border pt-md md:grid-cols-2">
              <PlanStep state={state} planReady={props.planReady} onMakePlan={props.onMakePlan} showExample />
              <WeekStep showExample />
            </div>
          ) : (
            <div className="flex flex-wrap gap-sm">
              <Button variant="secondary" size="sm" className="h-11 sm:h-8" onClick={props.onMakePlan}>{props.planReady ? "Обновить план" : "Составить план"}</Button>
              <WeekLink />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function WeekLink() {
  return (
    <Link to="/review" className="inline-flex h-11 items-center gap-sm rounded-md border border-border bg-surface px-md text-meta font-medium text-foreground transition-fast hover:bg-surface-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-8">
      Посмотреть итог
    </Link>
  );
}

