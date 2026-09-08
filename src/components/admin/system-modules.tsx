import * as React from "react";
import { AppShell, PageHeading, Metric } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { SectionHead } from "@/components/projects/shared";
import { Button, StatusChip, Toggle, type Tone } from "@/components/kit/primitives";
import { systemModules } from "@/mock/admin";

/* Модули системы: вид администратора над всеми пространствами. */

const stateTone: Record<string, Tone | undefined> = {
  Работает: "ok",
  Ошибка: "danger",
  Выключен: "neutral",
};

export function SystemModules() {
  const [rows, setRows] = React.useState(systemModules);
  const enabled = rows.filter((r) => r.enabled).length;
  const failing = rows.filter((r) => r.state === "Ошибка").length;

  return (
    <AppShell>
      <PageHeading
        title="Модули системы"
        note="Администратор включает модули для всей установки. Пространство может выключить у себя только уже включённый модуль."
        actions={<Button variant="secondary">Журнал изменений</Button>}
      />

      <div className="mt-xl grid gap-xl border-y border-border py-lg sm:grid-cols-3">
        <Metric label="Модулей включено" value={`${enabled} из ${rows.length}`} />
        <Metric label="Пространств в установке" value="12" note="из них 4 личных" />
        <Metric
          label="Модулей с ошибкой"
          value={failing}
          tone={failing ? "danger" : "ok"}
          note={failing ? "Поиск не индексирует новые файлы" : "Все модули отвечают"}
        />
      </div>

      <div className="mt-2xl flex flex-col gap-lg">
        <SectionHead title="Список модулей" note="изменение действует на все пространства" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-page border-collapse text-body">
            <thead>
              <tr className="border-b border-border text-left text-meta text-muted-foreground">
                <th scope="col" className="py-sm font-normal">Модуль</th>
                <th scope="col" className="w-24 py-sm font-normal">Версия</th>
                <th scope="col" className="w-32 py-sm font-normal">Пространств</th>
                <th scope="col" className="w-32 py-sm font-normal">Состояние</th>
                <th scope="col" className="w-44 py-sm font-normal">Доступен</th>
                <th scope="col" className="w-10 py-sm font-normal">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="py-md pr-lg align-top">
                    <span className="flex flex-col">
                      <span className="flex items-center gap-sm text-foreground">
                        {m.name}
                        {m.locked ? <StatusChip>Основной</StatusChip> : null}
                      </span>
                      <span className="text-meta text-muted-foreground">{m.note}</span>
                    </span>
                  </td>
                  <td className="num py-md align-top text-muted-foreground">{m.version}</td>
                  <td className="num py-md align-top text-muted-foreground">{m.spaces}</td>
                  <td className="py-md align-top">
                    <StatusChip tone={stateTone[m.state] ?? "neutral"}>{m.state}</StatusChip>
                  </td>
                  <td className="py-md align-top">
                    <Toggle
                      label={m.enabled ? "Включён" : "Выключен"}
                      checked={m.enabled}
                      disabled={Boolean(m.locked)}
                      onChange={(v) => setRows((r) => r.map((x) => (x.id === m.id ? { ...x, enabled: v } : x)))}
                    />
                  </td>
                  <td className="py-md align-top">
                    <KebabMenu
                      items={[
                        { label: "Открыть настройки модуля" },
                        { label: "Показать пространства" },
                        { label: "Переиндексировать" },
                      ]}
                      destructive={{ label: "Удалить модуль из установки" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
