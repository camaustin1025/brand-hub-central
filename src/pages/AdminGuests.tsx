import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Guest = {
  email: string;
  full_name: string;
  company: string;
  expires_at: string;
  revoked_at: string | null;
  last_sent_at: string | null;
};

async function call(action: string, payload: Record<string, unknown> = {}) {
  const { data, error } = await supabase.functions.invoke("guest-admin", {
    body: { action, redirectTo: window.location.origin, ...payload },
  });
  if (error) {
    const ctx = (error as { context?: Response }).context;
    const msg = ctx ? (await ctx.json().catch(() => null))?.error : null;
    throw new Error(msg ?? error.message);
  }
  return data;
}

const status = (g: Guest) =>
  g.revoked_at ? "Revoked" : new Date(g.expires_at) <= new Date() ? "Expired" : "Active";

export default function AdminGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [form, setForm] = useState({ email: "", fullName: "", company: "", days: 90 });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => call("list").then((d) => setGuests(d.guests)).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);

  const run = async (action: string, payload: Record<string, unknown>, done: string) => {
    setBusy(true); setMsg(null);
    try { await call(action, payload); setMsg(done); await load(); }
    catch (e) { setMsg((e as Error).message); }
    finally { setBusy(false); }
  };

  const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

  return (
    <main className="container max-w-4xl space-y-10 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Guests</h1>
        <p className="text-foreground">Invite vendors and partners to view the hub. Guests can look but not download, and their pass ends on the date you set.</p>
      </header>

      <form
        className="grid gap-3 rounded-lg border border-border p-6 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          run("invite", form, `Invite sent to ${form.email}.`).then(() => setForm({ email: "", fullName: "", company: "", days: 90 }));
        }}
      >
        <input className={input} type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className={input} placeholder="Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className={input} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          Access for
          <input className={`${input} w-20`} type="number" min={1} max={365} value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} />
          days
        </label>
        <Button type="submit" disabled={busy} className="md:col-span-2">Send invite</Button>
      </form>

      {msg && <p role="status" className="text-sm">{msg}</p>}

      <table className="w-full text-left text-sm">
        <thead className="border-b border-border">
          <tr><th className="py-2">Guest</th><th>Status</th><th>Access until</th><th /></tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.email} className="border-b border-border">
              <td className="py-3">
                <div className="font-medium">{g.full_name || g.email}</div>
                <div className="text-muted-foreground">{g.email}{g.company && ` · ${g.company}`}</div>
              </td>
              <td>{status(g)}</td>
              <td>{new Date(g.expires_at).toLocaleDateString()}</td>
              <td className="space-x-2 text-right">
                <Button size="sm" variant="outline" disabled={busy} onClick={() => run("resend", { email: g.email }, "Link sent again.")}>Resend</Button>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => run("extend", { email: g.email }, "Access extended 90 days.")}>Extend</Button>
                {!g.revoked_at && (
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => run("revoke", { email: g.email }, "Access revoked.")}>Revoke</Button>
                )}
              </td>
            </tr>
          ))}
          {guests.length === 0 && <tr><td colSpan={4} className="py-6 text-muted-foreground">No guests yet.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
