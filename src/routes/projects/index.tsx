import { createFileRoute } from "@tanstack/react-router";
import { ProjectsListScreen } from "@/components/projects/projects-list";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Проекты пространства «Работа» — LifeHub" },
      {
        name: "description",
        content:
          "Список проектов LifeHub: плотная таблица или крупные строки, статус, ход выполнения, сроки, участники и риск срыва.",
      },
      { property: "og:title", content: "Проекты — LifeHub" },
      { property: "og:description", content: "Статус, ход, сроки, участники и риск срыва по каждому проекту." },
    ],
  }),
  component: ProjectsListScreen,
});
