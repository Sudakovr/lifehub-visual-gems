import * as React from "react";
import { Link } from "@tanstack/react-router";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Button, StatusChip, type Tone } from "@/components/kit/primitives";
import { notificationFeed, type NotificationKind } from "@/mock/admin";
import { cn } from "@/lib/utils";

/* Центр уведомлений: одна лента, фильтр по типу и переход к источнику. */

const kindTone: Record<NotificationKind, Tone> = {
  Упоминание: "info",
  Назначение: "accent",
  Приёмка: "warn",
  Комментарий: "neutral",
};

const filters = ["Все", "Непрочитанные", "Упоминание", "Назначение", "Приёмка", "Комментарий"] as const;

export function NotificationsCenter() {
  const [rows, setRows] = React.useState(notificationFeed);
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("Все");

  const unread = rows.filter((r) => r.unread).length;
  const visible = rows.filter((r) =>
    filter === "Все" ? true : filter === "Непрочитанные" ? r.unread : r.kind === filter,
  );

  return (
    <AppShell>
      <PageHeading
        title="Уведомления"
        note={unread ? `${unread} непрочитанных из ${rows.length}` : "Все уведомления прочитаны"}
        actions={
          <div className="flex items-center gap-sm">
            <Button
              variant="secondary"
              disabled={unread === 0}
              onClick={() => setRows((r) => r.map((x) => ({ ...x, unread: false })))}
            >
              Отметить всё прочитанным
            </Button>
            <KebabMenu
              items={[{ label: "Настроить уведомления" }, { label: "Показать только за неделю" }]}
              destructive={{ label: "Очистить прочитанные" }}
            />
          </div>
        }
      />

      <div className="mt-xl flex flex-wrap gap-xs border-b border-border pb-md">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={f === filter}
            className={cn(
              "rounded-full border px-md py-0.5 text-meta transition-fast",
              f === filter
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-sm py-4xl">
          <h2 className="text-title font-semibold text-foreground">Здесь пусто</h2>
          <p className="max-w-prose text-body text-muted-foreground">
            По этому фильтру уведомлений нет. Снимите фильтр, чтобы увидеть всю ленту.
          </p>
          <Button variant="secondary" onClick={() => setFilter("Все")}>
            Показать все
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border border-b border-border">
          {visible.map((n) => (
            <li key={n.id} className={cn("flex flex-wrap items-start gap-md py-md", n.unread && "bg-surface-sunken")}>
              <span
                className={cn("mt-2 size-2 shrink-0 rounded-full", n.unread ? "bg-accent" : "bg-transparent")}
                aria-hidden
              />
              <span className="flex min-w-0 flex-1 flex-col gap-2xs">
                <span className="flex flex-wrap items-center gap-sm">
                  <StatusChip tone={kindTone[n.kind]}>{n.kind}</StatusChip>
                  <span className={cn("text-body text-foreground", n.unread && "font-medium")}>{n.title}</span>
                </span>
                <span className="text-meta text-muted-foreground">{n.detail}</span>
                <span className="text-meta text-muted-foreground">
                  {n.who}, {n.when} · {n.unread ? "не прочитано" : "прочитано"}
                </span>
              </span>
              <span className="flex items-center gap-sm">
                <Link
                  to="/tasks/$id"
                  params={{ id: "2481" }}
                  className="text-meta text-accent underline-offset-2 transition-fast hover:underline"
                >
                  Открыть источник
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRows((r) => r.map((x) => (x.id === n.id ? { ...x, unread: !x.unread } : x)))}
                >
                  {n.unread ? "Прочитано" : "Вернуть непрочитанным"}
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
