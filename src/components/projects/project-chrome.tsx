import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { AvatarGroup } from "@/components/kit/primitives";
import { ProjectStatusChip, RiskChip, TagDot } from "@/components/projects/shared";
import { getProject } from "@/mock/projects";

const tabs: { to: "/projects/$id" | "/projects/$id/tasks" | "/projects/$id/board" | "/projects/$id/files" | "/projects/$id/notes" | "/projects/$id/time" | "/projects/$id/settings"; label: string; exact?: boolean }[] = [
  { to: "/projects/$id", label: "Обзор", exact: true },
  { to: "/projects/$id/tasks", label: "Задачи" },
  { to: "/projects/$id/board", label: "Канбан" },
  { to: "/projects/$id/files", label: "Файлы" },
  { to: "/projects/$id/notes", label: "Заметки" },
  { to: "/projects/$id/time", label: "Время" },
  { to: "/projects/$id/settings", label: "Настройки" },
];

export function ProjectChrome({ id, children }: { id: string; children: React.ReactNode }) {
  const project = getProject(id);

  return (
    <AppShell>
      <div className="flex flex-col gap-lg">
        <Link
          to="/projects"
          className="inline-flex w-fit items-center gap-xs text-meta text-muted-foreground transition-fast hover:text-foreground"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} />
          Все проекты
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-lg">
          <div className="flex flex-col gap-sm">
            <div className="flex flex-wrap items-center gap-md">
              <h1 className="text-heading font-semibold text-foreground">{project.name}</h1>
              <ProjectStatusChip status={project.status} />
              <RiskChip level={project.risk} />
            </div>
            <p className="max-w-prose text-meta text-muted-foreground">{project.summary}</p>
            <div className="flex flex-wrap gap-xs">
              {project.tags.map((t) => (
                <TagDot key={t} name={t} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-md">
            <AvatarGroup names={project.members} max={4} />
            <KebabMenu
              items={[
                { label: "Изменить статус проекта" },
                { label: "Добавить участника" },
                { label: "Скопировать ссылку" },
                { label: "В архив" },
              ]}
              destructive={{ label: "Удалить проект" }}
            />
          </div>
        </div>

        <nav className="-mb-px flex max-w-full gap-lg overflow-x-auto overscroll-x-contain border-b border-border">
          {tabs.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              params={{ id }}
              activeOptions={{ exact: Boolean(t.exact) }}
              className="border-b-2 border-transparent pb-sm text-body whitespace-nowrap text-muted-foreground transition-fast hover:text-foreground"
              activeProps={{ className: "border-accent text-foreground font-medium" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="pt-md">{children}</div>
      </div>
    </AppShell>
  );
}
