import { createFileRoute } from "@tanstack/react-router";
import { ReviewScreen } from "@/components/content/review-screen";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Недельный обзор — LifeHub" },
      { name: "description", content: "Недельный обзор LifeHub: что сделано, что стоит без движения и куда ушло время." },
      { property: "og:title", content: "Недельный обзор — LifeHub" },
      { property: "og:description", content: "Итоги недели: закрытые задачи, застрявшие дела и распределение времени." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewScreen,
});
