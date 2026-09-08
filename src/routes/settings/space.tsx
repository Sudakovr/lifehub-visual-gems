import { createFileRoute } from "@tanstack/react-router";
import { SpaceSettings } from "@/components/admin/space-settings";

export const Route = createFileRoute("/settings/space")({
  head: () => ({
    meta: [
      { title: "Настройки пространства — LifeHub" },
      {
        name: "description",
        content:
          "Общие настройки пространства LifeHub, участники и роли, теги и модули, включая требование приёмки по умолчанию.",
      },
      { property: "og:title", content: "Настройки пространства — LifeHub" },
      { property: "og:description", content: "Общие, участники и роли, теги и модули пространства." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpaceSettings,
});
