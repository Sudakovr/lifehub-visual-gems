import * as React from "react";
import { Upload } from "lucide-react";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Button, Input, Progress, StatusChip, type Tone } from "@/components/kit/primitives";
import { SectionHead, TaskLink } from "@/components/projects/shared";
import { projectFiles, type ProjectFile } from "@/mock/projects";
import { cn } from "@/lib/utils";

const extractionTone: Record<ProjectFile["extraction"], Tone> = {
  "В очереди": "warn",
  Обработан: "ok",
  Ошибка: "danger",
};

function size(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} МБ` : `${kb} КБ`;
}

export function ProjectFiles() {
  const [over, setOver] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rows = projectFiles.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-lg">
      <SectionHead
        title="Файлы проекта"
        note={`${projectFiles.length} файлов`}
        action={
          <div className="flex items-center gap-sm">
            <Input
              aria-label="Поиск по имени файла"
              placeholder="Поиск по имени"
              className="w-56"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button size="sm">
              <Upload className="size-4" strokeWidth={1.75} />
              Загрузить файл
            </Button>
          </div>
        }
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
        }}
        className={cn(
          "rounded-lg border border-dashed border-border px-lg py-xl text-center transition-fast",
          over && "border-accent bg-accent-soft",
        )}
      >
        <p className="text-body text-foreground">Перетащите файлы сюда, чтобы загрузить</p>
        <p className="mt-2xs text-meta text-muted-foreground">
          До 100 МБ на файл. Текст извлекается автоматически и попадает в поиск.
        </p>
      </div>

      <div className="flex flex-col gap-sm rounded-md border border-border px-lg py-md">
        <div className="flex items-baseline justify-between gap-md">
          <span className="text-body text-foreground">Сверка июнь.xlsx</span>
          <span className="num text-meta text-muted-foreground">1,2 МБ из 2,4 МБ</span>
        </div>
        <Progress value={52} label="Загрузка" />
        <div>
          <Button variant="ghost" size="sm">
            Отменить загрузку
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-table-wide border-collapse text-body">
          <thead>
            <tr className="border-b border-border-strong text-left text-meta text-muted-foreground">
              <th className="py-sm pr-md font-medium">Имя</th>
              <th className="px-md py-sm font-medium">Тип</th>
              <th className="px-md py-sm text-right font-medium">Размер</th>
              <th className="px-md py-sm font-medium">Загрузил</th>
              <th className="px-md py-sm font-medium">Задача</th>
              <th className="px-md py-sm font-medium">Извлечение текста</th>
              <th className="py-sm pl-md" />
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b border-border transition-fast hover:bg-surface-pressed">
                <td className="py-sm pr-md text-foreground">{f.name}</td>
                <td className="px-md py-sm text-muted-foreground">{f.kind}</td>
                <td className="num px-md py-sm text-right">{size(f.sizeKb)}</td>
                <td className="px-md py-sm whitespace-nowrap">
                  {f.uploader}
                  <span className="num ml-sm text-meta text-muted-foreground">{f.date}</span>
                </td>
                <td className="px-md py-sm">
                  {f.task ? <TaskLink code={f.task} /> : <span className="text-muted-foreground">Без задачи</span>}
                </td>
                <td className="px-md py-sm">
                  <span className="flex items-center gap-sm">
                    <StatusChip tone={extractionTone[f.extraction]}>{f.extraction}</StatusChip>
                    {f.extraction === "Ошибка" ? (
                      <Button variant="secondary" size="sm">
                        Повторить
                      </Button>
                    ) : null}
                  </span>
                </td>
                <td className="py-sm pl-md text-right">
                  <KebabMenu
                    items={[{ label: "Скачать" }, { label: "Привязать к задаче" }, { label: "Скопировать ссылку" }]}
                    destructive={{ label: "Удалить файл" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
