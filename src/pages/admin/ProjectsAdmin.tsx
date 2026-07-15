import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ProjectItem } from "@/types";

export function ProjectsAdmin() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [form, setForm] = useState<ProjectItem>({ title: '', category: 'Web', description: '', techStack: [], github: '#', demo: '#', gradient: 'from-slate-500 to-slate-600' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadItems = async () => {
    const response = await api.get<ProjectItem[]>('/api/projects');
    setItems(response);
  };

  useEffect(() => { void loadItems(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { ...form, techStack: form.techStack.filter(Boolean) };
    if (editingId) {
      await api.put(`/api/projects/${editingId}`, payload);
    } else {
      await api.post('/api/projects', payload);
    }
    setForm({ title: '', category: 'Web', description: '', techStack: [], github: '#', demo: '#', gradient: 'from-slate-500 to-slate-600' });
    setEditingId(null);
    await loadItems();
  };

  const remove = async (id: string) => {
    await api.del(`/api/projects/${id}`);
    await loadItems();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-text-secondary">Create and edit featured portfolio projects.</p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))} />
        <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Tech stack (comma separated)" value={form.techStack.join(', ')} onChange={(e) => setForm((current) => ({ ...current, techStack: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="GitHub URL" value={form.github} onChange={(e) => setForm((current) => ({ ...current, github: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Demo URL" value={form.demo} onChange={(e) => setForm((current) => ({ ...current, demo: e.target.value }))} />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{editingId ? 'Update project' : 'Add project'}</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.category}</p>
              </div>
              <div className="flex gap-2">
                <button
  onClick={() => {
    setForm(item);
    setEditingId(item.id);
  }}
  className="rounded-lg border border-border px-3 py-2 text-sm"
>
  Edit
</button>
                <button onClick={() => { if (item.id) void remove(item.id); }} className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
