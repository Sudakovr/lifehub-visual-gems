import { createFileRoute } from "@tanstack/react-router";
import { TodayScreen } from "@/components/daily/today";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Сегодня — LifeHub" },
      {
        name: "description",
        content:
          "Главный экран дня LifeHub: план дня от ИИ с причинами, просроченные и сегодняшние задачи, входящие без проекта.",
      },
      { property: "og:title", content: "Сегодня — LifeHub" },
      { property: "og:description", content: "План дня от ИИ, просрочено, сегодня и входящие." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TodayScreen,
});
