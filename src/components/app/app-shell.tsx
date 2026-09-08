import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { Avatar, Button } from "@/components/kit/primitives";
import { QuickAdd } from "@/components/daily/quick-add";
import { cn } from "@/lib/utils";

/* Общая рамка экранов: верхняя строка пространства и содержимое. */

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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-app items-center gap-lg px-lg">
          <Link to="/" className="text-body font-semibold text-foreground">
            LifeHub
          </Link>
          <span className="hidden text-meta text-muted-foreground sm:inline">Пространство «Работа»</span>
          <nav className="ml-auto flex min-w-0 items-center gap-xs">
            <div className="flex min-w-0 items-center gap-xs overflow-x-auto whitespace-nowrap">
            <Link
              to="/today"
              className="rounded-md px-md py-xs text-body text-muted-foreground transition-fast hover:bg-surface-pressed hover:text-foreground"
              activeProps={{ className: "bg-surface-pressed text-foreground" }}
            >
              Сегодня
            </Link>
            <Link
              to="/inbox"
              className="rounded-md px-md py-xs text-body text-muted-foreground transition-fast hover:bg-surface-pressed hover:text-foreground"
              activeProps={{ className: "bg-surface-pressed text-foreground" }}
            >
              Входящие
            </Link>
            <Link
              to="/my"
              className="rounded-md px-md py-xs text-body text-muted-foreground transition-fast hover:bg-surface-pressed hover:text-foreground"
              activeProps={{ className: "bg-surface-pressed text-foreground" }}
            >
              Мои задачи
            </Link>
            <Link
              to="/projects"
              className="rounded-md px-md py-xs text-body text-muted-foreground transition-fast hover:bg-surface-pressed hover:text-foreground"
              activeProps={{ className: "bg-surface-pressed text-foreground" }}
            >
              Проекты
            </Link>
            <Link
              to="/kit"
              className="rounded-md px-md py-xs text-body text-muted-foreground transition-fast hover:bg-surface-pressed hover:text-foreground"
              activeProps={{ className: "bg-surface-pressed text-foreground" }}
            >
              Библиотека
            </Link>
            </div>
            <ThemeToggle />
            <Avatar name="Анна Верёвкина" size="sm" />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-app px-lg pt-xl pb-3xl">{children}</main>
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
