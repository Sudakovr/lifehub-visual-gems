import * as React from "react";
import { Bookmark } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button, Select } from "@/components/kit/primitives";
import { TaskPeek } from "@/components/projects/task-peek";
import { GroupHead, TaskRow } from "@/components/daily/task-row";
import { myTasks, savedFilters, type DailyTask } from "@/mock/daily";
import { spaceTags } from "@/mock/projects";
import { cn } from "@/lib/utils";

/* Мои задачи: всё, где я исполнитель или наблюдатель, из всех пространств. */

type GroupBy = "Проект" | "Срок" | "Статус";

const DENSITY_KEY = "lifehub.my.density";

export function MyTasksScreen() {
  const [groupBy, setGroupBy] = React.useState<GroupBy>("Проект");
  const [status, setStatus] = React.useState("Все");
  const [priority, setPriority] = React.useState("Все");
  const [due, setDue] = React.useState("Все");
  const [tag, setTag] = React.useState("Все");
  const [space, setSpace] = React.useState("Все");
  const [compact, setCompact] = React.useState(false);
  const [saved, setSaved] = React.useState<string | null>(null);
  const [peek, setPeek] = React.useState<DailyTask | null>(null);

  React.useEffect(() => {
    if (window.localStorage.getItem(DENSITY_KEY) === "compact") setCompact(true);
  }, []);

  function changeDensity(v: boolean) {
    setCompact(v);
    window.localStorage.setItem(DENSITY_KEY, v ? "compact" : "normal");
  }

  const rows = myTasks.filter((t) => {
    if (status !== "Все" && t.status !== status) return false;
    if (priority !== "Все" && t.priority !== priority) return false;
    if (space !== "Все" && t.space !== space) return false;
    if (tag !== "Все" && !t.tags.includes(tag)) return false;
    if (due === "Просрочено" && !t.overdue) return false;
    if (due === "Сегодня" && !t.due.startsWith("сегодня")) return false;
    return true;
  });

  const groups = new Map<string, DailyTask[]>();
  for (const t of rows) {
    const key =
      groupBy === "Проект"
        ? (t.project ?? "Без проекта")
        : groupBy === "Статус"
          ? t.status
          : t.overdue
            ? "Просрочено"
            : t.due.startsWith("сегодня")
              ? "Сегодня"
              : "Позже";
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-xl">
        <PageHeading
          title="Мои задачи"
          note="Всё, где я исполнитель или наблюдатель, из личного и рабочего пространства."
          actions={
            <span className="num text-meta text-muted-foreground">{rows.length} задач</span>
          }
        />

        <div className="flex flex-wrap items-center gap-md border-y border-border py-md">
          <label className="flex items-center gap-sm text-meta text-muted-foreground">
            Группировка
            <Select
              aria-label="Группировка"
              className="w-36"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            >
              <option>Проект</option>
              <option>Срок</option>
              <option>Статус</option>
            </Select>
          </label>
          <FilterSelect label="Статус" value={status} onChange={setStatus} options={["Новая", "В работе", "Пауза", "На приёмке", "Готово", "Отменена"]} />
          <FilterSelect label="Приоритет" value={priority} onChange={setPriority} options={["Критический", "Высокий", "Обычный", "Низкий"]} />
          <FilterSelect label="Срок" value={due} onChange={setDue} options={["Просрочено", "Сегодня", "Позже"]} />
          <FilterSelect label="Тег" value={tag} onChange={setTag} options={spaceTags.map((t) => t.name)} />
          <FilterSelect label="Пространство" value={space} onChange={setSpace} options={["Работа", "Личное"]} />

          <div className="ml-auto flex items-center gap-xs rounded-md border border-border p-2xs">
            <DensityButton active={!compact} onClick={() => changeDensity(false)}>
              Обычная
            </DensityButton>
            <DensityButton active={compact} onClick={() => changeDensity(true)}>
              Компактная
            </DensityButton>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-sm">
          <span className="flex items-center gap-xs text-meta text-muted-foreground">
            <Bookmark className="size-4" strokeWidth={1.75} />
            Сохранённые фильтры
          </span>
          {savedFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              title={f.note}
              onClick={() => setSaved(saved === f.id ? null : f.id)}
              className={cn(
                "rounded-full border px-md py-0.5 text-meta transition-fast",
                saved === f.id
                  ? "border-accent/30 bg-accent-soft text-accent"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {f.name}
            </button>
          ))}
          <Button variant="ghost" size="sm">
            Сохранить текущий набор
          </Button>
        </div>

        <div className="flex flex-col gap-xl lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-xl">
            {rows.length === 0 ? (
              <div className="flex flex-col items-center gap-md rounded-lg border border-dashed border-border py-4xl text-center">
                <h2 className="text-title font-semibold text-foreground">По этим условиям задач нет</h2>
                <p className="max-w-prose text-body text-muted-foreground">
                  Смягчите фильтры или посмотрите день целиком на экране «Сегодня».
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStatus("Все");
                    setPriority("Все");
                    setDue("Все");
                    setTag("Все");
                    setSpace("Все");
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              [...groups.entries()].map(([name, list]) => (
                <section key={name} className="flex flex-col gap-md">
                  <GroupHead title={name} count={list.length} />
                  <ul className="divide-y divide-border border-b border-border">
                    {list.map((t) => (
                      <TaskRow key={t.id} task={t} compact={compact} onPeek={setPeek} />
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
          {peek ? <TaskPeek task={peek} onClose={() => setPeek(null)} /> : null}
        </div>
      </div>
    </AppShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-sm text-meta text-muted-foreground">
      {label}
      <Select aria-label={label} className="w-36" value={value} onChange={(e) => onChange(e.target.value)}>
        <option>Все</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </Select>
    </label>
  );
}

function DensityButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-sm px-md text-meta transition-fast",
        active ? "bg-surface-pressed text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
