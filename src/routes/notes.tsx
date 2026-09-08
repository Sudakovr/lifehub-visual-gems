import { createFileRoute } from "@tanstack/react-router";
import { NotesScreen } from "@/components/app/space-screens";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Заметки пространства — LifeHub" },
      { name: "description", content: "Заметки пространства LifeHub: решения и договорённости со связями с проектами и задачами." },
      { property: "og:title", content: "Заметки пространства — LifeHub" },
      { property: "og:description", content: "Решения и договорённости рядом с задачами." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesScreen,
});
