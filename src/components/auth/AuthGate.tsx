import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";

const DOMAIN = "ordergroove.com";
const isAllowed = (email?: string | null) =>
  !!email && email.toLowerCase().endsWith(`@${DOMAIN}`);

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s && !isAllowed(s.user.email)) {
        setError("Only @ordergroove.com accounts can access the brand hub.");
        supabase.auth.signOut();
        setSession(null);
      } else setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      if (s && !isAllowed(s.user.email)) {
        supabase.auth.signOut();
        setSession(null);
      } else setSession(s);
      setReady(true);
    });
    // Surface errors returned by the OAuth redirect (e.g. domain rejected by the backend).
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    if (params.get("error")) setError("Only @ordergroove.com accounts can access the brand hub.");
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { hd: DOMAIN, prompt: "select_account" },
    });
    if (result.error) {
      setError("Sign-in failed. Use your @ordergroove.com Google account.");
      setBusy(false);
    }
  };

  if (!ready) return null;
  if (session) return <>{children}</>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-og-midnight px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <img src="/logo-white.png" alt="Ordergroove" className="mx-auto h-8" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Brand Hub</h1>
          <p className="text-sm text-white">Sign in with your Ordergroove Google account.</p>
        </div>
        <Button onClick={signIn} disabled={busy} className="w-full">
          {busy ? "Opening Google..." : "Continue with Google"}
        </Button>
        {error && <p className="text-sm text-white">{error}</p>}
      </div>
    </main>
  );
}
