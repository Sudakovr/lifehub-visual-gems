import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AtSign,
  Check,
  ChevronRight,
  CornerDownLeft,
  MessageSquare,
  MoreHorizontal,
  Moon,
  Paperclip,
  Play,
  Sparkles,
  Square,
  Sun,
} from "lucide-react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  PriorityChip,
  Progress,
  StatusChip,
  Tag,
  Textarea,
  type Tone,
} from "@/components/kit/primitives";
import { TaskDialog, type TaskDialogKind } from "@/components/task/task-dialogs";
import { taskDetail, taskHints, type FeedItem } from "@/mock/task";
import type { TaskStatus } from "@/mock/kit";


const statusTone: Record<TaskStatus, Tone> = {
  Новая: "neutral",
  "В работе": "info",
  Пауза: "neutral",
  "На приёмке": "warn",
  Готово: "ok",
  Отменена: "danger",
};

const eventTone: Record<string, string> = {
  neutral: "bg-border-strong",
  info: "bg-info",
  ok: "bg-ok",
  warn: "bg-warn",
  danger: "bg-danger",
};

function hm(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

function BlockTitle({
  children,
  note,
  action,
}: {
  children: React.ReactNode;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-md border-b border-border pb-sm">
      <div className="flex items-baseline gap-sm">
        <h2 className="text-body font-semibold text-foreground">{children}</h2>
        {note ? <span className="num text-meta text-muted-foreground">{note}</span> : null}
      </div>
      {action}
    </div>
  );
}

/* ---------- Меню «…»: «Удалить» последним пунктом за разделителем ---------- */

function ActionsMenu({ canDelete }: { canDelete: boolean }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = ["Скопировать ссылку", "Дублировать задачу", "Перенести в проект", "Отписаться от задачи"];

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="secondary"
        size="icon"
        aria-label="Действия с задачей"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="size-4" strokeWidth={1.75} />
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-xs w-56 rounded-md border border-border bg-surface py-xs shadow-e2">
          {items.map((i) => (
            <button
              key={i}
              className="block w-full px-md py-sm text-left text-body text-foreground transition-fast hover:bg-surface-pressed"
              onClick={() => setOpen(false)}
            >
              {i}
            </button>
          ))}
          {canDelete ? (
            <>
              <div className="my-xs h-px bg-border" />
              <button
                className="block w-full px-md py-sm text-left text-body text-danger-foreground transition-fast hover:bg-danger-soft"
                onClick={() => setOpen(false)}
              >
                Удалить
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Лента: комментарии и события одним потоком ---------- */

function FeedRow({ item }: { item: FeedItem }) {
  if (item.kind === "event") {
    return (
      <li className="flex gap-md py-md pl-md">
        <span className="mt-2 flex w-6 shrink-0 justify-center">
          <span className={cn("size-1.5 rounded-full", eventTone[item.tone])} />
        </span>
        <p className="text-meta text-muted-foreground">
          <span className="text-foreground">{item.actor}</span> {item.text}
          <span className="num"> · {item.date}, {item.time}</span>
        </p>
      </li>
    );
  }
  return (
    <li className="flex gap-md py-lg pl-md">
      <Avatar name={item.author} size="sm" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-sm">
          <span className="text-body font-medium text-foreground">{item.author}</span>
          <span className="num text-meta text-muted-foreground">
            {item.date}, {item.time}
          </span>
        </p>
        <p className="mt-xs text-body-lg text-foreground">{item.text}</p>
      </div>
    </li>
  );
}

export function TaskScreen() {
  const t = taskDetail;
  const [dark, setDark] = React.useState(false);
  const [feedOpen, setFeedOpen] = React.useState(true);
  const [onlyTalk, setOnlyTalk] = React.useState(false);
  const [timer, setTimer] = React.useState(false);
  const [checks, setChecks] = React.useState(() => t.checklist.map((c) => c.done));
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const canEdit = t.viewerRole !== "viewer";
  const isAssignee = t.viewerId === t.assignee.id;
  const isAuthor = t.viewerId === t.author.id;
  const showAcceptance = t.needsAcceptance && t.author.id !== t.assignee.id;

  const doneChecks = checks.filter(Boolean).length;
  const doneAcceptance = t.acceptance.filter((a) => a.done).length;
  const comments = t.feed.filter((f) => f.kind === "comment");
  const feed = onlyTalk ? comments : t.feed;
  const spentPct = Math.min(100, Math.round((t.spentMin / t.estimateMin) * 100));

  return (
    <div className="min-h-screen bg-canvas">
      {/* Шапка */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-md px-lg py-md">
          <nav aria-label="Хлебные крошки" className="flex min-w-0 items-center gap-xs text-meta text-muted-foreground">
            <span>{t.space}</span>
            <ChevronRight className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{t.project}</span>
            <ChevronRight className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="num text-foreground">{t.code}</span>
          </nav>
          <div className="ml-auto flex items-center gap-sm">
            <Button
              variant="ghost"
              size="icon"
              aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
              onClick={() => setDark((v) => !v)}
            >
              {dark ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
            </Button>
            {canEdit && isAssignee ? <Button variant="primary">Отправить на приёмку</Button> : null}
            {canEdit && isAuthor ? <Button variant="primary">Принять работу</Button> : null}
            <ActionsMenu canDelete={t.viewerRole === "owner"} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-lg pt-xl pb-3xl">
        {/* Заголовок задачи */}
        <div className="flex flex-col gap-md border-b border-border pb-lg">
          <h1 className="text-heading font-semibold text-foreground">{t.title}</h1>
          <div className="flex flex-wrap items-center gap-sm">
            <StatusChip tone={statusTone[t.status]}>{t.status}</StatusChip>
            <PriorityChip level={t.priority} />
            <span className="num text-meta text-muted-foreground">Срок {t.deadline}</span>
            <span className="text-meta text-muted-foreground">Поставила {t.author.name}</span>
          </div>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-x-2xl gap-y-xl pt-xl",
            feedOpen
              ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem]"
              : "xl:grid-cols-[minmax(0,1fr)_3rem_18rem]",
          )}
        >
          {/* Колонка 1 — содержание */}
          <section className="flex min-w-0 flex-col gap-2xl">
            <div className="flex flex-col gap-md">
              <BlockTitle>Описание</BlockTitle>
              <p className="max-w-prose text-body-lg text-foreground">{t.description}</p>
            </div>

            <div className="flex flex-col gap-md">
              <BlockTitle note="3 подсказки">Помощь ИИ</BlockTitle>
              <ul className="flex flex-col divide-y divide-border">
                {taskHints.map((h) => (
                  <li key={h.id} className="flex gap-md py-md">
                    <span
                      className={cn(
                        "mt-1.5 size-1.5 shrink-0 rounded-full",
                        h.important ? "bg-warn" : "bg-border-strong",
                      )}
                    />
                    <p className="text-body text-foreground">
                      {h.important ? (
                        <span className="mr-sm text-meta font-medium text-warn-foreground">Важно</span>
                      ) : null}
                      {h.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {showAcceptance ? (
              <div className="flex flex-col gap-md">
                <BlockTitle note={`${doneAcceptance} из ${t.acceptance.length}`}>
                  Условия приёмки
                </BlockTitle>
                <ul className="flex flex-col divide-y divide-border">
                  {t.acceptance.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-md py-sm">
                      <span className="flex items-center gap-sm text-body">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-xs border",
                            a.done ? "border-ok bg-ok-soft text-ok-foreground" : "border-border-strong",
                          )}
                        >
                          {a.done ? <Check className="size-3" strokeWidth={2.5} /> : null}
                        </span>
                        <span className={cn(a.done && "text-muted-foreground line-through")}>{a.text}</span>
                      </span>
                      <span className="num shrink-0 text-meta text-muted-foreground">{a.due}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-meta text-muted-foreground">
                  Готовой задачу отмечает постановщик — {t.author.name}. Вернуть в работу можно только с
                  комментарием.
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-md">
              <BlockTitle note={`${doneChecks} из ${t.checklist.length}`}>Чек-лист</BlockTitle>
              <Progress value={Math.round((doneChecks / t.checklist.length) * 100)} />
              <ul className="flex flex-col divide-y divide-border">
                {t.checklist.map((c, i) => (
                  <li key={c.id} className="flex items-center justify-between gap-md py-sm">
                    <Checkbox
                      label={c.text}
                      checked={checks[i] ?? false}
                      disabled={!canEdit}
                      onChange={(v) =>
                        setChecks((prev) => prev.map((p, idx) => (idx === i ? v : p)))
                      }
                    />
                    <span className="num shrink-0 text-meta text-muted-foreground">{c.due}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-md">
              <BlockTitle note={`${t.subtasks.length} шт.`}>Подзадачи</BlockTitle>
              <ul className="flex flex-col divide-y divide-border">
                {t.subtasks.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center gap-md py-sm transition-fast hover:bg-surface-pressed"
                  >
                    <span className="num w-20 shrink-0 font-mono text-meta text-muted-foreground">
                      {s.code}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-body text-foreground">{s.title}</span>
                    <StatusChip tone={statusTone[s.status]}>{s.status}</StatusChip>
                    <Avatar name={s.assignee} size="sm" />
                    <span className="num w-24 shrink-0 text-right text-meta text-muted-foreground">
                      {Math.round(s.spentMin / 60)} ч из {Math.round(s.estimateMin / 60)} ч
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Колонка 2 — лента */}
          {feedOpen ? (
            <section className="flex min-w-0 flex-col gap-md xl:border-x xl:border-border xl:px-xl">
              <BlockTitle
                note={`${comments.length} сообщения`}
                action={
                  <button
                    className="text-meta text-muted-foreground transition-fast hover:text-foreground"
                    onClick={() => setFeedOpen(false)}
                  >
                    Свернуть ленту
                  </button>
                }
              >
                Лента задачи
              </BlockTitle>

              <label className="inline-flex w-fit cursor-pointer items-center gap-sm rounded-xs border border-border px-sm py-xs text-meta text-muted-foreground transition-fast hover:border-border-strong">
                <input
                  type="checkbox"
                  className="size-3.5 accent-accent"
                  checked={onlyTalk}
                  onChange={(e) => setOnlyTalk(e.target.checked)}
                />
                Только обсуждение
              </label>

              <ul className="flex flex-col divide-y divide-border">
                {feed.map((item) => (
                  <FeedRow key={item.id} item={item} />
                ))}
              </ul>

              {canEdit ? (
                <div className="flex flex-col gap-sm border-t border-border pt-md">
                  <Textarea
                    placeholder="Написать в ленту. Упомяните участника через @"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex items-center gap-sm">
                    <Button variant="ghost" size="icon" aria-label="Упомянуть участника">
                      <AtSign className="size-4" strokeWidth={1.75} />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Приложить файл">
                      <Paperclip className="size-4" strokeWidth={1.75} />
                    </Button>
                    <Button className="ml-auto" variant="secondary" disabled={!comment.trim()}>
                      <CornerDownLeft className="size-4" strokeWidth={1.75} />
                      Отправить
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-meta text-muted-foreground">
                  У вас доступ на чтение — писать в ленту нельзя.
                </p>
              )}
            </section>
          ) : (
            <aside className="xl:border-x xl:border-border">
              <button
                onClick={() => setFeedOpen(true)}
                title="Развернуть ленту задачи"
                className="flex w-full items-center gap-md px-md py-sm text-meta text-muted-foreground transition-fast hover:text-foreground xl:h-full xl:w-12 xl:flex-col xl:justify-start xl:gap-lg xl:py-lg"
              >
                <MessageSquare className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="num rounded-full bg-accent-soft px-sm text-caption text-accent">4</span>
                <span className="xl:[writing-mode:vertical-rl]">Развернуть ленту</span>
              </button>
            </aside>
          )}

          {/* Колонка 3 — свойства */}
          <aside className="flex flex-col gap-2xl">
            <div className="flex flex-col gap-md">
              <BlockTitle>Свойства</BlockTitle>
              <dl className="flex flex-col divide-y divide-border">
                {[
                  ["Статус", <StatusChip key="s" tone={statusTone[t.status]}>{t.status}</StatusChip>],
                  ["Приоритет", <PriorityChip key="p" level={t.priority} />],
                  ["Исполнитель", <span key="a" className="flex items-center gap-sm text-body"><Avatar name={t.assignee.name} size="sm" />{t.assignee.name}</span>],
                  ["Постановщик", <span key="au" className="flex items-center gap-sm text-body"><Avatar name={t.author.name} size="sm" />{t.author.name}</span>],
                  ["Начало", <span key="st" className="num text-body">{t.startDate}</span>],
                  ["Дедлайн", <span key="d" className="num text-body">{t.deadline}</span>],
                  ["Оценка", <span key="e" className="num text-body">{hm(t.estimateMin)}</span>],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-center justify-between gap-md py-sm">
                    <dt className="text-meta text-muted-foreground">{label}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-md">
              <BlockTitle>Время</BlockTitle>
              <div className="flex items-baseline justify-between">
                <span className="text-meta text-muted-foreground">Затрачено</span>
                <span className="num font-mono text-title text-foreground">{hm(t.spentMin)}</span>
              </div>
              <Progress value={spentPct} label={`Из оценки ${hm(t.estimateMin)}`} />
              {canEdit ? (
                <Button variant={timer ? "secondary" : "primary"} onClick={() => setTimer((v) => !v)}>
                  {timer ? (
                    <>
                      <Square className="size-4" strokeWidth={1.75} />
                      Остановить таймер
                    </>
                  ) : (
                    <>
                      <Play className="size-4" strokeWidth={1.75} />
                      Начать таймер
                    </>
                  )}
                </Button>
              ) : null}
            </div>

            <div className="flex flex-col gap-md">
              <BlockTitle>Теги</BlockTitle>
              <div className="flex flex-wrap gap-sm">
                {t.tags.map((tag) => (
                  <Tag key={tag.id} color={tag.color}>
                    {tag.name}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-md">
              <BlockTitle note={`${t.watchers.length} человек`}>Наблюдатели</BlockTitle>
              <div className="flex items-center justify-between gap-md">
                <AvatarGroup names={t.watchers.map((w) => w.name)} max={4} />
                {canEdit ? (
                  <button
                    className="text-meta text-accent transition-fast hover:text-accent-hover"
                    onClick={() => setDialog("watchers")}
                  >
                    Добавить
                  </button>
                ) : null}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {dialog ? <TaskDialog kind={dialog} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

