import { createFileRoute } from "@tanstack/react-router";
import { InviteScreen } from "@/components/auth/auth-screens";

export const Route = createFileRoute("/auth/invite")({
  head: () => ({
    meta: [
      { title: "Приглашение в пространство — LifeHub" },
      { name: "description", content: "Приглашение в рабочее пространство LifeHub: кто пригласил, куда и с какой ролью." },
      { property: "og:title", content: "Приглашение в пространство — LifeHub" },
      { property: "og:description", content: "Кто пригласил, в какое пространство и с какой ролью." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InviteScreen,
});
