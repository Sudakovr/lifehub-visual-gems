import { createFileRoute } from "@tanstack/react-router";
import { WelcomeScreen } from "@/components/welcome/welcome";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Первый вход — LifeHub" },
      { name: "description", content: "Онбординг LifeHub: назвать первый проект, создать первую задачу и поставить приложение на телефон." },
      { property: "og:title", content: "Первый вход — LifeHub" },
      { property: "og:description", content: "Три коротких шага, каждый можно пропустить." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomeScreen,
});
