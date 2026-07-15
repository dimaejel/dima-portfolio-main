export function OverviewAdmin() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Admin overview</h2>
        <p className="text-sm text-text-secondary">Use the sidebar to manage portfolio content.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-text-secondary">The public site reads from the CMS-backed APIs, and these admin views let you create and update projects, skills, experience, certificates, and profile content.</p>
      </div>
    </div>
  );
}
