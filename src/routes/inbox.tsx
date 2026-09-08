import { createFileRoute } from "@tanstack/react-router";
import { InboxScreen } from "@/components/daily/inbox";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Входящие — LifeHub" },
      {
        name: "description",
        content:
          "Входящие LifeHub: задачи без проекта, перенос в проект по одной и массово, состояние при сотнях задач.",
      },
      { property: "og:title", content: "Входящие — LifeHub" },
      { property: "og:description", content: "Задачи без проекта и быстрый перенос в проект." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InboxScreen,
});
