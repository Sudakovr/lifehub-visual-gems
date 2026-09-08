import { createFileRoute } from "@tanstack/react-router";
import { SearchScreen } from "@/components/content/search-screen";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Поиск — LifeHub" },
      { name: "description", content: "Поиск LifeHub по задачам, проектам, заметкам и содержимому файлов пространства." },
      { property: "og:title", content: "Поиск — LifeHub" },
      { property: "og:description", content: "Один запрос — задачи, проекты, заметки и файлы." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchScreen,
});
