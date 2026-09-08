import { createFileRoute } from "@tanstack/react-router";
import { TaskScreen } from "@/components/task/task-screen";

export const Route = createFileRoute("/tasks/$id/")({
  head: () => ({
    meta: [
      { title: "LifeHub — задача LH-2481" },
      {
        name: "description",
        content:
          "Рабочий экран задачи LifeHub: содержание и чек-лист, единая лента обсуждения и событий, свойства и учёт времени.",
      },
      { property: "og:title", content: "LifeHub — задача LH-2481" },
      {
        property: "og:description",
        content: "Содержание, единая лента и свойства задачи в трёх колонках.",
      },
    ],
  }),
  component: TaskPage,
});

function TaskPage() {
  return <TaskScreen />;
}
