import { createFileRoute } from "@tanstack/react-router";
import { MyTasksScreen } from "@/components/daily/my-tasks";

export const Route = createFileRoute("/my")({
  head: () => ({
    meta: [
      { title: "Мои задачи — LifeHub" },
      {
        name: "description",
        content:
          "Мои задачи LifeHub: всё, где я исполнитель или наблюдатель, с группировкой, фильтрами, сохранёнными наборами и двумя плотностями списка.",
      },
      { property: "og:title", content: "Мои задачи — LifeHub" },
      { property: "og:description", content: "Группировка, фильтры и сохранённые наборы по всем пространствам." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyTasksScreen,
});
