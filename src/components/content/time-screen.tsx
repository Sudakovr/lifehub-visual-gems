import * as React from "react";
import { Play, Square } from "lucide-react";
import { AppShell, PageHeading, Metric } from "@/components/app/app-shell";
import { Button, Checkbox, Input, Select } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Modal } from "@/components/app/modal";
import { timeDays, type DayEntry } from "@/mock/content";
import { hoursMinutes } from "@/mock/projects";
import { activeTimer } from "@/mock/shell";

/* Учёт времени пространства: записи по дням, ручной ввод, правка, один активный таймер. */

const startable = [
  { code: "LH-2455", title: "Согласовать смету подрядчика" },
  { code: "LH-2390", title: "Забрать ключи от помещения" },
  { code: "LH-2497", title: "Инструкция по возвратам" },
];

export function TimeScreen() {
  const [manual, setManual] = React.useState(false);
  const [edit, setEdit] = React.useState<DayEntry | null>(null);
  const [conflict, setConflict] = React.useState<{ code: string; title: string } | null>(null);
  const [running, setRunning] = React.useState(activeTimer.taskCode);

  const all = timeDays.flatMap((d) => d.entries);
  const total = all.reduce((s, e) => s + e.minutes, 0);
  const billable = all.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0);

  return (
    <AppShell>
      <PageHeading
        title="Время"
        note="Записи пространства за 9–12 июня. Оплачиваемое считается отдельно."
        actions={
          <>
            <Button variant="secondary">Выгрузить отчёт</Button>
            <Button onClick={() => setManual(true)}>Добавить запись</Button>
          </>
        }
      />

      <div className="mt-xl flex flex-wrap items-center gap-md border-y border-border py-md">
        <span className="size-2 rounded-full bg-ok" aria-hidden />
        <p className="text-body text-foreground">
          Идёт таймер: <span className="num">{running}</span> · {activeTimer.taskTitle}
        </p>
        <span className="num text-body font-medium text-foreground">{activeTimer.elapsed}</span>
        <span className="text-meta text-muted-foreground">начат в {activeTimer.started}</span>
        <Button variant="secondary" size="sm" className="ml-auto">
          <Square className="size-3.5" strokeWidth={2} />
          Остановить таймер
        </Button>
      </div>

      <div className="mt-lg flex flex-wrap items-center gap-md">
        <span className="text-meta text-muted-foreground">Запустить таймер по задаче:</span>
        {startable.map((t) => (
          <Button key={t.code} variant="ghost" size="sm" onClick={() => setConflict(t)}>
            <Play className="size-3.5" strokeWidth={1.75} />
            <span className="num">{t.code}</span>
          </Button>
        ))}
      </div>

      <div className="mt-xl grid gap-xl border-y border-border py-lg sm:grid-cols-3">
        <Metric label="Всего за период" value={hoursMinutes(total)} />
        <Metric label="Оплачиваемое" value={hoursMinutes(billable)} tone="ok" note={`${all.length - all.filter((e) => e.billable).length} записей без оплаты`} />
        <Metric label="Записей" value={String(all.length)} note="из них 3 добавлены вручную" />
      </div>

      <div className="mt-2xl flex flex-col gap-2xl">
        {timeDays.map((day) => {
          const dayTotal = day.entries.reduce((s, e) => s + e.minutes, 0);
          const dayBillable = day.entries.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0);
          return (
            <section key={day.date}>
              <div className="flex flex-wrap items-baseline justify-between gap-md border-b border-border pb-sm">
                <h2 className="text-title font-semibold text-foreground">
                  {day.date} <span className="text-meta font-normal text-muted-foreground">{day.weekday}</span>
                </h2>
                <p className="text-meta text-muted-foreground">
                  Всего <span className="num text-foreground">{hoursMinutes(dayTotal)}</span> · оплачиваемое{" "}
                  <span className="num text-foreground">{hoursMinutes(dayBillable)}</span>
                </p>
              </div>
              <ul className="divide-y divide-border">
                {day.entries.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-md py-sm">
                    <span className="num w-28 shrink-0 text-meta text-muted-foreground">
                      {e.start}–{e.end}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-body text-foreground">
                        <span className="num text-muted-foreground">{e.taskCode}</span> {e.task}
                      </span>
                      <span className="block text-meta text-muted-foreground">{e.comment}</span>
                    </span>
                    <span className="w-32 shrink-0 text-meta text-muted-foreground">
                      {e.billable ? "Оплачиваемое" : "Без оплаты"}
                    </span>
                    <span className="num w-24 shrink-0 text-right text-body text-foreground">
                      {hoursMinutes(e.minutes)}
                    </span>
                    <KebabMenu
                      items={[
                        { label: "Изменить запись", onSelect: () => setEdit(e) },
                        { label: e.billable ? "Снять оплачиваемое" : "Отметить оплачиваемым" },
                      ]}
                      destructive={{ label: "Удалить запись" }}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Modal
        open={manual}
        title="Добавить запись времени"
        description="Ручная запись за прошедшее время: задача, интервал и комментарий."
        onClose={() => setManual(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setManual(false)}>
              Отменить
            </Button>
            <Button onClick={() => setManual(false)}>Добавить запись</Button>
          </>
        }
      >
        <EntryForm />
      </Modal>

      <Modal
        open={edit !== null}
        title="Изменить запись времени"
        description={edit ? `${edit.taskCode} · ${edit.task}` : undefined}
        onClose={() => setEdit(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEdit(null)}>
              Отменить
            </Button>
            <Button onClick={() => setEdit(null)}>Сохранить запись</Button>
          </>
        }
      >
        {edit ? <EntryForm entry={edit} /> : null}
      </Modal>

      <Modal
        open={conflict !== null}
        title="Уже идёт другой таймер"
        description={`Одновременно работает один таймер. Сейчас идёт ${activeTimer.taskCode} — ${activeTimer.taskTitle}, ${activeTimer.elapsed}.`}
        onClose={() => setConflict(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConflict(null)}>
              Оставить текущий
            </Button>
            <Button
              onClick={() => {
                if (conflict) setRunning(conflict.code);
                setConflict(null);
              }}
            >
              Остановить и запустить новый
            </Button>
          </>
        }
      >
        <p className="text-body text-foreground">
          Текущий таймер остановится, время запишется в задачу {activeTimer.taskCode}. Новый таймер пойдёт по задаче{" "}
          <span className="num">{conflict?.code}</span> — {conflict?.title}.
        </p>
      </Modal>
    </AppShell>
  );
}

function EntryForm({ entry }: { entry?: DayEntry }) {
  return (
    <div className="flex flex-col gap-lg">
      <Select aria-label="Задача" defaultValue={entry?.taskCode ?? "LH-2455"}>
        <option value="LH-2455">LH-2455 · Согласовать смету подрядчика</option>
        <option value="LH-2481">LH-2481 · Свести отчёт по кварталу</option>
        <option value="LH-2390">LH-2390 · Забрать ключи от помещения</option>
      </Select>
      <div className="grid gap-lg sm:grid-cols-3">
        <Input aria-label="Дата" defaultValue="12.06.2026" />
        <Input aria-label="Начало" defaultValue={entry?.start ?? "09:30"} />
        <Input aria-label="Конец" defaultValue={entry?.end ?? "11:00"} />
      </div>
      <Input aria-label="Комментарий" defaultValue={entry?.comment ?? ""} placeholder="Что делали" />
      <Checkbox label="Оплачиваемое время" defaultChecked={entry?.billable ?? true} />
    </div>
  );
}
