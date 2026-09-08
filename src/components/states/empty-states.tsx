import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button } from "@/components/kit/primitives";
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
            <div className="mt-auto flex flex-col items-start gap-sm pt-xl">
              <h2 className="text-title font-semibold text-foreground">{s.title}</h2>
              <p className="max-w-prose text-body text-muted-foreground">{s.text}</p>
              <Button variant="secondary" size="sm">
                {s.action}
              </Button>
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
