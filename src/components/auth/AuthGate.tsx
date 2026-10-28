import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { consumeReturnPath, saveReturnPath } from "@/lib/auth-return-path";
import { AuthUserContext } from "@/hooks/use-auth-user";

const DOMAIN = "ordergroove.com";
const isAllowed = (email?: string | null) =>
  !!email && email.toLowerCase().endsWith(`@${DOMAIN}`);

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
const LOCAL_PREVIEW_USER: User = {
  id: "00000000-0000-4000-8000-000000000000",
  aud: "authenticated",
  email: `local-preview@${DOMAIN}`,
  app_metadata: {},
  user_metadata: { full_name: "Local Preview" },
  created_at: "2026-01-01T00:00:00.000Z",
};

export function AuthGate({ children }: { children: ReactNode }) {
  // Lovable's Google sign-in only answers on Lovable hosting, so localhost opens as a stand-in user.
  // Production builds compile import.meta.env.DEV to false and drop this branch.
  if (import.meta.env.DEV && LOCAL_HOSTS.includes(window.location.hostname)) {
    return <AuthUserContext.Provider value={LOCAL_PREVIEW_USER}>{children}</AuthUserContext.Provider>;
  }
  return <GoogleAuthGate>{children}</GoogleAuthGate>;
}

function GoogleAuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const acceptSession = (s: Session | null) => {
      setSession(s);
      if (s) {
        const path = consumeReturnPath();
        if (path !== null) navigate(path, { replace: true });
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s && !isAllowed(s.user.email)) {
        setError("Only @ordergroove.com accounts can access the brand hub.");
        supabase.auth.signOut();
        setSession(null);
      } else acceptSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      if (s && !isAllowed(s.user.email)) {
        supabase.auth.signOut();
        setSession(null);
      } else acceptSession(s);
      setReady(true);
    });
    // Surface errors returned by the OAuth redirect (e.g. domain rejected by the backend).
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    if (params.get("error")) setError("Only @ordergroove.com accounts can access the brand hub.");
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    try {
      saveReturnPath();
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: { hd: DOMAIN, prompt: "select_account" },
      });
      if (result.error) throw result.error;
    } catch {
      setError("Sign-in failed. Use your @ordergroove.com Google account.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return null;
  if (session) return <AuthUserContext.Provider value={session.user}>{children}</AuthUserContext.Provider>;

  return (
    <main className="dark flex min-h-screen items-center justify-center bg-og-midnight px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <img src="/logo-dark.png" alt="Ordergroove" className="mx-auto w-full max-w-xs" />
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
