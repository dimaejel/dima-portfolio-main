import { createFileRoute } from "@tanstack/react-router";
import { ProjectsAdmin } from "../../pages/admin/ProjectsAdmin";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsAdmin,
});
