import { createFileRoute } from "@tanstack/react-router";
import { SystemModules } from "@/components/admin/system-modules";

export const Route = createFileRoute("/admin/modules")({
  head: () => ({
    meta: [
      { title: "Модули системы — LifeHub" },
      {
        name: "description",
        content: "Администрирование модулей LifeHub: состояние, версии, охват пространств и включение для всей установки.",
      },
      { property: "og:title", content: "Модули системы — LifeHub" },
      { property: "og:description", content: "Состояние и включение модулей для всех пространств." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SystemModules,
});
