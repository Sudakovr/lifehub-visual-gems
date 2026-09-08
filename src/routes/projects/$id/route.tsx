import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ProjectChrome } from "@/components/projects/project-chrome";

export const Route = createFileRoute("/projects/$id")({
  component: ProjectLayout,
});

function ProjectLayout() {
  const { id } = Route.useParams();
  return (
    <ProjectChrome id={id}>
      <Outlet />
    </ProjectChrome>
  );
}
