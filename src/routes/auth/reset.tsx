import { createFileRoute } from "@tanstack/react-router";
import { ResetScreen } from "@/components/auth/auth-screens";

export const Route = createFileRoute("/auth/reset")({
  head: () => ({
    meta: [
      { title: "Восстановление пароля — LifeHub" },
      { name: "description", content: "Восстановление пароля LifeHub: ссылка на смену пароля приходит на почту и действует час." },
      { property: "og:title", content: "Восстановление пароля — LifeHub" },
      { property: "og:description", content: "Пришлём ссылку на смену пароля, она действует час." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetScreen,
});
