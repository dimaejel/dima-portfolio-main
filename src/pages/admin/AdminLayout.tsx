import { Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/certificates", label: "Certificates" },
  { to: "/admin/profile", label: "Profile" },
];

export function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-border bg-surface/70 p-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <h1 className="text-xl font-semibold">Portfolio CMS</h1>
            <p className="mt-1 text-sm text-text-secondary">Signed in as {user?.email}</p>
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to as never}
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-8 rounded-lg border border-border px-3 py-2 text-sm"
          >
            Log out
          </button>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
