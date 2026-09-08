import { createFileRoute } from "@tanstack/react-router";
import { ProjectBoard } from "@/components/projects/project-board";

export const Route = createFileRoute("/projects/$id/board")({
  head: () => ({
    meta: [
      { title: "Канбан проекта — LifeHub" },
      {
        name: "description",
        content:
          "Канбан проекта LifeHub: колонки по статусам, перетаскивание мышью и пальцем, плотные карточки задач и сворачивание колонок.",
      },
      { property: "og:title", content: "Канбан проекта — LifeHub" },
      { property: "og:description", content: "Колонки по статусам и перетаскивание карточек мышью или пальцем." },
    ],
  }),
  component: ProjectBoard,
});
