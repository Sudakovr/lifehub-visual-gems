import { createFileRoute } from "@tanstack/react-router";
import { TimeScreen } from "@/components/app/space-screens";

export const Route = createFileRoute("/time")({
  head: () => ({
    meta: [
      { title: "Учёт времени — LifeHub" },
      { name: "description", content: "Учёт времени в LifeHub: суммы по задачам и людям за период, оплачиваемое отдельно." },
      { property: "og:title", content: "Учёт времени — LifeHub" },
      { property: "og:description", content: "Суммы по задачам и людям, оплачиваемое отдельно, выгрузка отчёта." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimeScreen,
});
