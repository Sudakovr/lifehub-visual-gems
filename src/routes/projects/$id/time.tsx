import { createFileRoute } from "@tanstack/react-router";
import { ProjectTime } from "@/components/projects/project-time";

export const Route = createFileRoute("/projects/$id/time")({
  head: () => ({
    meta: [
      { title: "Время проекта — LifeHub" },
      {
        name: "description",
        content:
          "Отчёт по времени проекта LifeHub: суммы по задачам и людям, оплачиваемое отдельно, записи времени и выгрузка.",
      },
      { property: "og:title", content: "Время проекта — LifeHub" },
      { property: "og:description", content: "Суммы по людям и задачам, оплачиваемое время и выгрузка отчёта." },
    ],
  }),
  component: ProjectTime,
});
