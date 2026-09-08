import * as React from "react";
import { Upload } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button, StatusChip } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { spaceFileRows } from "@/mock/content";
import { cn } from "@/lib/utils";

/* Файлы пространства: привязка к проекту и задаче, статус извлечения текста, загрузка перетаскиванием. */

const stateTone = { обработан: "ok", "в очереди": "warn", ошибка: "danger" } as const;

const uploads = [
  { id: "u-1", name: "Акт_этап_2.pdf", size: "180 КБ", percent: 68 },
  { id: "u-2", name: "Фото_помещения.jpg", size: "2,8 МБ", percent: 24 },
];

export function FilesScreen() {
  const [over, setOver] = React.useState(false);
  const [showUploads, setShowUploads] = React.useState(true);

  return (
    <AppShell>
      <PageHeading
        title="Файлы"
        note="Все файлы пространства с привязкой к проекту и задаче и статусом извлечения текста."
        actions={<Button variant="secondary">Загрузить файл</Button>}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          setShowUploads(true);
        }}
        className={cn(
          "mt-xl flex items-center gap-md rounded-md border border-dashed px-lg py-md transition-fast",
          over ? "border-accent bg-accent-soft" : "border-border-strong bg-surface-sunken",
        )}
      >
        <Upload className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <p className="text-body text-foreground">
          Перетащите файлы сюда — они привяжутся к выбранному проекту и задаче.
        </p>
        <span className="ml-auto text-meta text-muted-foreground">до 50 МБ на файл</span>
      </div>

      {showUploads ? (
        <ul className="mt-md flex flex-col gap-sm">
          {uploads.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-md">
              <span className="min-w-0 flex-1 truncate text-body text-foreground">{u.name}</span>
              <span className="num text-meta text-muted-foreground">{u.size}</span>
              <span className="h-1.5 w-48 overflow-hidden rounded-full bg-surface-pressed" aria-hidden>
                <span className="block h-full rounded-full bg-accent" style={{ width: `${u.percent}%` }} />
              </span>
              <span className="num w-12 text-right text-meta text-muted-foreground">{u.percent}%</span>
              <Button variant="ghost" size="sm" onClick={() => setShowUploads(false)}>
                Отменить
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-xl overflow-x-auto">
        <table className="w-full min-w-page border-collapse text-body">
          <caption className="sr-only">Файлы пространства</caption>
          <thead>
            <tr className="border-y border-border text-left text-meta text-muted-foreground">
              <th className="py-sm pr-md font-medium">Имя</th>
              <th className="py-sm pr-md font-medium">Тип</th>
              <th className="py-sm pr-md font-medium">Размер</th>
              <th className="py-sm pr-md font-medium">Проект</th>
              <th className="py-sm pr-md font-medium">Задача</th>
              <th className="py-sm pr-md font-medium">Загрузил</th>
              <th className="py-sm pr-md font-medium">Дата</th>
              <th className="py-sm pr-md font-medium">Текст</th>
              <th className="py-sm" />
            </tr>
          </thead>
          <tbody>
            {spaceFileRows.map((f) => (
              <tr key={f.id} className="border-b border-border transition-fast hover:bg-surface-pressed">
                <td className="py-sm pr-md text-foreground">{f.name}</td>
                <td className="py-sm pr-md text-muted-foreground">{f.kind}</td>
                <td className="num py-sm pr-md text-muted-foreground">{f.size}</td>
                <td className="py-sm pr-md text-muted-foreground">{f.project}</td>
                <td className="num py-sm pr-md text-muted-foreground">{f.task ?? "—"}</td>
                <td className="py-sm pr-md text-muted-foreground">{f.author}</td>
                <td className="py-sm pr-md text-muted-foreground">{f.date}</td>
                <td className="py-sm pr-md">
                  <span className="flex items-center gap-sm">
                    <StatusChip tone={stateTone[f.state]}>{f.state}</StatusChip>
                    {f.state === "ошибка" ? (
                      <Button variant="ghost" size="sm">
                        Повторить
                      </Button>
                    ) : null}
                  </span>
                </td>
                <td className="py-sm text-right">
                  <KebabMenu
                    items={[{ label: "Скачать файл" }, { label: "Перепривязать к задаче" }]}
                    destructive={{ label: "Удалить файл" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
