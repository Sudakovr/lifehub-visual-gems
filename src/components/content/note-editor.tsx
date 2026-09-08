import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Bold, Code2, Italic, Link2, List, Paperclip, Type } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { Button, Input, Tag } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Modal } from "@/components/app/modal";
import { getNote, noteTagColors } from "@/mock/content";
import { cn } from "@/lib/utils";

/*
  Редактор заметки: текст во всю ширину без панели инструментов сверху.
  Форматирование появляется по выделению. Автосохранение пишет время, а не крутит колесо.
*/

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}>;

type Format = { label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; wrap: [string, string] };

const formats: Format[] = [
  { label: "Полужирный", icon: Bold, wrap: ["**", "**"] },
  { label: "Курсив", icon: Italic, wrap: ["_", "_"] },
  { label: "Код", icon: Code2, wrap: ["`", "`"] },
  { label: "Ссылка", icon: Link2, wrap: ["[", "](https://)"] },
  { label: "Заголовок", icon: Type, wrap: ["## ", ""] },
  { label: "Пункт списка", icon: List, wrap: ["- ", ""] },
];

function nowTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function NoteEditor({ id }: { id: string }) {
  const note = getNote(id);
  const [title, setTitle] = React.useState(note.title);
  const [body, setBody] = React.useState(note.body);
  const [saved, setSaved] = React.useState(note.changedAt);
  const [saving, setSaving] = React.useState(false);
  const [selection, setSelection] = React.useState<{ start: number; end: number } | null>(null);
  const [attachOpen, setAttachOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaving(true);
    const t = window.setTimeout(() => {
      setSaving(false);
      setSaved(nowTime());
    }, 900);
    return () => window.clearTimeout(t);
  }, [title, body]);

  function readSelection() {
    const el = areaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    setSelection(end > start ? { start, end } : null);
  }

  function apply(f: Format) {
    const el = areaRef.current;
    if (!el || !selection) return;
    const { start, end } = selection;
    const next = body.slice(0, start) + f.wrap[0] + body.slice(start, end) + f.wrap[1] + body.slice(end);
    setBody(next);
    setSelection(null);
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + f.wrap[0].length, end + f.wrap[0].length);
    });
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-lg lg:flex-row lg:gap-2xl">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-md">
            <p className="flex items-center gap-xs text-meta text-muted-foreground">
              <Nav to="/notes" className="transition-fast hover:text-foreground">
                Заметки
              </Nav>
              <span>/</span>
              <span className="text-foreground">{title || "Без названия"}</span>
            </p>
            <div className="flex items-center gap-sm">
              <span className="text-meta text-muted-foreground" aria-live="polite">
                {saving ? "Сохраняем изменения" : `Сохранено ${saved}`}
              </span>
              <KebabMenu
                items={[
                  { label: "Перенести в другой проект" },
                  { label: "Отвязать от задачи" },
                  { label: "Скопировать ссылку" },
                ]}
                destructive={{ label: "Удалить заметку", onSelect: () => setDeleteOpen(true) }}
              />
            </div>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Название заметки"
            placeholder="Название заметки"
            className="mt-lg w-full border-0 bg-transparent text-heading font-semibold text-foreground outline-none placeholder:text-disabled-foreground focus-visible:ring-0"
          />

          <div className="relative mt-md">
            {selection ? (
              <div className="sticky top-16 z-20 mb-sm flex w-fit items-center gap-2xs rounded-md border border-border bg-surface p-2xs shadow-e2">
                {formats.map((f) => (
                  <Button
                    key={f.label}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={f.label}
                    title={f.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => apply(f)}
                  >
                    <f.icon className="size-4" strokeWidth={1.75} />
                  </Button>
                ))}
                <span className="px-sm text-caption text-muted-foreground">Форматирование по выделению</span>
              </div>
            ) : null}

            <textarea
              ref={areaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onSelect={readSelection}
              onKeyUp={readSelection}
              onMouseUp={readSelection}
              onBlur={() => window.setTimeout(() => setSelection(null), 150)}
              aria-label="Текст заметки"
              className={cn(
                "min-h-[28rem] w-full resize-none border-0 bg-transparent text-body-lg text-foreground outline-none",
                "placeholder:text-disabled-foreground",
              )}
              placeholder="Пишите как есть. Выделите текст — появится форматирование."
            />
          </div>
        </div>

        <aside className="w-full shrink-0 border-t border-border pt-lg lg:w-form lg:border-l lg:border-t-0 lg:pl-2xl lg:pt-0">
          <h2 className="text-meta text-muted-foreground">Связи</h2>
          <ul className="mt-sm flex flex-col divide-y divide-border border-y border-border">
            <li className="flex items-center justify-between gap-md py-sm">
              <span className="text-meta text-muted-foreground">Проект</span>
              {note.relation.projectId ? (
                <Nav
                  to="/projects/$id"
                  params={{ id: note.relation.projectId }}
                  className="text-body text-foreground transition-fast hover:text-accent"
                >
                  {note.relation.project}
                </Nav>
              ) : (
                <Button variant="ghost" size="sm">
                  Связать с проектом
                </Button>
              )}
            </li>
            <li className="flex items-center justify-between gap-md py-sm">
              <span className="text-meta text-muted-foreground">Задача</span>
              {note.relation.taskId ? (
                <Nav
                  to="/tasks/$id"
                  params={{ id: note.relation.taskId }}
                  className="min-w-0 truncate text-body text-foreground transition-fast hover:text-accent"
                >
                  {note.relation.task}
                </Nav>
              ) : (
                <Button variant="ghost" size="sm">
                  Связать с задачей
                </Button>
              )}
            </li>
          </ul>

          <h2 className="mt-xl text-meta text-muted-foreground">Теги</h2>
          <div className="mt-sm flex flex-wrap items-center gap-xs">
            {note.tags.map((t) => (
              <Tag key={t} color={noteTagColors[t] ?? "var(--info)"}>
                {t}
              </Tag>
            ))}
            <Button variant="ghost" size="sm">
              Добавить тег
            </Button>
          </div>

          <h2 className="mt-xl text-meta text-muted-foreground">Вложения</h2>
          {note.attachments.length ? (
            <ul className="mt-sm flex flex-col divide-y divide-border border-y border-border">
              {note.attachments.map((a) => (
                <li key={a.id} className="flex items-center gap-sm py-sm">
                  <Paperclip className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1 truncate text-body text-foreground">{a.name}</span>
                  <span className="num text-meta text-muted-foreground">{a.size}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-sm text-meta text-muted-foreground">Вложений пока нет.</p>
          )}
          <Button variant="secondary" size="sm" className="mt-md" onClick={() => setAttachOpen(true)}>
            Прикрепить файл
          </Button>

          <p className="mt-xl text-meta text-muted-foreground">
            Автор: {note.author}. Изменена {note.changed}.
          </p>
        </aside>
      </div>

      <Modal
        open={attachOpen}
        title="Прикрепить файл"
        description="Файл попадёт в заметку и в файлы проекта."
        onClose={() => setAttachOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAttachOpen(false)}>
              Отменить
            </Button>
            <Button onClick={() => setAttachOpen(false)}>Прикрепить</Button>
          </>
        }
      >
        <div className="rounded-md border border-dashed border-border-strong bg-surface-sunken px-xl py-2xl text-center">
          <p className="text-body text-foreground">Перетащите файл сюда</p>
          <p className="mt-2xs text-meta text-muted-foreground">или выберите на диске, до 50 МБ</p>
        </div>
        <Input aria-label="Название вложения" placeholder="Название файла" />
      </Modal>

      <Modal
        open={deleteOpen}
        title={`Удалить заметку «${title}»?`}
        description="Заметка исчезнет у всех участников пространства вместе с вложениями. Восстановить её нельзя."
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Оставить
            </Button>
            <Button onClick={() => setDeleteOpen(false)}>Удалить заметку</Button>
          </>
        }
      />
    </AppShell>
  );
}
