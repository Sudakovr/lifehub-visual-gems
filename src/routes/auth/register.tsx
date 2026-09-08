import { createFileRoute } from "@tanstack/react-router";
import { RegisterScreen } from "@/components/auth/auth-screens";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — LifeHub" },
      { name: "description", content: "Создание аккаунта LifeHub: личное пространство создаётся сразу и остаётся приватным." },
      { property: "og:title", content: "Регистрация — LifeHub" },
      { property: "og:description", content: "Личное пространство создаётся сразу и не расшаривается." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterScreen,
});
