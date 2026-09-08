import { createFileRoute } from "@tanstack/react-router";
import { ProjectOverview } from "@/components/projects/project-overview";

export const Route = createFileRoute("/projects/$id/")({
  head: () => ({
    meta: [
      { title: "Обзор проекта — LifeHub" },
      {
        name: "description",
        content:
          "Обзор проекта LifeHub: сводка от ИИ со ссылками на источники, ход по статусам, ближайшие сроки, риск срыва, участники и время.",
      },
      { property: "og:title", content: "Обзор проекта — LifeHub" },
      { property: "og:description", content: "Сводка от ИИ, сроки, риск срыва, участники и суммы времени." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { id } = Route.useParams();
  return <ProjectOverview id={id} />;
}
