import { createFileRoute } from "@tanstack/react-router";
import { SkillsAdmin } from "../../pages/admin/SkillsAdmin";

export const Route = createFileRoute("/admin/skills")({
  component: SkillsAdmin,
});
