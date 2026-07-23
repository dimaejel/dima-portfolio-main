import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ProfileItem } from "@/types";

export function ProfileAdmin() {
  const [form, setForm] = useState<ProfileItem>({ bio: "", location: "", website: "" });

  useEffect(() => {
    void api
      .get<{ profile: ProfileItem }>("/api/profile")
      .then(({ profile }) => setForm(profile || {}));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.put("/api/profile", form);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-sm text-text-secondary">
          Update the profile information available to authenticated users.
        </p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <textarea
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
          placeholder="Bio"
          value={form.bio || ""}
          onChange={(e) => setForm((current) => ({ ...current, bio: e.target.value }))}
        />
        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
          placeholder="Location"
          value={form.location || ""}
          onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
        />
        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
          placeholder="Website"
          value={form.website || ""}
          onChange={(e) => setForm((current) => ({ ...current, website: e.target.value }))}
        />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Save profile
        </button>
      </form>
    </div>
  );
}
