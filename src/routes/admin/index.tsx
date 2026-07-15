import { createFileRoute } from "@tanstack/react-router";
import { OverviewAdmin } from "../../pages/admin/OverviewAdmin";

export const Route = createFileRoute("/admin/")({
  component: OverviewAdmin,
});
