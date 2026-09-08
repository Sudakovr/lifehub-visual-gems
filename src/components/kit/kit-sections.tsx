import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Inbox,
  MessageSquare,
  MoreHorizontal,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  Field,
  Input,
  PriorityChip,
  Progress,
  Row,
  SectionTitle,
  Select,
  Skeleton,
  StatusChip,
  Tag,
  Textarea,
  Toggle,
  type Tone,
} from "./primitives";
import { kitTasks, kitTimeline, type KitTask } from "@/mock/kit";

const statusTone: Record<KitTask["status"], Tone> = {
  Новая: "neutral",
  "В работе": "info",
  Пауза: "neutral",
  "На приёмке": "warn",
  Готово: "ok",
  Отменена: "danger",
};

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-md border border-border bg-surface", className)}>{children}</div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-meta text-muted-foreground">{children}</p>;
}

export function KitSections() {
  const [checked, setChecked] = React.useState(true);
  const [notify, setNotify] = React.useState(true);
  const [tab, setTab] = React.useState("Обзор");
  const [sortAsc, setSortAsc] = React.useState(true);
  const [page, setPage] = React.useState(2);
  const [toast, setToast] = React.useState(false);

  const tasks = [...kitTasks].sort((a, b) =>
    sortAsc ? a.deadline.localeCompare(b.deadline) : b.deadline.localeCompare(a.deadline),
  );

  return (
    <div className="flex flex-col gap-2xl">
      {/* Типографика */}
      <section className="flex flex-col gap-lg">
        <SectionTitle note="Golos Text — интерфейс, JetBrains Mono — цифры">Типографика</SectionTitle>
        <div className="flex flex-col gap-md">
          <p className="text-display font-semibold">Заголовок экрана — 32/38</p>
          <p className="text-heading font-semibold">Раздел — 24/32</p>
          <p className="text-title font-medium">Название задачи — 18/26</p>
          <p className="text-body-lg">Описание и комментарии — 16/24</p>
          <p className="text-body">Базовый текст интерфейса и таблиц — 14/22</p>
          <p className="text-meta text-muted-foreground">Метаданные и подписи полей — 12/18</p>
          <p className="text-caption text-muted-foreground">Счётчики и метки — 11/16</p>
          <p className="num font-mono text-body">
            04:37:12 · 128 задач · 12 480 ₽ · 2026-09-08
          </p>
        </div>
      </section>

      {/* Кнопки */}
      <section className="flex flex-col gap-lg">
        <SectionTitle note="Главное действие — графитовое; цветовой акцент остаётся для навигации и связей">Кнопки</SectionTitle>
        <Row>
          <Button>Создать задачу</Button>
          <Button variant="secondary">Отложить</Button>
          <Button variant="ghost">Отмена</Button>
          <Button variant="link">Открыть проект</Button>
        </Row>
        <Row>
          <Button size="sm">Малая</Button>
          <Button size="md">Средняя</Button>
          <Button size="lg">Большая</Button>
          <Button size="icon" aria-label="Ещё" variant="secondary">
            <MoreHorizontal className="size-4" strokeWidth={1.75} />
          </Button>
        </Row>
        <Row>
          <Button variant="ok">Принять работу</Button>
          <Button loading>Сохраняем</Button>
          <Button disabled>Недоступно</Button>
          <Button variant="secondary" disabled>
            Недоступно
          </Button>
          <Button variant="secondary">
            <Play className="size-4" strokeWidth={1.75} />
            Запустить таймер
          </Button>
        </Row>
      </section>

      {/* Поля */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Поля ввода</SectionTitle>
        <div className="grid gap-lg sm:grid-cols-2">
          <Field label="Название задачи" id="k-title" hint="Коротко и по делу">
            <Input id="k-title" defaultValue="Согласовать смету по кухне" />
          </Field>
          <Field label="Поиск" id="k-search">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-md size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input id="k-search" className="pl-8" placeholder="Задачи, файлы, заметки" />
            </div>
          </Field>
          <Field label="Оценка, минуты" id="k-est" error="Введите число от 5 до 480">
            <Input id="k-est" className="num" defaultValue="9000" invalid />
          </Field>
          <Field label="Исполнитель" id="k-assignee">
            <Select id="k-assignee" defaultValue="Роман Ким">
              <option>Роман Ким</option>
              <option>Аня Дорош</option>
              <option>Не назначен</option>
            </Select>
          </Field>
          <Field label="Проект" id="k-project">
            <Select id="k-project" disabled>
              <option>Личное пространство</option>
            </Select>
          </Field>
          <Field label="Комментарий к возврату" id="k-comment">
            <Textarea id="k-comment" placeholder="Что доработать" />
          </Field>
        </div>
        <Row>
          <Checkbox label="Требуется приёмка" checked={checked} onChange={setChecked} />
          <Checkbox label="Часть выполнена" indeterminate />
          <Checkbox label="Оплачиваемое время" />
          <Checkbox label="Архивировать" disabled />
          <Toggle label="Уведомлять о дедлайнах" checked={notify} onChange={setNotify} />
          <Toggle label="Тихие часы" checked={false} onChange={() => {}} disabled />
        </Row>
      </section>

      {/* Чипы, теги, аватары */}
      <section className="flex flex-col gap-lg">
        <SectionTitle note="Цвет дублируется текстом и формой">Статусы, приоритеты, теги, люди</SectionTitle>
        <Row>
          <StatusChip>Новая</StatusChip>
          <StatusChip tone="info">В работе</StatusChip>
          <StatusChip>Пауза</StatusChip>
          <StatusChip tone="warn">На приёмке</StatusChip>
          <StatusChip tone="ok">Готово</StatusChip>
          <StatusChip tone="danger">Отменена</StatusChip>
        </Row>
        <Row>
          <PriorityChip level="Критический" />
          <PriorityChip level="Высокий" />
          <PriorityChip level="Обычный" />
          <PriorityChip level="Низкий" />
        </Row>
        <Row>
          <Tag color="oklch(0.62 0.14 258)">Ремонт</Tag>
          <Tag color="oklch(0.62 0.13 150)">Дом</Tag>
          <Tag color="oklch(0.68 0.13 70)">Срочно</Tag>
          <Tag color="oklch(0.6 0.15 25)">Блокер</Tag>
        </Row>
        <Row>
          <Avatar name="Роман Ким" size="sm" />
          <Avatar name="Аня Дорош" />
          <Avatar name="Павел Смирнов" size="lg" />
          <AvatarGroup names={["Роман Ким", "Аня Дорош", "Павел Смирнов", "Ольга Ли", "Иван Гросс"]} />
        </Row>
      </section>

      {/* Меню, диалог, тост, подсказка */}
      <section className="flex flex-col gap-lg">
        <SectionTitle note="«Удалить» — только последним пунктом меню">Оверлеи</SectionTitle>
        <div className="grid gap-xl lg:grid-cols-3">
          <div className="flex flex-col gap-sm">
            <Label>Меню действий</Label>
            <Panel className="w-56 p-xs shadow-e2">
              <ul className="flex flex-col text-body">
                {["Открыть задачу", "Назначить исполнителя", "Дублировать", "В архив"].map((i) => (
                  <li key={i}>
                    <button className="w-full rounded-xs px-md py-1.5 text-left transition-fast hover:bg-surface-pressed">
                      {i}
                    </button>
                  </li>
                ))}
                <li className="my-xs h-px bg-border" role="separator" />
                <li>
                  <button className="w-full rounded-xs px-md py-1.5 text-left transition-fast hover:bg-surface-pressed">
                    Удалить
                  </button>
                </li>
              </ul>
            </Panel>
          </div>

          <div className="flex flex-col gap-sm">
            <Label>Диалог подтверждения</Label>
            <Panel className="p-lg shadow-e3">
              <h3 className="text-title font-semibold">Удалить задачу «Смета по кухне»?</h3>
              <p className="mt-sm text-body text-muted-foreground">
                Вместе с задачей исчезнут 3 подзадачи, 12 комментариев и 41 минута учтённого
                времени. Восстановить не получится.
              </p>
              <div className="mt-lg flex justify-end gap-sm">
                <Button variant="ghost">Оставить</Button>
                <Button variant="secondary">Удалить задачу</Button>
              </div>
            </Panel>
          </div>

          <div className="flex flex-col gap-lg">
            <div className="flex flex-col gap-sm">
              <Label>Тост</Label>
              <Panel className="flex items-start gap-md p-md shadow-e2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ok" />
                <div className="min-w-0">
                  <p className="text-body font-medium">Работа принята</p>
                  <p className="text-meta text-muted-foreground">Задача «Смета по кухне» — Готово</p>
                </div>
                <button className="ml-auto shrink-0 text-meta text-muted-foreground hover:text-foreground">
                  Отменить
                </button>
              </Panel>
              <Button
                variant="secondary"
                size="sm"
                className="self-start"
                onClick={() => {
                  setToast(true);
                  window.setTimeout(() => setToast(false), 2500);
                }}
              >
                Показать тост
              </Button>
              {toast ? (
                <p className="text-meta text-ok-foreground">Работа принята</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-sm">
              <Label>Подсказка</Label>
              <div className="relative inline-flex w-fit pt-7">
                <span className="absolute top-0 left-0 rounded-xs bg-foreground px-sm py-1 text-caption text-canvas shadow-e2">
                  Возврат требует комментария
                </span>
                <Button variant="secondary" size="sm">
                  Вернуть в работу
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Вкладки и таблица */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Вкладки и таблица</SectionTitle>
        <div className="flex gap-lg border-b border-border">
          {["Обзор", "Задачи", "Файлы", "Время"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px border-b-2 px-2xs pb-sm text-body transition-fast",
                tab === t
                  ? "border-accent font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-table border-collapse text-body">
            <thead>
              <tr className="border-b border-border-strong text-left text-meta text-muted-foreground">
                <th className="py-sm pr-md font-medium">Задача</th>
                <th className="py-sm pr-md font-medium">Статус</th>
                <th className="py-sm pr-md font-medium">Приоритет</th>
                <th className="py-sm pr-md font-medium">Исполнитель</th>
                <th className="py-sm pr-md font-medium">
                  <button
                    className="inline-flex items-center gap-xs transition-fast hover:text-foreground"
                    onClick={() => setSortAsc((v) => !v)}
                    aria-label="Сортировать по дедлайну"
                  >
                    Дедлайн
                    <ArrowUp
                      className={cn("size-3 transition-base", !sortAsc && "rotate-180")}
                      strokeWidth={2}
                    />
                  </button>
                </th>
                <th className="py-sm text-right font-medium">Время</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-b border-border transition-fast hover:bg-surface-pressed">
                  <td className="py-sm pr-md">{t.title}</td>
                  <td className="py-sm pr-md">
                    <StatusChip tone={statusTone[t.status]}>{t.status}</StatusChip>
                  </td>
                  <td className="py-sm pr-md">
                    <PriorityChip level={t.priority} />
                  </td>
                  <td className="py-sm pr-md">
                    <span className="inline-flex items-center gap-sm">
                      <Avatar name={t.assignee} size="sm" />
                      <span className="text-muted-foreground">{t.assignee}</span>
                    </span>
                  </td>
                  <td className="num py-sm pr-md text-muted-foreground">{t.deadline}</td>
                  <td className="num py-sm text-right">{t.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-md">
          <p className="num text-meta text-muted-foreground">21–40 из 128</p>
          <div className="flex items-center gap-xs">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Предыдущая страница"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </Button>
            {[1, 2, 3, 4, 7].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "num h-9 min-w-9 rounded-sm px-sm text-body transition-fast",
                  p === page
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-muted-foreground hover:bg-surface-pressed hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Следующая страница"
              onClick={() => setPage((p) => Math.min(7, p + 1))}
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </section>

      {/* Состояния */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Состояния</SectionTitle>
        <div className="grid gap-xl lg:grid-cols-3">
          <div className="flex flex-col gap-sm">
            <Label>Пусто</Label>
            <Panel className="flex flex-col items-start gap-md p-xl">
              <Inbox className="size-5 text-muted-foreground" strokeWidth={1.75} />
              <div>
                <p className="text-title font-medium">В проекте пока нет задач</p>
                <p className="mt-2xs text-body text-muted-foreground">
                  Заведите первую — остальное вырастет вокруг неё.
                </p>
              </div>
              <Button size="sm">Создать задачу</Button>
            </Panel>
          </div>

          <div className="flex flex-col gap-sm">
            <Label>Загрузка</Label>
            <Panel className="flex flex-col gap-md p-lg">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-md">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex flex-1 flex-col gap-xs">
                    <Skeleton className="h-3 w-3/5" />
                    <Skeleton className="h-2.5 w-2/5" />
                  </div>
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </Panel>
          </div>

          <div className="flex flex-col gap-sm">
            <Label>Ошибка</Label>
            <Panel className="flex flex-col items-start gap-md p-xl">
              <AlertTriangle className="size-5 text-danger" strokeWidth={1.75} />
              <div>
                <p className="text-title font-medium">Задачи не загрузились</p>
                <p className="mt-2xs text-body text-muted-foreground">
                  Сервер не ответил за 10 секунд. Проверьте связь и повторите.
                </p>
              </div>
              <Button size="sm" variant="secondary">
                <RotateCcw className="size-4" strokeWidth={1.75} />
                Повторить
              </Button>
            </Panel>
          </div>
        </div>

        <div className="grid gap-xl sm:grid-cols-2">
          <Progress value={64} label="Чек-лист: 7 из 11" />
          <Progress value={28} label="Оценка выбрана: 84 из 300 мин" />
        </div>
      </section>

      {/* Полоса времени */}
      <section className="flex flex-col gap-lg">
        <SectionTitle note="Записи учёта времени за 8 сентября">Полоса времени</SectionTitle>
        <div className="flex flex-col gap-sm">
          <div className="relative h-9 w-full overflow-hidden rounded-sm bg-surface-sunken">
            {kitTimeline.map((e) => (
              <div
                key={e.id}
                title={`${e.title} — ${e.from}–${e.to}`}
                className={cn(
                  "absolute top-0 flex h-full items-center overflow-hidden rounded-xs px-sm text-caption font-medium whitespace-nowrap",
                  e.billable ? "bg-accent-soft text-accent" : "bg-surface-pressed text-muted-foreground",
                )}
                style={{ left: `${e.start}%`, width: `${e.width}%` }}
              >
                {e.title}
              </div>
            ))}
          </div>
          <div className="num flex justify-between text-caption text-muted-foreground">
            {["09:00", "12:00", "15:00", "18:00", "21:00"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {kitTimeline.map((e) => (
              <li key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-md py-sm">
                <div className="flex min-w-0 items-center gap-sm">
                  <MessageSquare className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <span className="truncate text-body">{e.title}</span>
                  {e.billable ? <StatusChip tone="accent">Оплачиваемое</StatusChip> : null}
                </div>
                <span className="num shrink-0 text-meta text-muted-foreground">
                  {e.from}–{e.to} · {e.duration}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
