import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  Clock,
  FileText,
  Folder,
  Inbox,
  Menu,
  Moon,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Square,
  Sun,
  UserRound,
  Plus,
  X,
} from "lucide-react";
import { Avatar, Button } from "@/components/kit/primitives";
import { QuickAdd } from "@/components/daily/quick-add";
import { CommandMenu } from "@/components/app/command-menu";
import { activeTimer, notifications, roleLabel, spaces, unreadCount } from "@/mock/shell";
import { cn } from "@/lib/utils";

/* Оболочка приложения: слева навигация, сверху строка местоположения и инструменты. */

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string> | undefined;
  className?: string;
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean };
  onClick?: () => void;
  title?: string;
  children?: React.ReactNode;
}>;

type Section = { to: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> };

const sections: Section[] = [
  { to: "/today", label: "Сегодня", icon: CalendarCheck },
  { to: "/inbox", label: "Входящие", icon: Inbox },
  { to: "/my", label: "Мои задачи", icon: UserRound },
  { to: "/projects", label: "Проекты", icon: Folder },
  { to: "/notes", label: "Заметки", icon: NotebookPen },
  { to: "/files", label: "Файлы", icon: FileText },
  { to: "/search", label: "Поиск", icon: Search },
  { to: "/time", label: "Время", icon: Clock },
];

const bottomTabs = sections.slice(0, 4);

const toneRing: Record<string, string> = {
  accent: "bg-accent",
  ok: "bg-ok",
  warn: "bg-warn",
  info: "bg-info",
};

export function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
      onClick={() => setDark((v) => !v)}
    >
      {dark ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
    </Button>
  );
}

function locationTitle(pathname: string) {
  if (pathname.startsWith("/projects/")) return ["Проекты", "Переезд офиса"];
  if (pathname.startsWith("/tasks/")) return ["Переезд офиса", "LH-2481"];
  const found = sections.find((s) => pathname.startsWith(s.to));
  if (found) return ["Работа", found.label];
  return ["Работа", "Обзор"];
}

function SpaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(spaces[1]!);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Пространство «${current.name}», сменить`}
        className={cn(
          "flex w-full items-center gap-sm rounded-md px-sm py-sm text-left transition-fast hover:bg-surface-pressed",
          collapsed && "justify-center px-0",
        )}
      >
        <span className={cn("size-2.5 shrink-0 rounded-full", toneRing[current.tone])} aria-hidden />
        {collapsed ? null : (
          <>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-body font-medium text-foreground">{current.name}</span>
              <span className="text-caption text-muted-foreground">
                {current.kind === "личное" ? "Личное пространство" : roleLabel[current.role]}
              </span>
            </span>
            <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          </>
        )}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-40 mt-xs min-w-56 rounded-md border border-border bg-surface py-xs shadow-e2">
          {spaces.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrent(s);
                setOpen(false);
              }}
              className="flex w-full items-center gap-sm px-md py-sm text-left transition-fast hover:bg-surface-pressed"
            >
              <span className={cn("size-2.5 rounded-full", toneRing[s.tone])} aria-hidden />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-body text-foreground">{s.name}</span>
                <span className="text-caption text-muted-foreground">
                  {s.kind === "личное" ? "Личное, не расшаривается" : roleLabel[s.role]}
                </span>
              </span>
              {s.id === current.id ? <span className="ml-auto text-caption text-muted-foreground">Открыто</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn("px-sm pt-md", collapsed && "px-xs")}>
        <SpaceSwitcher collapsed={collapsed} />
      </div>

      <nav className={cn("mt-md flex flex-1 flex-col gap-2xs px-sm", collapsed && "px-xs")} aria-label="Разделы">
        {sections.map((s) => (
          <Nav
            key={s.to}
            to={s.to}
            onClick={onNavigate}
            title={collapsed ? s.label : undefined}
            className={cn(
              "flex items-center gap-sm rounded-md px-sm py-sm text-body text-muted-foreground transition-fast hover:bg-surface-pressed hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
            activeProps={{ className: "bg-surface-pressed text-foreground font-medium" }}
          >
            <s.icon className="size-4 shrink-0" strokeWidth={1.75} />
            {collapsed ? <span className="sr-only">{s.label}</span> : <span className="truncate">{s.label}</span>}
          </Nav>
        ))}
      </nav>

      <div className={cn("border-t border-border px-sm py-sm", collapsed && "px-xs")}>
        <button
          className={cn(
            "flex w-full items-center gap-sm rounded-md px-sm py-sm text-left transition-fast hover:bg-surface-pressed",
            collapsed && "justify-center px-0",
          )}
        >
          <Avatar name="Анна Верёвкина" size="sm" />
          {collapsed ? (
            <span className="sr-only">Профиль: Анна Верёвкина</span>
          ) : (
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-body text-foreground">Анна Верёвкина</span>
              <span className="truncate text-caption text-muted-foreground">anna@lifehub.ru</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Уведомления, непрочитанных: ${unreadCount}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell className="size-4" strokeWidth={1.75} />
        <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-danger px-2xs text-caption font-medium text-white">
          {unreadCount}
        </span>
      </Button>
      {open ? (
        <div className="absolute right-0 z-40 mt-xs w-80 rounded-md border border-border bg-surface shadow-e2">
          <p className="border-b border-border px-md py-sm text-meta text-muted-foreground">
            Уведомления · непрочитанных {unreadCount}
          </p>
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className="flex gap-sm border-b border-border px-md py-sm last:border-b-0">
                <span
                  className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.unread ? "bg-accent" : "bg-border-strong")}
                  aria-hidden
                />
                <span className="flex flex-col">
                  <span className="text-body text-foreground">{n.text}</span>
                  <span className="text-caption text-muted-foreground">
                    {n.when}
                    {n.unread ? " · новое" : " · прочитано"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [space, page] = locationTitle(pathname);

  React.useEffect(() => {
    const saved = window.localStorage.getItem("lifehub.nav.collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("lifehub.nav.collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "л")) {
        e.preventDefault();
        setPalette((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      {/* Навигация: развёрнутая или свёрнутая до иконок. На телефоне скрыта. */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface transition-[width] duration-base md:flex md:flex-col",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className={cn("flex h-14 items-center gap-sm border-b border-border px-sm", collapsed && "justify-center px-0")}>
          {collapsed ? null : (
            <Nav to="/" className="text-body font-semibold text-foreground">
              LifeHub
            </Nav>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={collapsed ? "" : "ml-auto"}
            aria-label={collapsed ? "Развернуть навигацию" : "Свернуть навигацию"}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="size-4" strokeWidth={1.75} />
            )}
          </Button>
        </div>
        <SidebarBody collapsed={collapsed} />
      </aside>

      {/* Мобильная шторка навигации */}
      {drawer ? (
        <div className="fixed inset-0 z-50 bg-foreground/30 md:hidden" role="presentation" onClick={() => setDrawer(false)}>
          <div
            className="h-full w-72 border-r border-border bg-surface"
            role="dialog"
            aria-modal="true"
            aria-label="Навигация"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-md">
              <span className="text-body font-semibold text-foreground">LifeHub</span>
              <Button variant="ghost" size="icon" aria-label="Закрыть навигацию" onClick={() => setDrawer(false)}>
                <X className="size-4" strokeWidth={1.75} />
              </Button>
            </div>
            <SidebarBody collapsed={false} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-base", collapsed ? "md:pl-16" : "md:pl-64")}>
        <header className="sticky top-0 z-30 border-b border-border bg-surface">
          <div className="flex h-14 items-center gap-sm px-md md:px-lg">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Открыть навигацию" onClick={() => setDrawer(true)}>
              <Menu className="size-4" strokeWidth={1.75} />
            </Button>

            <p className="flex min-w-0 items-center gap-xs text-meta">
              <span className="hidden text-muted-foreground sm:inline">{space}</span>
              <span className="hidden text-muted-foreground sm:inline">/</span>
              <span className="truncate text-body font-medium text-foreground">{page}</span>
            </p>

            <button
              onClick={() => setPalette(true)}
              className="ml-auto hidden h-9 w-72 items-center gap-sm rounded-md border border-border bg-surface-sunken px-md text-left text-meta text-muted-foreground transition-fast hover:bg-surface-pressed lg:flex"
            >
              <Search className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate">Поиск по задачам, проектам, заметкам</span>
              <kbd className="ml-auto shrink-0 rounded-xs border border-border px-xs text-caption">⌘K</kbd>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Открыть поиск"
              onClick={() => setPalette(true)}
            >
              <Search className="size-4" strokeWidth={1.75} />
            </Button>

            <div className="ml-auto flex items-center gap-xs lg:ml-sm">
              {/* Активный таймер виден только когда он идёт */}
              <span className="hidden items-center gap-xs rounded-md border border-border bg-surface-sunken py-xs pl-md pr-xs xl:flex">
                <span className="size-1.5 rounded-full bg-ok" aria-hidden />
                <span className="text-meta text-muted-foreground">{activeTimer.taskCode}</span>
                <span className="num text-meta font-medium text-foreground">{activeTimer.elapsed}</span>
                <Button variant="ghost" size="icon" aria-label="Остановить таймер" className="h-7 w-7">
                  <Square className="size-3" strokeWidth={2} />
                </Button>
              </span>

              <Button
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => window.dispatchEvent(new CustomEvent("lifehub:quick-add"))}
              >
                <Plus className="size-4" strokeWidth={1.75} />
                Новая задача
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Новая задача"
                onClick={() => window.dispatchEvent(new CustomEvent("lifehub:quick-add"))}
              >
                <Plus className="size-4" strokeWidth={1.75} />
              </Button>

              <Notifications />
              <ThemeToggle />
              <span className="hidden md:inline">
                <Avatar name="Анна Верёвкина" size="sm" />
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-app px-md pt-xl pb-3xl md:px-lg">{children}</main>
      </div>

      {/* Телефон: нижние вкладки вместо боковой навигации */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface md:hidden"
        aria-label="Основные разделы"
      >
        {bottomTabs.map((t) => (
          <Nav
            key={t.to}
            to={t.to}
            className="flex flex-1 flex-col items-center gap-2xs py-sm text-caption text-muted-foreground transition-fast"
            activeProps={{ className: "text-foreground" }}
          >
            <t.icon className="size-5" strokeWidth={1.75} />
            <span>{t.label}</span>
          </Nav>
        ))}
        <button
          onClick={() => setDrawer(true)}
          className="flex flex-1 flex-col items-center gap-2xs py-sm text-caption text-muted-foreground"
        >
          <Menu className="size-5" strokeWidth={1.75} />
          <span>Ещё</span>
        </button>
      </nav>
      <div className="h-16 md:hidden" aria-hidden />

      <CommandMenu open={palette} onClose={() => setPalette(false)} />
      <QuickAdd />
    </div>
  );
}

export function PageHeading({
  title,
  note,
  actions,
  className,
}: {
  title: React.ReactNode;
  note?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-lg", className)}>
      <div className="flex flex-col gap-xs">
        <h1 className="text-heading font-semibold text-foreground">{title}</h1>
        {note ? <p className="max-w-prose text-meta text-muted-foreground">{note}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-sm">{actions}</div> : null}
    </div>
  );
}

export function Metric({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  tone?: "danger" | "warn" | "ok";
}) {
  return (
    <div className="flex flex-col gap-2xs">
      <span className="text-meta text-muted-foreground">{label}</span>
      <span
        className={cn(
          "num text-display leading-none font-semibold",
          tone === "danger" && "text-danger-foreground",
          tone === "warn" && "text-warn-foreground",
          tone === "ok" && "text-ok-foreground",
        )}
      >
        {value}
      </span>
      {note ? <span className="text-meta text-muted-foreground">{note}</span> : null}
    </div>
  );
}
