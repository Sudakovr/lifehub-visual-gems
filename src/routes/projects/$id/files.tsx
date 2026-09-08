import { createFileRoute } from "@tanstack/react-router";
import { ProjectFiles } from "@/components/projects/project-files";

export const Route = createFileRoute("/projects/$id/files")({
  head: () => ({
    meta: [
      { title: "Файлы проекта — LifeHub" },
      {
        name: "description",
        content:
          "Файлы проекта LifeHub: имя, тип, размер, кто загрузил, привязка к задаче и статус извлечения текста с повтором при ошибке.",
      },
      { property: "og:title", content: "Файлы проекта — LifeHub" },
      { property: "og:description", content: "Загрузка перетаскиванием и статус извлечения текста по каждому файлу." },
    ],
  }),
  component: ProjectFiles,
});
