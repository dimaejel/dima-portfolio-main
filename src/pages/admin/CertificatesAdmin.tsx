import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { CertificateItem } from "@/types";

export function CertificatesAdmin() {
  const [items, setItems] = useState<CertificateItem[]>([]);
  const [form, setForm] = useState<CertificateItem>({ title: '', issuer: '', date: '', link: '#', gradient: 'from-slate-500 to-slate-600' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadItems = async () => {
    const response = await api.get<CertificateItem[]>('/api/certificates');
    setItems(response);
  };

  useEffect(() => { void loadItems(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/api/certificates/${editingId}`, form);
    } else {
      await api.post('/api/certificates', form);
    }
    setForm({ title: '', issuer: '', date: '', link: '#', gradient: 'from-slate-500 to-slate-600' });
    setEditingId(null);
    await loadItems();
  };

  const remove = async (id: string) => {
    await api.del(`/api/certificates/${id}`);
    await loadItems();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Certificates</h2>
        <p className="text-sm text-text-secondary">Manage the certification cards displayed publicly.</p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Issuer" value={form.issuer} onChange={(e) => setForm((current) => ({ ...current, issuer: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Date" value={form.date} onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))} />
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Link" value={form.link} onChange={(e) => setForm((current) => ({ ...current, link: e.target.value }))} />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{editingId ? 'Update certificate' : 'Add certificate'}</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.issuer} · {item.date}</p>
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
