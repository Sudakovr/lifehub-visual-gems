import * as React from "react";
import { Paperclip, Plus, Search } from "lucide-react";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Modal } from "@/components/app/modal";
import { Button, Field, Input, Select, Textarea } from "@/components/kit/primitives";
import { SectionHead, TagDot, TaskLink } from "@/components/projects/shared";
import { projectNotes, spaceTags, type ProjectNote } from "@/mock/projects";

export function ProjectNotes() {
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState("Все");
  const [notes, setNotes] = React.useState<ProjectNote[]>(projectNotes);
  const [editing, setEditing] = React.useState<ProjectNote | "new" | null>(null);

  const rows = notes.filter(
    (n) =>
      (tag === "Все" || n.tags.includes(tag)) &&
      (n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(query.toLowerCase())),
  );

  function save(draft: { title: string; excerpt: string; tag: string }) {
    if (editing === "new") {
      setNotes((list) => [
        {
          id: `n-${Date.now()}`,
          title: draft.title || "Без названия",
          excerpt: draft.excerpt,
          author: "Анна Верёвкина",
          date: "сегодня",
          tags: draft.tag === "Без тега" ? [] : [draft.tag],
          attachments: 0,
        },
        ...list,
      ]);
    } else if (editing) {
      const id = editing.id;
      setNotes((list) =>
        list.map((n) =>
          n.id === id
            ? { ...n, title: draft.title, excerpt: draft.excerpt, tags: draft.tag === "Без тега" ? [] : [draft.tag] }
            : n,
        ),
      );
    }
    setEditing(null);
  }

  return (
    <div className="flex flex-col gap-lg">
      <SectionHead
        title="Заметки проекта"
        note={`${notes.length} заметок`}
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
            <Button size="sm" onClick={() => setEditing("new")}>
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
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Button variant="secondary" onClick={() => { setQuery(""); setTag("Все"); }}>
              Сбросить фильтры
            </Button>
            <Button onClick={() => setEditing("new")}>Создать заметку</Button>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((n) => (
            <li key={n.id} className="flex flex-col gap-sm py-lg transition-fast hover:bg-surface-pressed sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 flex-col gap-xs">
                <button
                  type="button"
                  onClick={() => setEditing(n)}
                  className="text-left text-body font-medium text-foreground transition-fast hover:text-accent"
                >
                  {n.title}
                </button>
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
                <Button variant="secondary" size="sm" onClick={() => setEditing(n)}>
                  Изменить
                </Button>
                <KebabMenu
                  items={[{ label: "Открыть заметку" }, { label: "Связать с задачей" }, { label: "Скопировать ссылку" }]}
                  destructive={{ label: "Удалить заметку" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <NoteEditor
          note={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

function NoteEditor({
  note,
  onClose,
  onSave,
}: {
  note: ProjectNote | null;
  onClose: () => void;
  onSave: (draft: { title: string; excerpt: string; tag: string }) => void;
}) {
  const [title, setTitle] = React.useState(note?.title ?? "");
  const [excerpt, setExcerpt] = React.useState(note?.excerpt ?? "");
  const [tag, setTag] = React.useState(note?.tags[0] ?? "Без тега");

  return (
    <Modal
      open
      title={note ? "Изменить заметку" : "Создать заметку"}
      description={
        note
          ? "Изменения увидят участники проекта сразу после сохранения."
          : "Заметка появится в проекте и будет доступна участникам пространства."
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), excerpt, tag })}>
            {note ? "Сохранить заметку" : "Создать заметку"}
          </Button>
        </>
      }
    >
      <Field label="Заголовок" id="note-title">
        <Input id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="О чём заметка" />
      </Field>
      <Field label="Текст" id="note-text" hint="Решение, договорённость или контекст, который пригодится команде.">
        <Textarea id="note-text" rows={6} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </Field>
      <Field label="Тег" id="note-tag">
        <Select id="note-tag" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option>Без тега</option>
          {spaceTags.map((t) => (
            <option key={t.id}>{t.name}</option>
          ))}
        </Select>
      </Field>
    </Modal>
  );
}
