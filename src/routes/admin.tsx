import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/admin/ProtectedRoute";
import { AdminLayout } from "../pages/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: () => (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
});
