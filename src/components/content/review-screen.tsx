import * as React from "react";
import { Link } from "@tanstack/react-router";
import { AppShell, PageHeading, Metric } from "@/components/app/app-shell";
import { Button, StatusChip } from "@/components/kit/primitives";
import { review } from "@/mock/content";
import { hoursMinutes } from "@/mock/projects";

/* Недельный обзор: что сделано, что стоит, куда ушло время. Читается за минуту. */

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}>;

export function ReviewScreen() {
  const total = review.timeByProject.reduce((s, p) => s + p.minutes, 0);

  return (
    <AppShell>
      <PageHeading
        title={`Неделя ${review.period}`}
        note="Что сделано, что стоит и куда ушло время. Ничего лишнего — обзор читается за минуту."
        actions={<Button variant="secondary">Прошлая неделя</Button>}
      />

      <div className="mt-xl grid gap-xl border-y border-border py-lg sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Задач закрыто" value={String(review.done)} tone="ok" note={review.doneNote} />
        <Metric label="Стоит без движения" value={String(review.stuck)} tone="warn" note={`просрочено: ${review.overdue}`} />
        <Metric label="Время за неделю" value={hoursMinutes(review.minutes)} />
        <Metric
          label="Оплачиваемое"
          value={hoursMinutes(review.billableMinutes)}
          note={`${Math.round((review.billableMinutes / review.minutes) * 100)}% от всего времени`}
        />
      </div>

      <div className="mt-2xl grid gap-2xl lg:grid-cols-2">
        <section>
          <h2 className="border-b border-border pb-sm text-title font-semibold text-foreground">Сделано</h2>
          <ul className="divide-y divide-border">
            {review.finished.map((d) => (
              <li key={d.code} className="flex flex-wrap items-baseline gap-md py-sm">
                <Nav
                  to="/tasks/$id"
                  params={{ id: "2481" }}
                  className="min-w-0 flex-1 text-body text-foreground transition-fast hover:text-accent"
                >
                  <span className="num text-muted-foreground">{d.code}</span> {d.title}
                </Nav>
                <span className="text-meta text-muted-foreground">{d.project}</span>
                <span className="text-meta text-muted-foreground">{d.who}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="border-b border-border pb-sm text-title font-semibold text-foreground">Стоит на месте</h2>
          <ul className="divide-y divide-border">
            {review.stalled.map((s) => (
              <li key={s.code} className="flex flex-wrap items-baseline gap-md py-sm">
                <Nav
                  to="/tasks/$id"
                  params={{ id: "2481" }}
                  className="min-w-0 flex-1 text-body text-foreground transition-fast hover:text-accent"
                >
                  <span className="num text-muted-foreground">{s.code}</span> {s.title}
                </Nav>
                <StatusChip tone={s.tone}>{s.why}</StatusChip>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-2xl">
        <h2 className="border-b border-border pb-sm text-title font-semibold text-foreground">Куда ушло время</h2>
        <ul className="divide-y divide-border">
          {review.timeByProject.map((p) => (
            <li key={p.project} className="flex flex-wrap items-center gap-md py-sm">
              <span className="w-48 shrink-0 text-body text-foreground">{p.project}</span>
              <span className="h-1.5 min-w-24 flex-1 overflow-hidden rounded-full bg-surface-pressed" aria-hidden>
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${Math.round((p.minutes / total) * 100)}%` }}
                />
              </span>
              <span className="num w-24 shrink-0 text-right text-body text-foreground">{hoursMinutes(p.minutes)}</span>
              <span className="w-40 shrink-0 text-right text-meta text-muted-foreground">
                оплачиваемое <span className="num">{hoursMinutes(p.billable)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-2xl">
        <h2 className="border-b border-border pb-sm text-title font-semibold text-foreground">На следующую неделю</h2>
        <ul className="divide-y divide-border">
          {review.next.map((n) => (
            <li key={n.text} className="flex flex-wrap items-baseline gap-md py-sm">
              <span className="min-w-0 flex-1 text-body text-foreground">{n.text}</span>
              <span className="num text-meta text-muted-foreground">{n.source}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
