import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { SkillGroupItem } from "@/types";

export function SkillsAdmin() {
  const [items, setItems] = useState<SkillGroupItem[]>([]);
  const [form, setForm] = useState<SkillGroupItem>({ title: "", skills: [] });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadItems = async () => {
    const response = await api.get<SkillGroupItem[]>("/api/skills");
    setItems(response);
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/api/skills/${editingId}`, form);
    } else {
      await api.post("/api/skills", form);
    }
    setForm({ title: "", skills: [] });
    setEditingId(null);
    await loadItems();
  };

  const remove = async (id: string) => {
    await api.del(`/api/skills/${id}`);
    await loadItems();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-text-secondary">
          Manage skill groups shown on the public portfolio.
        </p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
          placeholder="Group title"
          value={form.title}
          onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
        />
        <textarea
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
          placeholder='Example: [{"name":"Java","badge":"Jv","color":"#F89820"}]'
          value={JSON.stringify(form.skills, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);

              if (Array.isArray(parsed)) {
                setForm((current) => ({
                  ...current,
                  skills: parsed,
                }));
              }
            } catch {
              // Wait until the user finishes writing valid JSON
            }
          }}
        />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {editingId ? "Update group" : "Add group"}
        </button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.skills.length} skills</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm(item);
                    setEditingId(item.id ?? null);
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (item.id) void remove(item.id);
                  }}
                  className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
