import { AppShell, PageHeading } from "@/components/app/app-shell";
import { SectionHead } from "@/components/projects/shared";
import { Button, StatusChip } from "@/components/kit/primitives";
import { errorStates, offlineQueue } from "@/mock/admin";

/* Ошибки: 403, 404, 500, потеря сети и работа без сети. */

export function ErrorStates() {
  return (
    <AppShell>
      <PageHeading
        title="Ошибки и потеря сети"
        note="Экран говорит, что произошло и что сделать дальше. Без извинений и кодов без объяснения."
      />

      <div className="mt-2xl grid gap-px border border-border bg-border sm:grid-cols-2">
        {errorStates.map((e) => (
          <section key={e.code} className="flex min-h-64 flex-col justify-between gap-xl bg-surface p-xl">
            <span className="num text-display font-semibold text-muted-foreground">{e.code}</span>
            <div className="flex flex-col items-start gap-sm">
              <h2 className="text-title font-semibold text-foreground">{e.title}</h2>
              <p className="max-w-prose text-body text-muted-foreground">{e.text}</p>
              <div className="flex flex-wrap items-center gap-sm pt-xs">
                <Button size="sm">{e.action}</Button>
                <Button variant="ghost" size="sm">
                  {e.secondary}
                </Button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-3xl flex flex-col gap-lg">
        <SectionHead
          title="Работа без сети"
          note="приложение на телефоне продолжает работать и досылает изменения"
          action={<StatusChip tone="warn">Нет сети с 14:18</StatusChip>}
        />
        <p className="max-w-prose text-body text-muted-foreground">
          Полоса о работе без сети держится сверху, пока связь не вернётся. Задачи и заметки, открытые за последние
          дни, читаются целиком; новые изменения ждут очереди.
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {offlineQueue.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-md py-md">
              <StatusChip tone="neutral">Ждёт отправки</StatusChip>
              <span className="flex-1 text-body text-foreground">{o.what}</span>
              <span className="num text-meta text-muted-foreground">{o.when}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-sm">
          <Button size="sm">Отправить сейчас</Button>
          <Button variant="ghost" size="sm">
            Показать, что доступно без сети
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
