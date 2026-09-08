import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Archive, LayoutList, Plus, Rows3, Search } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Modal } from "@/components/app/modal";
import { AvatarGroup, Button, Field, Input, Select, Textarea } from "@/components/kit/primitives";
import {
  DueText,
  ProgressBar,
  ProjectStatusChip,
  RiskChip,
  TagDot,
} from "@/components/projects/shared";
import { projects, spaceTags, type ProjectRow, type ProjectStatus } from "@/mock/projects";
import { cn } from "@/lib/utils";

const VIEW_KEY = "lifehub.projects.view";
type View = "dense" | "rows";

const statusFilters: (ProjectStatus | "Все")[] = [
  "Все",
  "Черновик",
  "Активен",
  "Пауза",
  "Завершён",
  "Отменён",
];

export function ProjectsListScreen() {
  const [view, setView] = React.useState<View>("dense");
  const [status, setStatus] = React.useState<(typeof statusFilters)[number]>("Все");
  const [tag, setTag] = React.useState("Все");
  const [query, setQuery] = React.useState("");
  const [archive, setArchive] = React.useState(false);
  const [create, setCreate] = React.useState(false);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "dense" || saved === "rows") setView(saved);
  }, []);

  function changeView(next: View) {
    setView(next);
    window.localStorage.setItem(VIEW_KEY, next);
  }

  const rows = projects.filter((p) => {
    if (archive !== Boolean(p.archived)) return false;
    if (status !== "Все" && p.status !== status) return false;
    if (tag !== "Все" && !p.tags.includes(tag)) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-col gap-xl">
        <PageHeading
          title={archive ? "Архив проектов" : "Проекты"}
          note={
            archive
              ? "Проекты выведены из работы. Их можно вернуть, содержимое сохраняется."
              : "Всё, что ведётся в пространстве «Работа». Личное пространство отдельно и не расшаривается."
          }
          actions={
            <>
              <Button variant="secondary" onClick={() => setArchive((v) => !v)}>
                <Archive className="size-4" strokeWidth={1.75} />
                {archive ? "К активным" : "Архив"}
              </Button>
              <Button onClick={() => setCreate(true)}>
                <Plus className="size-4" strokeWidth={1.75} />
                Создать проект
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap items-center gap-md border-y border-border py-md">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-md size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <Input
              aria-label="Поиск по названию проекта"
              placeholder="Поиск по названию"
              className="pl-3xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-sm text-meta text-muted-foreground">
            Статус
            <Select
              aria-label="Фильтр по статусу"
              className="w-40"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              {statusFilters.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </label>
          <label className="flex items-center gap-sm text-meta text-muted-foreground">
            Тег
            <Select aria-label="Фильтр по тегу" className="w-40" value={tag} onChange={(e) => setTag(e.target.value)}>
              <option>Все</option>
              {spaceTags.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </Select>
          </label>

          <div className="ml-auto flex items-center gap-xs rounded-md border border-border p-2xs">
            <ViewButton active={view === "dense"} onClick={() => changeView("dense")} label="Плотная таблица">
              <LayoutList className="size-4" strokeWidth={1.75} />
            </ViewButton>
            <ViewButton active={view === "rows"} onClick={() => changeView("rows")} label="Крупные строки">
              <Rows3 className="size-4" strokeWidth={1.75} />
            </ViewButton>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyProjects archive={archive} onCreate={() => setCreate(true)} />
        ) : view === "dense" ? (
          <DenseTable rows={rows} />
        ) : (
          <BigRows rows={rows} />
        )}
      </div>

      <Modal
        open={create}
        title="Создать проект"
        description="Проект появится в пространстве «Работа». Участников можно добавить позже."
        onClose={() => setCreate(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreate(false)}>
              Отменить
            </Button>
            <Button onClick={() => setCreate(false)}>Создать проект</Button>
          </>
        }
      >
        <Field label="Название" id="np-name">
          <Input id="np-name" placeholder="Например, «Запуск платёжного шлюза»" />
        </Field>
        <Field label="Описание" id="np-desc" hint="Одно-два предложения о цели проекта.">
          <Textarea id="np-desc" />
        </Field>
        <div className="grid gap-lg sm:grid-cols-2">
          <Field label="Статус" id="np-status">
            <Select id="np-status" defaultValue="Черновик">
              {statusFilters.slice(1).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Плановое завершение" id="np-due">
            <Input id="np-due" placeholder="дд.мм.гггг" />
          </Field>
        </div>
      </Modal>
    </AppShell>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-xs rounded-sm px-md text-meta transition-fast",
        active ? "bg-surface-pressed text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function DenseTable({ rows }: { rows: ProjectRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-table-wide border-collapse text-body">
        <thead>
          <tr className="border-b border-border-strong text-left text-meta text-muted-foreground">
            <th className="py-sm pr-md font-medium">Название</th>
            <th className="px-md py-sm font-medium">Статус</th>
            <th className="px-md py-sm font-medium">Ход выполнения</th>
            <th className="px-md py-sm font-medium">Ближайший срок</th>
            <th className="px-md py-sm font-medium">Участники</th>
            <th className="px-md py-sm text-right font-medium">Задач открыто / всего</th>
            <th className="px-md py-sm font-medium">Риск срыва</th>
            <th className="py-sm pl-md" />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-border transition-fast hover:bg-surface-pressed">
              <td className="py-sm pr-md">
                <Link
                  to="/projects/$id"
                  params={{ id: p.id }}
                  className="font-medium text-foreground transition-fast hover:text-accent"
                >
                  {p.name}
                </Link>
                <div className="mt-2xs flex flex-wrap gap-xs">
                  {p.tags.map((t) => (
                    <TagDot key={t} name={t} />
                  ))}
                </div>
              </td>
              <td className="px-md py-sm">
                <ProjectStatusChip status={p.status} />
              </td>
              <td className="w-48 px-md py-sm">
                <div className="flex items-center gap-sm">
                  <ProgressBar value={p.progress} />
                  <span className="num w-10 text-right text-meta text-muted-foreground">{p.progress}%</span>
                </div>
              </td>
              <td className="px-md py-sm">
                <DueText due={p.nextDue} overdue={p.overdue} note={p.nextDueNote} />
              </td>
              <td className="px-md py-sm">
                <AvatarGroup names={p.members} />
              </td>
              <td className="num px-md py-sm text-right">
                {p.tasksOpen} / {p.tasksTotal}
              </td>
              <td className="px-md py-sm">
                <RiskChip level={p.risk} />
              </td>
              <td className="py-sm pl-md text-right">
                <KebabMenu
                  items={[
                    { label: "Открыть задачи проекта" },
                    { label: "Изменить статус" },
                    { label: "Добавить участника" },
                    { label: "В архив" },
                  ]}
                  destructive={{ label: "Удалить проект" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BigRows({ rows }: { rows: ProjectRow[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {rows.map((p) => (
        <div key={p.id} className="flex flex-col gap-md py-lg transition-fast hover:bg-surface-pressed lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-xs">
            <div className="flex flex-wrap items-center gap-sm">
              <Link
                to="/projects/$id"
                params={{ id: p.id }}
                className="text-title font-semibold text-foreground transition-fast hover:text-accent"
              >
                {p.name}
              </Link>
              <ProjectStatusChip status={p.status} />
              <RiskChip level={p.risk} />
            </div>
            <p className="max-w-prose text-meta text-muted-foreground">{p.summary}</p>
            <p className="max-w-prose text-meta text-muted-foreground">Причина риска: {p.riskReason}</p>
            <div className="flex flex-wrap gap-xs">
              {p.tags.map((t) => (
                <TagDot key={t} name={t} />
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-x-xl gap-y-md lg:w-rowmeta lg:flex-nowrap lg:justify-between">
            <div className="w-40 shrink-0">
              <div className="mb-xs flex items-baseline justify-between text-meta text-muted-foreground">
                <span>Ход</span>
                <span className="num">{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} />
            </div>
            <div className="flex w-40 shrink-0 flex-col gap-2xs">
              <span className="text-meta text-muted-foreground">Ближайший срок</span>
              <DueText due={p.nextDue} overdue={p.overdue} note={p.nextDueNote} />
            </div>
            <div className="flex w-32 shrink-0 flex-col gap-2xs">
              <span className="text-meta text-muted-foreground">Задач открыто / всего</span>
              <span className="num text-body">
                {p.tasksOpen} / {p.tasksTotal}
              </span>
            </div>
            <div className="flex w-40 shrink-0 items-center justify-end gap-md">
            <AvatarGroup names={p.members} max={4} />
            <KebabMenu
              items={[
                { label: "Открыть задачи проекта" },
                { label: "Изменить статус" },
                { label: "Добавить участника" },
                { label: "В архив" },
              ]}
              destructive={{ label: "Удалить проект" }}
            />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyProjects({ archive, onCreate }: { archive: boolean; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-lg border border-border border-dashed py-4xl text-center rounded-lg">
      <div className="flex max-w-prose flex-col gap-sm px-lg">
        <h2 className="text-title font-semibold text-foreground">
          {archive ? "В архиве пока пусто" : "Здесь появится первый проект"}
        </h2>
        <p className="text-body text-muted-foreground">
          {archive
            ? "Завершённые проекты попадают сюда после архивирования и остаются доступны для чтения."
            : "Проект собирает задачи, файлы, заметки и время в одном месте. Начните с названия — остальное добавите по ходу."}
        </p>
      </div>
      {archive ? null : (
        <Button onClick={onCreate}>
          <Plus className="size-4" strokeWidth={1.75} />
          Создать проект
        </Button>
      )}
    </div>
  );
}
