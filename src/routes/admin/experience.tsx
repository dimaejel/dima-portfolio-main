import { createFileRoute } from "@tanstack/react-router";
import { ExperienceAdmin } from "../../pages/admin/ExperienceAdmin";

export const Route = createFileRoute("/admin/experience")({
  component: ExperienceAdmin,
});
