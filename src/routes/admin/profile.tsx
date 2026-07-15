import { createFileRoute } from "@tanstack/react-router";
import { ProfileAdmin } from "../../pages/admin/ProfileAdmin";

export const Route = createFileRoute("/admin/profile")({
  component: ProfileAdmin,
});
