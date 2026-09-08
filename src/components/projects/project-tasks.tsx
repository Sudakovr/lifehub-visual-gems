import * as React from "react";
import { ChevronDown, ChevronRight, Filter, Search, Settings2 } from "lucide-react";
import { KebabMenu } from "@/components/app/kebab-menu";
import {
  Button,
  Checkbox,
  Input,
  PriorityChip,
  Select,
  Skeleton,
  StatusChip,
} from "@/components/kit/primitives";
import { SectionHead, TaskLink, taskStatusTone } from "@/components/projects/shared";
import { hoursMinutes, projectTasks, type ProjectTask } from "@/mock/projects";
import { cn } from "@/lib/utils";

type Column = { key: string; label: string; width?: string };

const allColumns: Column[] = [
  { key: "status", label: "Статус" },
  { key: "priority", label: "Приоритет" },
  { key: "assignee", label: "Исполнитель" },
  { key: "author", label: "Постановщик" },
  { key: "due", label: "Срок" },
  { key: "checklist", label: "Чек-лист" },
  { key: "time", label: "Время" },
  { key: "comments", label: "Обсуждение" },
];

type State = "ready" | "loading" | "empty" | "readonly";

export function ProjectTasks() {
  const [state, setState] = React.useState<State>("ready");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("Все");
  const [group, setGroup] = React.useState("Без группировки");
  const [sort, setSort] = React.useState<"due" | "priority" | "title">("due");
  const [columns, setColumns] = React.useState(allColumns.map((c) => c.key));
  const [columnsOpen, setColumnsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [collapsed, setCollapsed] = React.useState<string[]>([]);

  const canEdit = state !== "readonly";

  const roots = projectTasks.filter((t) => !t.parentId);
  const childrenOf = (id: string) => projectTasks.filter((t) => t.parentId === id);

  const matches = (t: ProjectTask) =>
    (status === "Все" || t.status === status) &&
    (!query || t.title.toLowerCase().includes(query.toLowerCase()) || t.code.toLowerCase().includes(query.toLowerCase()));

  const sortFn = (a: ProjectTask, b: ProjectTask) => {
    if (sort === "title") return a.title.localeCompare(b.title, "ru");
    if (sort === "priority") {
      const order = ["Критический", "Высокий", "Обычный", "Низкий"];
      return order.indexOf(a.priority) - order.indexOf(b.priority);
    }
    return a.due.localeCompare(b.due, "ru");
  };

  const visibleRoots = roots.filter((t) => matches(t) || childrenOf(t.id).some(matches)).sort(sortFn);

  type Line = { task: ProjectTask; depth: number; hasChildren: boolean };
  const lines: Line[] = [];
  function push(task: ProjectTask, depth: number) {
    const kids = childrenOf(task.id);
    lines.push({ task, depth, hasChildren: kids.length > 0 });
    if (!collapsed.includes(task.id)) kids.sort(sortFn).forEach((k) => push(k, depth + 1));
  }
  visibleRoots.forEach((t) => push(t, 0));

  const groups: { title: string; lines: Line[] }[] =
    group === "Без группировки"
      ? [{ title: "", lines }]
      : Object.entries(
          lines.reduce<Record<string, Line[]>>((acc, l) => {
            const key =
              group === "По статусу" ? l.task.status : group === "По исполнителю" ? l.task.assignee : l.task.due;
            (acc[key] ??= []).push(l);
            return acc;
          }, {}),
        ).map(([title, ls]) => ({ title, lines: ls }));

  const has = (key: string) => columns.includes(key);

  function toggleSelected(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="flex flex-col gap-lg">
      <SectionHead
        title="Задачи проекта"
        note={`${lines.length} строк`}
        action={
          <div className="flex items-center gap-sm">
            <Select
              aria-label="Состояние экрана для эталона"
              className="w-52"
              value={state}
              onChange={(e) => setState(e.target.value as State)}
            >
              <option value="ready">Обычное состояние</option>
              <option value="loading">Загрузка</option>
              <option value="empty">Ничего не найдено</option>
              <option value="readonly">Нет прав на изменение</option>
            </Select>
            {canEdit ? <Button size="sm">Создать задачу</Button> : null}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-md">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-md size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <Input
            aria-label="Поиск по названию задачи"
            placeholder="Поиск по названию"
            className="pl-3xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-sm text-meta text-muted-foreground">
          <Filter className="size-4" strokeWidth={1.75} />
          Статус
          <Select aria-label="Фильтр по статусу" className="w-36" value={status} onChange={(e) => setStatus(e.target.value)}>
            {["Все", "Новая", "В работе", "Пауза", "На приёмке", "Готово", "Отменена"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-sm text-meta text-muted-foreground">
          Группировка
          <Select aria-label="Группировка" className="w-44" value={group} onChange={(e) => setGroup(e.target.value)}>
            {["Без группировки", "По статусу", "По исполнителю", "По сроку"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-sm text-meta text-muted-foreground">
          Сортировка
          <Select aria-label="Сортировка" className="w-40" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="due">По сроку</option>
            <option value="priority">По приоритету</option>
            <option value="title">По названию</option>
          </Select>
        </label>

        <div className="relative ml-auto">
          <Button variant="secondary" size="sm" onClick={() => setColumnsOpen((v) => !v)} aria-expanded={columnsOpen}>
            <Settings2 className="size-4" strokeWidth={1.75} />
            Колонки
          </Button>
          {columnsOpen ? (
            <div className="absolute right-0 z-30 mt-xs flex w-56 flex-col gap-sm rounded-md border border-border bg-surface p-md shadow-e2">
              {allColumns.map((c) => (
                <Checkbox
                  key={c.key}
                  label={c.label}
                  checked={has(c.key)}
                  onChange={(v) => setColumns((cols) => (v ? [...cols, c.key] : cols.filter((k) => k !== c.key)))}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {!canEdit ? (
        <p className="rounded-md border border-border bg-surface-sunken px-lg py-md text-body text-muted-foreground">
          У вас доступ только на чтение. Изменение задач, массовые действия и создание недоступны — попросите владельца
          проекта выдать роль участника.
        </p>
      ) : null}

      {selected.length > 0 && canEdit ? (
        <div className="sticky top-14 z-20 flex flex-wrap items-center gap-sm rounded-md border border-border bg-surface px-lg py-sm shadow-e1">
          <span className="num text-body font-medium text-foreground">Выбрано {selected.length}</span>
          <Button variant="secondary" size="sm">Статус</Button>
          <Button variant="secondary" size="sm">Исполнитель</Button>
          <Button variant="secondary" size="sm">Срок</Button>
          <Button variant="secondary" size="sm">Тег</Button>
          <Button variant="secondary" size="sm">Перенести в проект</Button>
          <Button variant="secondary" size="sm">В архив</Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])} className="ml-auto">
            Снять выделение
          </Button>
        </div>
      ) : null}

      {state === "loading" ? (
        <TableSkeleton />
      ) : state === "empty" || lines.length === 0 ? (
        <div className="flex flex-col items-center gap-md rounded-lg border border-dashed border-border py-4xl text-center">
          <h3 className="text-title font-semibold text-foreground">По этим условиям задач нет</h3>
          <p className="max-w-prose text-body text-muted-foreground">
            Смягчите фильтр или очистите поиск — в проекте есть ещё {projectTasks.length} задач.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setQuery("");
              setStatus("Все");
              setState("ready");
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-5xl border-collapse text-body">
            <thead>
              <tr className="border-b border-border-strong text-left text-meta text-muted-foreground">
                {canEdit ? <th className="w-8 py-sm" /> : null}
                <th className="py-sm pr-md font-medium">Задача</th>
                {has("status") ? <th className="px-md py-sm font-medium">Статус</th> : null}
                {has("priority") ? <th className="px-md py-sm font-medium">Приоритет</th> : null}
                {has("assignee") ? <th className="px-md py-sm font-medium">Исполнитель</th> : null}
                {has("author") ? <th className="px-md py-sm font-medium">Постановщик</th> : null}
                {has("due") ? <th className="px-md py-sm font-medium">Срок</th> : null}
                {has("checklist") ? <th className="px-md py-sm font-medium">Чек-лист</th> : null}
                {has("time") ? <th className="px-md py-sm text-right font-medium">Время</th> : null}
                {has("comments") ? <th className="px-md py-sm text-right font-medium">Обсуждение</th> : null}
                <th className="py-sm pl-md" />
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody key={g.title || "all"}>
                {g.title ? (
                  <tr>
                    <td colSpan={12} className="bg-surface-sunken px-md py-xs text-meta font-medium text-muted-foreground">
                      {g.title}
                      <span className="num ml-sm">{g.lines.length}</span>
                    </td>
                  </tr>
                ) : null}
                {g.lines.map(({ task, depth, hasChildren }) => (
                  <tr
                    key={task.id}
                    className={cn(
                      "border-b border-border transition-fast hover:bg-surface-pressed",
                      selected.includes(task.id) && "bg-accent-soft",
                    )}
                  >
                    {canEdit ? (
                      <td className="py-xs pl-xs">
                        <Checkbox
                          label=""
                          checked={selected.includes(task.id)}
                          onChange={() => toggleSelected(task.id)}
                        />
                      </td>
                    ) : null}
                    <td className="py-xs pr-md">
                      <span className="flex items-center gap-xs" style={{ paddingLeft: `calc(var(--spacing-xl) * ${depth})` }}>
                        {hasChildren ? (
                          <button
                            aria-label={collapsed.includes(task.id) ? "Раскрыть подзадачи" : "Свернуть подзадачи"}
                            onClick={() =>
                              setCollapsed((c) =>
                                c.includes(task.id) ? c.filter((x) => x !== task.id) : [...c, task.id],
                              )
                            }
                            className="text-muted-foreground transition-fast hover:text-foreground"
                          >
                            {collapsed.includes(task.id) ? (
                              <ChevronRight className="size-4" strokeWidth={1.75} />
                            ) : (
                              <ChevronDown className="size-4" strokeWidth={1.75} />
                            )}
                          </button>
                        ) : (
                          <span className="size-4" aria-hidden />
                        )}
                        <TaskLink code={task.code} title={task.title} />
                      </span>
                    </td>
                    {has("status") ? (
                      <td className="px-md py-xs">
                        <StatusChip tone={taskStatusTone[task.status]}>{task.status}</StatusChip>
                      </td>
                    ) : null}
                    {has("priority") ? (
                      <td className="px-md py-xs">
                        <PriorityChip level={task.priority} />
                      </td>
                    ) : null}
                    {has("assignee") ? <td className="px-md py-xs whitespace-nowrap">{task.assignee}</td> : null}
                    {has("author") ? (
                      <td className="px-md py-xs whitespace-nowrap text-muted-foreground">{task.author}</td>
                    ) : null}
                    {has("due") ? (
                      <td className="px-md py-xs whitespace-nowrap">
                        <span className={cn("num", task.overdue && "font-medium text-danger-foreground")}>
                          {task.overdue ? `Просрочено ${task.due}` : task.due}
                        </span>
                      </td>
                    ) : null}
                    {has("checklist") ? (
                      <td className="num px-md py-xs">
                        {task.checklistDone} / {task.checklistTotal}
                      </td>
                    ) : null}
                    {has("time") ? (
                      <td className="num px-md py-xs text-right whitespace-nowrap">
                        {hoursMinutes(task.spentMin)} из {hoursMinutes(task.estimateMin)}
                      </td>
                    ) : null}
                    {has("comments") ? <td className="num px-md py-xs text-right">{task.comments}</td> : null}
                    <td className="py-xs pl-md text-right">
                      {canEdit ? (
                        <KebabMenu
                          items={[
                            { label: "Сменить исполнителя" },
                            { label: "Изменить срок" },
                            { label: "Перенести в другой проект" },
                            { label: "В архив" },
                          ]}
                          destructive={{ label: "Удалить задачу" }}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-sm">
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="flex items-center gap-lg border-b border-border py-sm">
          <Skeleton className="h-4 w-4 rounded-xs" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
