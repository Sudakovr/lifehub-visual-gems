import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button, EmptyState } from "@/components/kit/primitives";
import { emptyStates } from "@/mock/admin";

/* Набор пустых состояний: заголовок, одно предложение, одно действие. */

export function EmptyStates() {
  return (
    <AppShell>
      <PageHeading
        title="Пустые состояния"
        note="Девять мест, где данных ещё нет. Каждое приглашает действовать и не притворяется поломкой."
      />

      <div className="mt-2xl grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {emptyStates.map((s) => (
          <section key={s.id} className="flex min-h-56 flex-col bg-surface p-xl">
            <p className="text-meta text-muted-foreground">{s.where}</p>
            <EmptyState
              className="mt-auto pt-xl pb-0"
              title={s.title}
              description={s.text}
              action={<Button variant="secondary" size="sm">{s.action}</Button>}
            />
          </section>
        ))}
      </div>
    </AppShell>
  );
}
