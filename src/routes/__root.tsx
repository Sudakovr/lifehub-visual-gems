import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Button, buttonVariants } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-lg">
      <div className="max-w-form text-center">
        <h1 className="text-display font-semibold text-foreground">404</h1>
        <h2 className="mt-lg text-title font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-sm text-body text-muted-foreground">
          Проверьте адрес или вернитесь на главную страницу.
        </p>
        <div className="mt-xl">
          <Link
            to="/"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-lg">
      <div className="max-w-form text-center">
        <h1 className="text-title font-semibold text-foreground">
          Страница не загрузилась
        </h1>
        <p className="mt-sm text-body text-muted-foreground">
          Обновите страницу. Если ошибка повторится, вернитесь на главную.
        </p>
        <div className="mt-xl flex flex-wrap justify-center gap-sm">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Обновить страницу
          </Button>
          <a
            href="/"
            className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LifeHub — рабочее место для проектов и задач" },
      { name: "description", content: "LifeHub — система управления личными и рабочими проектами: проекты, задачи, файлы, заметки и учёт времени." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "LifeHub" },
      { property: "og:description", content: "Проекты, задачи, файлы, заметки и учёт времени в одном месте." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
