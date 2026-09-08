import { createFileRoute } from "@tanstack/react-router";
import { NotificationsCenter } from "@/components/admin/notifications-center";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Уведомления — LifeHub" },
      {
        name: "description",
        content: "Центр уведомлений LifeHub: упоминания, назначения, приёмка и комментарии, прочитанные и новые.",
      },
      { property: "og:title", content: "Уведомления — LifeHub" },
      { property: "og:description", content: "Упоминания, назначения, приёмка и комментарии в одной ленте." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsCenter,
});
