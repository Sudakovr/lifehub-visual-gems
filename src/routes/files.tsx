import { createFileRoute } from "@tanstack/react-router";
import { FilesScreen } from "@/components/app/space-screens";

export const Route = createFileRoute("/files")({
  head: () => ({
    meta: [
      { title: "Файлы пространства — LifeHub" },
      { name: "description", content: "Файлы пространства LifeHub с привязкой к проекту и задаче и статусом извлечения текста." },
      { property: "og:title", content: "Файлы пространства — LifeHub" },
      { property: "og:description", content: "Документы рядом с задачами, статус извлечения текста и повтор при ошибке." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FilesScreen,
});
