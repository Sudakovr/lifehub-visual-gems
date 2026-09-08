import { createFileRoute } from "@tanstack/react-router";
import { ProjectSettings } from "@/components/projects/project-settings";

export const Route = createFileRoute("/projects/$id/settings")({
  head: () => ({
    meta: [
      { title: "Настройки проекта — LifeHub" },
      {
        name: "description",
        content:
          "Настройки проекта LifeHub: название, описание, статус, даты, участники и роли, теги, архивирование и удаление.",
      },
      { property: "og:title", content: "Настройки проекта — LifeHub" },
      { property: "og:description", content: "Название, статус, даты, участники, теги и архив проекта." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { id } = Route.useParams();
  return <ProjectSettings id={id} />;
}
