import { createFileRoute } from "@tanstack/react-router";
import { ProjectTasks } from "@/components/projects/project-tasks";

export const Route = createFileRoute("/projects/$id/tasks")({
  head: () => ({
    meta: [
      { title: "Задачи проекта — LifeHub" },
      {
        name: "description",
        content:
          "Таблица задач проекта: настраиваемые колонки, сортировка, группировка, фильтры, массовые действия и дерево подзадач.",
      },
      { property: "og:title", content: "Задачи проекта — LifeHub" },
      { property: "og:description", content: "Колонки, группировка, массовые действия и подзадачи деревом." },
    ],
  }),
  component: ProjectTasks,
});
