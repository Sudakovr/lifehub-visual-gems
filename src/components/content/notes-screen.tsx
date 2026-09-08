import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Paperclip, Search } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button, Input, Tag } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { notes, noteTagColors } from "@/mock/content";

/* Список заметок пространства: поиск по названию, фильтр по тегу, переход в редактор. */

const NoteLink = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}>;

const allTags = [...new Set(notes.flatMap((n) => n.tags))];

export function NotesScreen() {
  const [q, setQ] = React.useState("");
  const [tag, setTag] = React.useState<string | null>(null);

  const list = notes.filter(
    (n) =>
      (tag ? n.tags.includes(tag) : true) &&
      (q ? (n.title + n.excerpt).toLowerCase().includes(q.toLowerCase()) : true),
  );

  return (
    <AppShell>
      <PageHeading
        title="Заметки"
        note="Решения и договорённости пространства «Работа». Заметка связывается с проектом и задачей."
        actions={
          <NoteLink
            to="/notes/$id"
            params={{ id: "n-1" }}
            className="inline-flex h-9 items-center rounded-md bg-accent px-lg text-body font-medium text-accent-foreground transition-fast hover:bg-accent-hover"
          >
            Новая заметка
          </NoteLink>
        }
      />

      <div className="mt-xl flex flex-wrap items-center gap-md">
        <span className="relative w-full sm:w-80">
          <Search
            className="pointer-events-none absolute left-md top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Название или текст заметки"
            aria-label="Поиск по заметкам"
            className="pl-3xl"
          />
        </span>
        <span className="flex flex-wrap items-center gap-xs">
          <Button variant={tag === null ? "secondary" : "ghost"} size="sm" onClick={() => setTag(null)}>
            Все теги
          </Button>
          {allTags.map((t) => (
            <Button key={t} variant={tag === t ? "secondary" : "ghost"} size="sm" onClick={() => setTag(t)}>
              {t}
            </Button>
          ))}
        </span>
        <span className="ml-auto text-meta text-muted-foreground">Заметок: {list.length}</span>
      </div>

      {list.length === 0 ? (
        <div className="mt-2xl flex flex-col items-start gap-md border-t border-border pt-2xl">
          <p className="text-display font-semibold text-foreground">Ничего не нашлось</p>
          <p className="max-w-prose text-body text-muted-foreground">
            Попробуйте короче: одно слово из названия или снимите фильтр по тегу.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setQ("");
              setTag(null);
            }}
          >
            Показать все заметки
          </Button>
        </div>
      ) : (
        <ul className="mt-lg border-t border-border">
          {list.map((n) => (
            <li key={n.id} className="flex flex-wrap items-start gap-md border-b border-border py-md">
              <div className="min-w-0 flex-1">
                <NoteLink
                  to="/notes/$id"
                  params={{ id: n.id }}
                  className="text-body font-medium text-foreground transition-fast hover:text-accent"
                >
                  {n.title}
                </NoteLink>
                <p className="mt-2xs max-w-prose text-meta text-muted-foreground">{n.excerpt}</p>
              </div>
              <div className="flex flex-wrap items-center gap-md">
                <span className="text-meta text-muted-foreground">
                  {n.relation.project ?? "Без проекта"}
                </span>
                {n.tags.map((t) => (
                  <Tag key={t} color={noteTagColors[t] ?? "var(--info)"}>
                    {t}
                  </Tag>
                ))}
                {n.attachments.length ? (
                  <span className="flex items-center gap-xs text-meta text-muted-foreground">
                    <Paperclip className="size-3.5" strokeWidth={1.75} />
                    {n.attachments.length}
                  </span>
                ) : null}
                <span className="text-meta text-muted-foreground">{n.changed}</span>
                <KebabMenu
                  items={[{ label: "Открыть заметку" }, { label: "Перенести в другой проект" }]}
                  destructive={{ label: "Удалить заметку" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
