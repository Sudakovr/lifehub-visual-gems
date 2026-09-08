import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  Avatar,
  Button,
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/kit/primitives";
import {
  aiSubtaskSuggestions,
  spaceMembers,
  spaceProjects,
  taskDetail,
} from "@/mock/task";

/* ------------------------------------------------------------------
   Диалоги экрана задачи. Один каркас, разное наполнение.
------------------------------------------------------------------ */

export type TaskDialogKind =
  | "return"
  | "move"
  | "delete"
  | "decompose"
  | "assignee"
  | "watchers";

function Dialog({
  title,
  description,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  wide?: boolean;
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 p-lg backdrop-blur-[2px] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "flex max-h-[85vh] w-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-e3",
          wide ? "max-w-2xl" : "max-w-lg",
        )}
      >
        <div className="flex items-start gap-md border-b border-border px-xl py-lg">
          <div className="min-w-0 flex-1">
            <h2 className="text-title font-semibold text-foreground">{title}</h2>
            {description ? (
              <p className="mt-xs text-meta text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" size="icon" aria-label="Закрыть диалог" onClick={onClose}>
            <X className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
        <div className="flex flex-col gap-lg overflow-y-auto px-xl py-lg">{children}</div>
        <div className="flex flex-wrap items-center justify-end gap-sm border-t border-border px-xl py-lg">
          {footer}
        </div>
      </div>
    </div>
  );
}

function ReturnDialog({ onClose }: { onClose: () => void }) {
  const [text, setText] = React.useState("");
  const ready = text.trim().length >= 10;
  return (
    <Dialog
      title="Вернуть в работу"
      description={`Задача ${taskDetail.code} вернётся исполнителю — ${taskDetail.assignee.name}. Комментарий обязателен.`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button variant="primary" disabled={!ready} onClick={onClose}>
            Вернуть в работу
          </Button>
        </>
      }
    >
      <Field
        label="Что доработать"
        hint={
          ready
            ? "Комментарий появится в ленте задачи"
            : "Не меньше 10 символов — исполнителю нужно понять, что исправить"
        }
        id="return-comment"
      >
        <Textarea
          id="return-comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Например: сверка не проходит на батчах больше 500 записей, нужен повтор запроса"
        />
      </Field>
    </Dialog>
  );
}

function MoveDialog({ onClose }: { onClose: () => void }) {
  const [project, setProject] = React.useState("p-2");
  const [withSubtasks, setWithSubtasks] = React.useState(true);
  return (
    <Dialog
      title="Перенести в другой проект"
      description="Комментарии, файлы и время останутся с задачей."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={onClose}>
            Перенести задачу
          </Button>
        </>
      }
    >
      <Field label="Проект" id="move-project" hint="Пространство «Работа»">
        <Select id="move-project" value={project} onChange={(e) => setProject(e.target.value)}>
          {spaceProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>
      <Checkbox
        label={`Перенести и подзадачи (${taskDetail.subtasks.length})`}
        checked={withSubtasks}
        onChange={setWithSubtasks}
      />
    </Dialog>
  );
}

function DeleteDialog({ onClose }: { onClose: () => void }) {
  const [confirm, setConfirm] = React.useState("");
  const ready = confirm.trim().toUpperCase() === taskDetail.code;
  return (
    <Dialog
      title={`Удалить задачу ${taskDetail.code}`}
      description="Задача, её подзадачи, комментарии, файлы и записи времени исчезнут навсегда. Восстановить их нельзя."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button
            variant="primary"
            className="bg-danger text-accent-foreground hover:bg-danger-foreground"
            disabled={!ready}
            onClick={onClose}
          >
            Удалить задачу
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-sm rounded-md border border-danger/30 bg-danger-soft px-lg py-md">
        <p className="text-body text-danger-foreground">«{taskDetail.title}»</p>
        <p className="num text-meta text-danger-foreground">
          {taskDetail.subtasks.length} подзадачи · 4 комментария · 5 ч 20 мин учтённого времени
        </p>
      </div>
      <Field label={`Введите ${taskDetail.code}, чтобы подтвердить`} id="delete-confirm">
        <Input
          id="delete-confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={taskDetail.code}
        />
      </Field>
    </Dialog>
  );
}

function DecomposeDialog({ onClose }: { onClose: () => void }) {
  const [picked, setPicked] = React.useState<string[]>(["ai-1", "ai-2"]);
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <Dialog
      title="Разобрать задачу на подзадачи"
      description="ИИ прочитал описание, чек-лист и ленту. Отметьте, что создать."
      onClose={onClose}
      wide
      footer={
        <>
          <span className="num mr-auto text-meta text-muted-foreground">
            Выбрано {picked.length} из {aiSubtaskSuggestions.length}
          </span>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button variant="primary" disabled={picked.length === 0} onClick={onClose}>
            Создать подзадачи
          </Button>
        </>
      }
    >
      <ul className="flex flex-col divide-y divide-border">
        {aiSubtaskSuggestions.map((s) => (
          <li key={s.id} className="flex items-start gap-md py-md">
            <span className="pt-0.5">
              <Checkbox
                label=""
                checked={picked.includes(s.id)}
                onChange={() => toggle(s.id)}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body text-foreground">{s.title}</p>
              <p className="mt-2xs text-meta text-muted-foreground">{s.reason}</p>
            </div>
            <span className="num shrink-0 text-meta text-muted-foreground">
              {Math.round(s.estimateMin / 60)} ч
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

function AssigneeDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = React.useState("");
  const [id, setId] = React.useState(taskDetail.assignee.id);
  const list = spaceMembers.filter(
    (m) => m.role !== "viewer" && m.name.toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <Dialog
      title="Сменить исполнителя"
      description="Наблюдатели получат событие в ленте задачи."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button
            variant="primary"
            disabled={id === taskDetail.assignee.id}
            onClick={onClose}
          >
            Назначить исполнителя
          </Button>
        </>
      }
    >
      <Input
        aria-label="Поиск участника"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Найти участника"
      />
      <ul className="flex flex-col divide-y divide-border">
        {list.map((m) => (
          <li key={m.id}>
            <label className="flex cursor-pointer items-center gap-md py-sm transition-fast hover:bg-surface-pressed">
              <input
                type="radio"
                name="assignee"
                className="size-4 accent-accent"
                checked={id === m.id}
                onChange={() => setId(m.id)}
              />
              <Avatar name={m.name} size="sm" />
              <span className="min-w-0 flex-1 truncate text-body text-foreground">{m.name}</span>
              {m.id === taskDetail.assignee.id ? (
                <span className="text-meta text-muted-foreground">Сейчас исполнитель</span>
              ) : null}
            </label>
          </li>
        ))}
        {list.length === 0 ? (
          <li className="py-lg text-meta text-muted-foreground">
            Никого не нашли. Проверьте написание имени.
          </li>
        ) : null}
      </ul>
    </Dialog>
  );
}

function WatchersDialog({ onClose }: { onClose: () => void }) {
  const [picked, setPicked] = React.useState<string[]>(taskDetail.watchers.map((w) => w.id));
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <Dialog
      title="Наблюдатели задачи"
      description="Наблюдатели видят задачу и получают уведомления о ленте и сроках."
      onClose={onClose}
      footer={
        <>
          <span className="num mr-auto text-meta text-muted-foreground">
            Отмечено {picked.length}
          </span>
          <Button variant="secondary" onClick={onClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={onClose}>
            Сохранить наблюдателей
          </Button>
        </>
      }
    >
      <ul className="flex flex-col divide-y divide-border">
        {spaceMembers.map((m) => (
          <li key={m.id} className="flex items-center gap-md py-sm">
            <Checkbox label="" checked={picked.includes(m.id)} onChange={() => toggle(m.id)} />
            <Avatar name={m.name} size="sm" />
            <span className="min-w-0 flex-1 truncate text-body text-foreground">{m.name}</span>
            <span className="text-meta text-muted-foreground">
              {m.role === "owner" ? "Владелец" : m.role === "viewer" ? "Только чтение" : "Участник"}
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

export function TaskDialog({
  kind,
  onClose,
}: {
  kind: TaskDialogKind;
  onClose: () => void;
}) {
  if (kind === "return") return <ReturnDialog onClose={onClose} />;
  if (kind === "move") return <MoveDialog onClose={onClose} />;
  if (kind === "delete") return <DeleteDialog onClose={onClose} />;
  if (kind === "decompose") return <DecomposeDialog onClose={onClose} />;
  if (kind === "assignee") return <AssigneeDialog onClose={onClose} />;
  return <WatchersDialog onClose={onClose} />;
}
