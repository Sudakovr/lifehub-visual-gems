import * as React from "react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Modal } from "@/components/app/modal";
import { Button, Field, Select } from "@/components/kit/primitives";
import { GroupHead, TaskRow } from "@/components/daily/task-row";
import { inboxProjects, inboxTasks, inboxTotal, type DailyTask } from "@/mock/daily";

/* Входящие: задачи без проекта. Главное действие строки — «В проект…». */

export function InboxScreen() {
  const [tasks, setTasks] = React.useState<DailyTask[]>(inboxTasks);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [move, setMove] = React.useState<"single" | "bulk" | null>(null);
  const [target, setTarget] = React.useState<string | null>(null);
  const [project, setProject] = React.useState(inboxProjects[0]!);

  const rest = inboxTotal - tasks.length;

  function moveOut(ids: string[]) {
    setTasks((list) => list.filter((t) => !ids.includes(t.id)));
    setSelected((s) => s.filter((id) => !ids.includes(id)));
    setMove(null);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-xl">
        <PageHeading
          title="Входящие"
          note="Задачи без проекта. Каждой нужен проект — тогда она попадёт в общий ход работы."
          actions={
            <span className="num text-meta text-muted-foreground">
              {inboxTotal} задач во входящих
            </span>
          }
        />

        {selected.length > 0 ? (
          <div className="flex flex-wrap items-center gap-md rounded-md border border-accent/30 bg-accent-soft px-lg py-sm">
            <span className="text-body text-foreground">
              Выделено <span className="num">{selected.length}</span>
            </span>
            <Button size="sm" onClick={() => setMove("bulk")}>
              В проект…
            </Button>
            <Button variant="secondary" size="sm">
              Изменить срок
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelected([])}>
              Снять выделение
            </Button>
          </div>
        ) : null}

        <section className="flex flex-col gap-md">
          <GroupHead
            title="Первая сотня"
            count={tasks.length}
            note="Разбирайте сверху вниз: сначала то, у чего уже есть срок"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(selected.length === tasks.length ? [] : tasks.map((t) => t.id))}
              >
                {selected.length === tasks.length ? "Снять выделение" : "Выделить все"}
              </Button>
            }
          />

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center gap-md rounded-lg border border-dashed border-border py-4xl text-center">
              <h3 className="text-title font-semibold text-foreground">Входящие разобраны</h3>
              <p className="max-w-prose text-body text-muted-foreground">
                Все задачи лежат в проектах. Новые появятся здесь после быстрого ввода по клавише N.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border border-b border-border">
              {tasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  selectable
                  selected={selected.includes(t.id)}
                  onSelect={(v) =>
                    setSelected((s) => (v ? [...s, t.id] : s.filter((id) => id !== t.id)))
                  }
                  menu={["Открыть задачу", "Изменить срок", "Сменить исполнителя"]}
                  actions={
                    <Button
                      size="sm"
                      onClick={() => {
                        setTarget(t.id);
                        setMove("single");
                      }}
                    >
                      В проект…
                    </Button>
                  }
                />
              ))}
            </ul>
          )}

          {rest > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-md py-md">
              <p className="text-meta text-muted-foreground">
                Показаны <span className="num">{tasks.length}</span> из{" "}
                <span className="num">{inboxTotal}</span>. Остальные{" "}
                <span className="num">{rest}</span> — за списком, чтобы экран оставался читаемым.
              </p>
              <Button variant="secondary" size="sm">
                Показать ещё 50
              </Button>
            </div>
          ) : null}
        </section>
      </div>

      <Modal
        open={move !== null}
        title="Перенести в проект"
        description={
          move === "bulk"
            ? `Задачи получат проект и уйдут из входящих. Выбрано ${selected.length}.`
            : "Задача получит проект и уйдёт из входящих."
        }
        onClose={() => setMove(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMove(null)}>
              Отменить
            </Button>
            <Button onClick={() => moveOut(move === "bulk" ? selected : target ? [target] : [])}>
              Перенести
            </Button>
          </>
        }
      >
        <Field label="Проект" id="inbox-project">
          <Select id="inbox-project" value={project} onChange={(e) => setProject(e.target.value)}>
            {inboxProjects.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>
      </Modal>
    </AppShell>
  );
}
