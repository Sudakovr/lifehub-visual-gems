import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/auth/auth-screens";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Вход — LifeHub" },
      { name: "description", content: "Вход в LifeHub: почта и пароль, восстановление доступа и переход к регистрации." },
      { property: "og:title", content: "Вход — LifeHub" },
      { property: "og:description", content: "Продолжите там, где остановились: план дня, задачи и проекты." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreen,
});
