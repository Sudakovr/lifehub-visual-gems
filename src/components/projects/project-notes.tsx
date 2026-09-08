import * as React from "react";
import { Paperclip, Plus, Search } from "lucide-react";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Button, Input, Select } from "@/components/kit/primitives";
import { SectionHead, TagDot, TaskLink } from "@/components/projects/shared";
import { projectNotes, spaceTags } from "@/mock/projects";

export function ProjectNotes() {
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState("Все");

  const rows = projectNotes.filter(
    (n) =>
      (tag === "Все" || n.tags.includes(tag)) &&
      (n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-lg">
      <SectionHead
        title="Заметки проекта"
        note={`${projectNotes.length} заметок`}
        action={
          <div className="flex flex-wrap items-center gap-sm">
            <div className="relative w-56">
              <Search className="pointer-events-none absolute top-1/2 left-md size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
              <Input
                aria-label="Поиск по заметкам"
                placeholder="Поиск по тексту"
                className="pl-3xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select aria-label="Фильтр по тегу" className="w-40" value={tag} onChange={(e) => setTag(e.target.value)}>
              <option>Все</option>
              {spaceTags.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </Select>
            <Button size="sm">
              <Plus className="size-4" strokeWidth={1.75} />
              Создать заметку
            </Button>
          </div>
        }
      />

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-md rounded-lg border border-dashed border-border py-4xl text-center">
          <h3 className="text-title font-semibold text-foreground">Заметок по этим условиям нет</h3>
          <p className="max-w-prose text-body text-muted-foreground">
            Заметка хранит решения и договорённости рядом с задачами проекта.
          </p>
          <Button variant="secondary" onClick={() => { setQuery(""); setTag("Все"); }}>
            Сбросить фильтры
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((n) => (
            <li key={n.id} className="flex flex-col gap-sm py-lg transition-fast hover:bg-surface-pressed sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 flex-col gap-xs">
                <h3 className="text-body font-medium text-foreground">{n.title}</h3>
                <p className="max-w-prose text-body text-muted-foreground">{n.excerpt}</p>
                <div className="flex flex-wrap items-center gap-sm">
                  {n.tags.map((t) => (
                    <TagDot key={t} name={t} />
                  ))}
                  {n.task ? (
                    <span className="text-meta text-muted-foreground">
                      Связана с задачей <TaskLink code={n.task} />
                    </span>
                  ) : null}
                  {n.attachments ? (
                    <span className="flex items-center gap-xs text-meta text-muted-foreground">
                      <Paperclip className="size-3" strokeWidth={1.75} />
                      <span className="num">{n.attachments}</span> вложения
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-md">
                <span className="flex flex-col text-meta text-muted-foreground sm:items-end">
                  <span>{n.author}</span>
                  <span className="num">{n.date}</span>
                </span>
                <KebabMenu
                  items={[{ label: "Открыть заметку" }, { label: "Связать с задачей" }, { label: "Скопировать ссылку" }]}
                  destructive={{ label: "Удалить заметку" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
