import { createFileRoute } from "@tanstack/react-router";
import { ErrorStates } from "@/components/states/error-states";

export const Route = createFileRoute("/states/errors")({
  head: () => ({
    meta: [
      { title: "Ошибки и работа без сети — LifeHub" },
      {
        name: "description",
        content: "Экраны ошибок LifeHub: 403, 404, 500, потеря сети и очередь изменений в режиме без сети.",
      },
      { property: "og:title", content: "Ошибки и работа без сети — LifeHub" },
      { property: "og:description", content: "403, 404, 500, потеря связи и отложенные изменения." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ErrorStates,
});
