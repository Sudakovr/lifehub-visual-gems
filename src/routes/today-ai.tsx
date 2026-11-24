import { createFileRoute } from "@tanstack/react-router";
import { TodayAiScreen } from "@/components/today-ai/today-ai-screen";

export const Route = createFileRoute("/today-ai")({
  head: () => ({
    meta: [
      { title: "«Сегодня» с ИИ — прототип LifeHub" },
      { name: "description", content: "Две композиции блока «С чего начать с ИИ» на экране «Сегодня»: разбор фразы, план дня и итог недели." },
      { property: "og:title", content: "«Сегодня» с ИИ — прототип LifeHub" },
      { property: "og:description", content: "Разбор фразы, план дня и итог недели — две композиции с состояниями." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TodayAiScreen,
});
