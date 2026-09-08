import { createFileRoute } from "@tanstack/react-router";
import { MobileBuild } from "@/components/states/mobile-build";

export const Route = createFileRoute("/states/mobile")({
  head: () => ({
    meta: [
      { title: "Мобильная сборка — LifeHub" },
      {
        name: "description",
        content: "Экраны LifeHub в рамке 390 px: список задач, канбан, задача, лента и быстрый ввод.",
      },
      { property: "og:title", content: "Мобильная сборка — LifeHub" },
      { property: "og:description", content: "Список задач, канбан, задача, лента и быстрый ввод на телефоне." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MobileBuild,
});
