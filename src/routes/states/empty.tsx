import { createFileRoute } from "@tanstack/react-router";
import { EmptyStates } from "@/components/states/empty-states";

export const Route = createFileRoute("/states/empty")({
  head: () => ({
    meta: [
      { title: "Пустые состояния — LifeHub" },
      {
        name: "description",
        content: "Все пустые состояния LifeHub на одной странице: нет проектов, задач, файлов, заметок, доступа.",
      },
      { property: "og:title", content: "Пустые состояния — LifeHub" },
      { property: "og:description", content: "Девять пустых состояний продукта: заголовок, фраза и одно действие." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmptyStates,
});
