import type * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeHub — визуальные эталоны продукта" },
      {
        name: "description",
        content:
          "Навигация по эталонным экранам LifeHub: набор примитивов, проекты, задачи, канбан, файлы, заметки, время и настройки.",
      },
      { property: "og:title", content: "LifeHub — визуальные эталоны продукта" },
      {
        property: "og:description",
        content: "Все эталонные экраны LifeHub в одном месте: дизайн-система, проекты и рабочий экран задачи.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const NavLink = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string> | undefined;
  className?: string;
  children?: React.ReactNode;
}>;

type Item = { to: string; params?: Record<string, string>; title: string; note: string };

const groups: { title: string; note: string; items: Item[] }[] = [
  {
    title: "Основа",
    note: "Токены, типографика и примитивы, из которых собраны экраны.",
    items: [{ to: "/kit", title: "Набор примитивов", note: "Кнопки, поля, чипы, таблица, состояния — в двух темах." }],
  },
  {
    title: "Оболочка и вход",
    note: "Каркас всех экранов, вход в продукт и первый день нового аккаунта.",
    items: [
      { to: "/today", title: "Оболочка приложения", note: "Навигация развёрнута и свёрнута, нижние вкладки на телефоне, Cmd+K." },
      { to: "/auth/login", title: "Вход", note: "Ошибка пары почта-пароль показана прямо в форме." },
      { to: "/auth/register", title: "Регистрация", note: "Личное пространство создаётся сразу." },
      { to: "/auth/reset", title: "Восстановление пароля", note: "Состояние «письмо отправлено» и повтор." },
      { to: "/auth/invite", title: "Приглашение по ссылке", note: "Кто пригласил, куда и с какой ролью; истёкшая ссылка." },
      { to: "/welcome", title: "Онбординг пустого аккаунта", note: "Три шага, каждый можно пропустить." },
    ],
  },
  {
    title: "Разделы пространства",
    note: "Заметки, файлы, поиск и время всего пространства «Работа».",
    items: [
      { to: "/notes", title: "Заметки", note: "Решения и договорённости со связями." },
      { to: "/notes/$id", params: { id: "n-1" }, title: "Заметка", note: "Редактор во всю ширину, автосохранение, вложения." },
      { to: "/review", title: "Недельный обзор", note: "Что сделано, что стоит, куда ушло время." },
      { to: "/files", title: "Файлы", note: "Привязка к задаче и статус извлечения текста." },
      { to: "/search", title: "Поиск", note: "Задачи, проекты, заметки и содержимое файлов." },
      { to: "/time", title: "Время", note: "Суммы по задачам и людям, оплачиваемое отдельно." },
    ],
  },
  {
    title: "Ежедневная работа",
    note: "То, с чего начинается день. Быстрый ввод задачи — клавиша N с любого экрана.",
    items: [
      { to: "/today", title: "Сегодня", note: "План дня от ИИ, просрочено, сегодня и входящие." },
      { to: "/inbox", title: "Входящие", note: "Задачи без проекта, перенос по одной и массово." },
      { to: "/my", title: "Мои задачи", note: "Группировка, фильтры, сохранённые наборы, две плотности." },
    ],
  },
  {
    title: "Проекты",
    note: "Пространство «Работа»: список и все вкладки проекта.",
    items: [
      { to: "/projects", title: "Список проектов", note: "Плотная таблица и крупные строки, фильтры, архив." },
      { to: "/projects/$id", params: { id: "p-1" }, title: "Обзор проекта", note: "Сводка от ИИ, сроки, риск срыва, время." },
      { to: "/projects/$id/tasks", params: { id: "p-1" }, title: "Задачи проекта", note: "Таблица с деревом подзадач и панелью просмотра." },
      { to: "/projects/$id/board", params: { id: "p-1" }, title: "Канбан", note: "Колонки по статусам, перетаскивание, панель просмотра." },
      { to: "/projects/$id/files", params: { id: "p-1" }, title: "Файлы", note: "Загрузка перетаскиванием и статус извлечения текста." },
      { to: "/projects/$id/notes", params: { id: "p-1" }, title: "Заметки", note: "Решения и договорённости рядом с задачами." },
      { to: "/projects/$id/time", params: { id: "p-1" }, title: "Время", note: "Отчёт за период по задачам и по людям." },
      { to: "/projects/$id/settings", params: { id: "p-1" }, title: "Настройки", note: "Участники, теги, даты и архивирование." },
    ],
  },
  {
    title: "Задача",
    note: "Рабочее место, где идёт основная работа.",
    items: [
      { to: "/tasks/$id", params: { id: "2481" }, title: "Экран задачи", note: "Содержание, единая лента и свойства в трёх колонках." },
    ],
  },
];

function Home() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-app px-lg py-4xl">
        <p className="text-meta text-muted-foreground">LifeHub</p>
        <h1 className="mt-xs text-display font-semibold text-foreground">Визуальные эталоны</h1>
        <p className="mt-sm max-w-prose text-body-lg text-muted-foreground">
          Собрана основа дизайн-системы и эталонные экраны продукта. Открывайте любой раздел —
          каждый экран работает в светлой и тёмной темах и от 360 px.
        </p>

        <div className="mt-3xl flex flex-col gap-2xl">
          {groups.map((g) => (
            <section key={g.title} className="flex flex-col gap-md">
              <div className="border-b border-border pb-sm">
                <h2 className="text-title font-semibold text-foreground">{g.title}</h2>
                <p className="text-meta text-muted-foreground">{g.note}</p>
              </div>
              <ul className="grid gap-x-xl gap-y-0 sm:grid-cols-2 xl:grid-cols-3">
                {g.items.map((i) => (
                  <li key={i.title} className="border-b border-border">
                    <NavLink
                      to={i.to}
                      params={i.params}
                      className="flex flex-col gap-2xs py-md transition-fast hover:bg-surface-pressed"
                    >
                      <span className="text-body font-medium text-foreground">{i.title}</span>
                      <span className="text-meta text-muted-foreground">{i.note}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
