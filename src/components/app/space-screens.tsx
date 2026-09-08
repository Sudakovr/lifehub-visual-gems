import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell, PageHeading, Metric } from "@/components/app/app-shell";
import { Button, Input, StatusChip, Tag } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { spaceFiles, spaceNotes } from "@/mock/shell";
import { timeByPerson, timeByTask, hoursMinutes } from "@/mock/projects";

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string> | undefined;
  className?: string;
  children?: React.ReactNode;
}>;

/* Разделы пространства: заметки, файлы, поиск и время. */

export function NotesScreen() {
  return (
    <AppShell>
      <PageHeading
        title="Заметки"
        note="Решения и договорённости пространства «Работа». Заметка связывается с проектом и задачей."
        actions={<Button>Новая заметка</Button>}
      />
      <ul className="mt-xl border-t border-border">
        {spaceNotes.map((n) => (
          <li key={n.id} className="flex flex-wrap items-start gap-md border-b border-border py-md">
            <div className="min-w-0 flex-1">
              <p className="text-body font-medium text-foreground">{n.title}</p>
              <p className="mt-2xs max-w-prose text-meta text-muted-foreground">{n.excerpt}</p>
            </div>
            <div className="flex items-center gap-md">
              <span className="text-meta text-muted-foreground">{n.project}</span>
              {n.tags.map((t) => (
                <Tag key={t} color="var(--info)">
                  {t}
                </Tag>
              ))}
              <span className="text-meta text-muted-foreground">{n.changed}</span>
              <KebabMenu
                items={[{ label: "Открыть заметку" }, { label: "Перенести в другой проект" }]}
                destructive={{ label: "Удалить заметку" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

export function FilesScreen() {
  const tone = { обработан: "ok", "в очереди": "warn", ошибка: "danger" } as const;
  return (
    <AppShell>
      <PageHeading
        title="Файлы"
        note="Все файлы пространства с привязкой к проекту и задаче и статусом извлечения текста."
        actions={<Button variant="secondary">Загрузить файл</Button>}
      />
      <div className="mt-xl overflow-x-auto">
        <table className="w-full min-w-page border-collapse text-body">
          <thead>
            <tr className="border-y border-border text-left text-meta text-muted-foreground">
              <th className="py-sm pr-md font-medium">Имя</th>
              <th className="py-sm pr-md font-medium">Размер</th>
              <th className="py-sm pr-md font-medium">Проект</th>
              <th className="py-sm pr-md font-medium">Задача</th>
              <th className="py-sm pr-md font-medium">Загрузил</th>
              <th className="py-sm pr-md font-medium">Текст</th>
              <th className="py-sm" />
            </tr>
          </thead>
          <tbody>
            {spaceFiles.map((f) => (
              <tr key={f.id} className="border-b border-border">
                <td className="py-sm pr-md text-foreground">{f.name}</td>
                <td className="num py-sm pr-md text-muted-foreground">{f.size}</td>
                <td className="py-sm pr-md text-muted-foreground">{f.project}</td>
                <td className="num py-sm pr-md text-muted-foreground">{f.task}</td>
                <td className="py-sm pr-md text-muted-foreground">{f.author}</td>
                <td className="py-sm pr-md">
                  <span className="flex items-center gap-sm">
                    <StatusChip tone={tone[f.state]}>{f.state}</StatusChip>
                    {f.state === "ошибка" ? (
                      <Button variant="ghost" size="sm">
                        Повторить
                      </Button>
                    ) : null}
                  </span>
                </td>
                <td className="py-sm text-right">
                  <KebabMenu items={[{ label: "Скачать файл" }]} destructive={{ label: "Удалить файл" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

export function SearchScreen() {
  const [q, setQ] = React.useState("смета");
  return (
    <AppShell>
      <PageHeading title="Поиск" note="Ищет по задачам, проектам, заметкам и содержимому файлов пространства." />
      <div className="mt-lg flex max-w-2xl items-center gap-sm">
        <span className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-md top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-3xl" aria-label="Поисковый запрос" />
        </span>
        <Button>Найти</Button>
      </div>

      <p className="mt-lg text-meta text-muted-foreground">Найдено 4 совпадения по запросу «{q}»</p>
      <ul className="mt-sm border-t border-border">
        {[
          ["Задача", "LH-2455 · Согласовать смету подрядчика", "В работе · Мария Ким · срок сегодня"],
          ["Заметка", "Договорённости по подрядчику", "…оплата по смете после подписания акта каждого этапа…"],
          ["Файл", "Смета_итог.xlsx", "Переезд офиса · текст извлечён · 248 КБ"],
          ["Проект", "Переезд офиса", "Активен · 18 из 44 задач открыто"],
        ].map(([kind, title, note]) => (
          <li key={title} className="flex flex-wrap items-baseline gap-md border-b border-border py-md">
            <span className="w-20 shrink-0 text-caption text-muted-foreground">{kind}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-body text-foreground">{title}</span>
              <span className="block text-meta text-muted-foreground">{note}</span>
            </span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

export function TimeScreen() {
  return (
    <AppShell>
      <PageHeading
        title="Время"
        note="Записи пространства за период. Оплачиваемое считается отдельно."
        actions={
          <>
            <Button variant="secondary">Выгрузить отчёт</Button>
            <Button>Добавить запись</Button>
          </>
        }
      />
      <div className="mt-xl grid gap-xl border-y border-border py-lg sm:grid-cols-3">
        <Metric label="Всего за месяц" value={hoursMinutes(4820)} />
        <Metric label="Оплачиваемое" value={hoursMinutes(3410)} tone="ok" />
        <Metric label="Записей" value="86" note="из них 12 добавлены вручную" />
      </div>

      <div className="mt-2xl grid gap-2xl lg:grid-cols-2">
        <section>
          <h2 className="text-title font-semibold text-foreground">По задачам</h2>
          <ul className="mt-sm border-t border-border">
            {timeByTask.map((t) => (
              <li key={t.code} className="flex items-baseline justify-between gap-md border-b border-border py-sm">
                <Nav to="/tasks/$id" params={{ id: "2481" }} className="min-w-0 truncate text-body text-foreground">
                  <span className="num text-muted-foreground">{t.code}</span> {t.title}
                </Nav>
                <span className="num shrink-0 text-body text-foreground">{hoursMinutes(t.minutes)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-title font-semibold text-foreground">По людям</h2>
          <ul className="mt-sm border-t border-border">
            {timeByPerson.map((p) => (
              <li key={p.person} className="flex items-baseline justify-between gap-md border-b border-border py-sm">
                <span className="text-body text-foreground">{p.person}</span>
                <span className="num text-body text-foreground">{hoursMinutes(p.minutes)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
