import { createFileRoute } from "@tanstack/react-router";
import { ProjectNotes } from "@/components/projects/project-notes";

export const Route = createFileRoute("/projects/$id/notes")({
  head: () => ({
    meta: [
      { title: "Заметки проекта — LifeHub" },
      {
        name: "description",
        content:
          "Заметки проекта LifeHub: решения и договорённости с тегами, связями с задачами и вложениями.",
      },
      { property: "og:title", content: "Заметки проекта — LifeHub" },
      { property: "og:description", content: "Решения и договорённости рядом с задачами проекта." },
    ],
  }),
  component: ProjectNotes,
});
