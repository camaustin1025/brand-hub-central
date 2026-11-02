import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const DAY = 86_400_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const { data: userData } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (!user) return json({ error: "Not signed in" }, 401);
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) return json({ error: "Admins only" }, 403);

  const body = await req.json().catch(() => ({}));
  const { action } = body as { action?: string };
  const redirectTo = typeof body.redirectTo === "string" ? body.redirectTo : undefined;

  const send = async (email: string) => {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const exists = list?.users.some((u) => u.email?.toLowerCase() === email);
    if (!exists) {
      const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
      if (error) throw error;
    } else {
      const anon = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { error } = await anon.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } });
      if (error) throw error;
    }
    await admin.from("guest_invites").update({ last_sent_at: new Date().toISOString() }).eq("email", email);
  };

  try {
    if (action === "list") {
      const { data, error } = await admin.from("guest_invites").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return json({ guests: data });
    }
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Enter a valid email" }, 400);

    if (action === "invite") {
      if (email.endsWith("@ordergroove.com")) return json({ error: "Ordergroove staff sign in with Google, no invite needed" }, 400);
      const days = Math.min(Math.max(Number(body.days) || 90, 1), 365);
      const { error } = await admin.from("guest_invites").upsert({
        email,
        full_name: String(body.fullName ?? ""),
        company: String(body.company ?? ""),
        invited_by: user.id,
        expires_at: new Date(Date.now() + days * DAY).toISOString(),
        revoked_at: null,
      }, { onConflict: "email" });
      if (error) throw error;
      await send(email);
      return json({ ok: true });
    }
    if (action === "resend") { await send(email); return json({ ok: true }); }
    if (action === "extend") {
      const { error } = await admin.from("guest_invites")
        .update({ expires_at: new Date(Date.now() + 90 * DAY).toISOString(), revoked_at: null }).eq("email", email);
      if (error) throw error;
      return json({ ok: true });
    }
    if (action === "revoke") {
      const { error } = await admin.from("guest_invites").update({ revoked_at: new Date().toISOString() }).eq("email", email);
      if (error) throw error;
      return json({ ok: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Something went wrong" }, 500);
  }
});
