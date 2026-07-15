import { createFileRoute } from "@tanstack/react-router";
import { CertificatesAdmin } from "../../pages/admin/CertificatesAdmin";

export const Route = createFileRoute("/admin/certificates")({
  component: CertificatesAdmin,
});
