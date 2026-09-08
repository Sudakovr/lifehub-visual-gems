import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Check, Smartphone } from "lucide-react";
import { Button, Field, Input, Select } from "@/components/kit/primitives";
import { ThemeToggle } from "@/components/app/app-shell";
import { cn } from "@/lib/utils";

/* Онбординг пустого аккаунта: три шага, каждый можно пропустить. */

const Nav = Link as unknown as React.FC<{ to: string; className?: string; children?: React.ReactNode }>;

type StepState = "открыт" | "готов" | "пропущен";

export function WelcomeScreen() {
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<StepState[]>(["открыт", "открыт", "открыт"]);
  const [project, setProject] = React.useState("Ремонт квартиры");
  const [task, setTask] = React.useState("Позвонить в банк по ипотеке");

  function finish(i: number, how: StepState) {
    setState((s) => s.map((v, idx) => (idx === i ? how : v)));
    setStep(i + 1);
  }

  const done = step > 2;

  const steps = [
    {
      title: "Назовите первый проект",
      note: "Проект — рамка для задач. Название можно поменять в любой момент.",
      body: (
        <div className="flex flex-col gap-lg">
          <Field label="Название проекта">
            <Input value={project} onChange={(e) => setProject(e.target.value)} />
          </Field>
          <div className="flex flex-wrap items-center gap-sm">
            <Button onClick={() => finish(0, "готов")}>Создать проект</Button>
            <Button variant="ghost" onClick={() => finish(0, "пропущен")}>
              Пропустить шаг
            </Button>
          </div>
        </div>
      ),
      result: `Проект «${project}» создан в личном пространстве`,
    },
    {
      title: "Создайте первую задачу",
      note: "Одна строка — уже задача. Срок и приоритет можно задать позже.",
      body: (
        <div className="flex flex-col gap-lg">
          <Field label="Задача">
            <Input value={task} onChange={(e) => setTask(e.target.value)} />
          </Field>
          <Field label="Проект">
            <Select defaultValue={project}>
              <option>{project}</option>
              <option>Без проекта</option>
            </Select>
          </Field>
          <div className="flex flex-wrap items-center gap-sm">
            <Button onClick={() => finish(1, "готов")}>Создать задачу</Button>
            <Button variant="ghost" onClick={() => finish(1, "пропущен")}>
              Пропустить шаг
            </Button>
          </div>
        </div>
      ),
      result: `Задача «${task}» появится в «Сегодня»`,
    },
    {
      title: "Поставьте приложение на телефон",
      note: "LifeHub открывается в браузере и ставится на домашний экран как приложение.",
      body: (
        <div className="flex flex-col gap-lg">
          <div className="flex items-start gap-md border-y border-border py-lg">
            <Smartphone className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <ol className="flex flex-col gap-xs text-body text-foreground">
              <li>1. Откройте lifehub.ru в браузере телефона.</li>
              <li>2. Нажмите «Поделиться» и «На экран Домой».</li>
              <li>3. Войдите под этой же почтой.</li>
            </ol>
          </div>
          <div className="flex flex-wrap items-center gap-sm">
            <Button onClick={() => finish(2, "готов")}>Готово, поставил</Button>
            <Button variant="ghost" onClick={() => finish(2, "пропущен")}>
              Пропустить шаг
            </Button>
          </div>
        </div>
      ),
      result: "Приложение на телефоне настроено",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <div className="mx-auto w-full max-w-page px-lg py-xl">
        <div className="flex items-center justify-between">
          <span className="text-body font-semibold text-foreground">LifeHub</span>
          <ThemeToggle />
        </div>

        <div className="mt-3xl flex flex-col gap-xs">
          <h1 className="text-heading font-semibold text-foreground">Личное пространство готово</h1>
          <p className="max-w-prose text-meta text-muted-foreground">
            Три коротких шага — и «Сегодня» откроется уже не пустым. Любой шаг можно пропустить.
          </p>
        </div>

        <ol className="mt-2xl flex flex-col">
          {steps.map((s, i) => {
            const open = i === step;
            const closed = state[i] !== "открыт" && !open;
            return (
              <li key={s.title} className="border-b border-border py-lg first:border-t first:border-border">
                <div className="flex items-start gap-md">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-caption",
                      state[i] === "готов"
                        ? "border-ok bg-ok-soft text-ok-foreground"
                        : open
                          ? "border-accent text-accent"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {state[i] === "готов" ? <Check className="size-3.5" strokeWidth={2} /> : i + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-sm">
                    <div className="flex flex-wrap items-baseline gap-sm">
                      <p className="text-title font-semibold text-foreground">{s.title}</p>
                      {closed ? (
                        <span className="text-meta text-muted-foreground">
                          {state[i] === "готов" ? s.result : "Шаг пропущен"}
                        </span>
                      ) : null}
                      {closed ? (
                        <button
                          className="text-meta text-accent underline underline-offset-4"
                          onClick={() => setStep(i)}
                        >
                          Вернуться к шагу
                        </button>
                      ) : null}
                    </div>
                    {open ? (
                      <>
                        <p className="max-w-prose text-meta text-muted-foreground">{s.note}</p>
                        <div className="mt-sm">{s.body}</div>
                      </>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-2xl flex flex-wrap items-center gap-md">
          <Nav
            to="/today"
            className="inline-flex h-9 items-center rounded-md bg-accent px-lg text-body font-medium text-accent-foreground transition-fast hover:bg-accent-hover"
          >
            {done ? "Открыть «Сегодня»" : "Перейти к «Сегодня»"}
          </Nav>
          <span className="text-meta text-muted-foreground">
            {done ? "Все шаги пройдены — день уже наполнен." : "Шаги останутся здесь, пока не пройдены."}
          </span>
        </div>
      </div>
    </div>
  );
}
