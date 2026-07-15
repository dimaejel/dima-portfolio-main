import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ExperienceItem } from "@/types";

export function ExperienceAdmin() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [form, setForm] = useState<ExperienceItem>({ role: '', company: '', period: '', type: 'Freelance', bullets: [] });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadItems = async () => {
    const response = await api.get<ExperienceItem[]>('/api/experience');
    setItems(response);
  };

  useEffect(() => { void loadItems(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/api/experience/${editingId}`, form);
    } else {
      await api.post('/api/experience', form);
    }
    setForm({ role: '', company: '', period: '', type: 'Freelance', bullets: [] });
    setEditingId(null);
    await loadItems();
  };

  const remove = async (id: string) => {
    await api.del(`/api/experience/${id}`);
    await loadItems();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Experience</h2>
        <p className="text-sm text-text-secondary">Manage the timeline entries shown on the main page.</p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Role" value={form.role} onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Company" value={form.company} onChange={(e) => setForm((current) => ({ ...current, company: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Period" value={form.period} onChange={(e) => setForm((current) => ({ ...current, period: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Type" value={form.type} onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))} />
        <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Bullet points (one per line)" value={form.bullets.join('\n')} onChange={(e) => setForm((current) => ({ ...current, bullets: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }))} />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{editingId ? 'Update experience' : 'Add experience'}</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.role}</h3>
                <p className="text-sm text-text-secondary">{item.company}</p>
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
