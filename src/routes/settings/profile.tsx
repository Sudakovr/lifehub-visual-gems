import { createFileRoute } from "@tanstack/react-router";
import { ProfileSettings } from "@/components/admin/profile-settings";

export const Route = createFileRoute("/settings/profile")({
  head: () => ({
    meta: [
      { title: "Профиль и уведомления — LifeHub" },
      {
        name: "description",
        content: "Профиль пользователя LifeHub, оформление, пароль и настройка уведомлений письмом и push.",
      },
      { property: "og:title", content: "Профиль и уведомления — LifeHub" },
      { property: "og:description", content: "Данные профиля, оформление, доступ и уведомления." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfileSettings,
});
