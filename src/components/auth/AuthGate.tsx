import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { consumeReturnPath, saveReturnPath } from "@/lib/auth-return-path";
import { AuthUserContext } from "@/hooks/use-auth-user";
import { AccessContext, type Access } from "@/hooks/use-access";

const DOMAIN = "ordergroove.com";

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
    return (
      <AuthUserContext.Provider value={LOCAL_PREVIEW_USER}>
        <AccessContext.Provider value="admin">{children}</AccessContext.Provider>
      </AuthUserContext.Provider>
    );
  }
  return <SignInGate>{children}</SignInGate>;
}

type Resolved = Access | "expired" | "none";

function SignInGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [access, setAccess] = useState<Resolved | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [showGuest, setShowGuest] = useState(false);

  useEffect(() => {
    const accept = async (s: Session | null) => {
      if (!s) { setSession(null); setAccess(null); setReady(true); return; }
      const { data, error: rpcError } = await supabase.rpc("my_access");
      const level = (rpcError ? "none" : data) as Resolved;
      if (level === "none") {
        setError("Only @ordergroove.com accounts and invited guests can access the brand hub.");
        await supabase.auth.signOut();
        setSession(null); setAccess(null);
      } else {
        setSession(s); setAccess(level);
        if (level !== "expired") {
          const path = consumeReturnPath();
          if (path !== null) navigate(path, { replace: true });
        }
      }
      setReady(true);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      // Defer the backend call out of the auth callback.
      setTimeout(() => accept(s), 0);
    });
    supabase.auth.getSession().then(({ data }) => accept(data.session));
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    if (params.get("error")) setError("Only @ordergroove.com accounts and invited guests can access the brand hub.");
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

  const sendGuestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    saveReturnPath();
    // shouldCreateUser: false means only emails an admin already invited get a link.
    await supabase.auth.signInWithOtp({
      email: guestEmail.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
    });
    setSent(true);
    setBusy(false);
  };

  if (!ready) return null;

  if (session && access === "expired") {
    return (
      <Screen>
        <h1 className="text-2xl font-semibold text-white">Your access has ended</h1>
        <p className="text-sm text-white">Your guest pass has expired or was turned off. Reach out to your Ordergroove contact to get access again.</p>
        <Button variant="secondary" className="w-full" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </Screen>
    );
  }

  if (session && access) {
    return (
      <AuthUserContext.Provider value={session.user}>
        <AccessContext.Provider value={access as Access}>{children}</AccessContext.Provider>
      </AuthUserContext.Provider>
    );
  }

  return (
    <Screen>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Brand Hub</h1>
        <p className="text-sm text-white">Sign in with your Ordergroove Google account.</p>
      </div>
      <Button variant="inverse" onClick={signIn} disabled={busy} className="w-full">
        {busy ? "Opening Google..." : "Continue with Google"}
      </Button>
      {/* Guests are the exception, so their sign-in is a quiet text link that opens a small form. */}
      <div className="text-sm text-white">
        {sent ? (
          <p>If that email has a guest invite, a sign-in link is on its way. Check your inbox.</p>
        ) : showGuest ? (
          <form onSubmit={sendGuestLink} className="space-y-2 text-left">
            <label htmlFor="guest-email" className="block font-medium">Guest email</label>
            <div className="flex gap-2">
              <input
                id="guest-email"
                type="email"
                required
                autoFocus
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-8 min-w-0 flex-1 rounded-full border border-white/30 bg-transparent px-4 text-sm text-white placeholder:text-white/60"
              />
              <Button type="submit" size="sm" variant="outline" disabled={busy}>Send link</Button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowGuest(true)}
            className="underline underline-offset-4 hover:text-og-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Invited guest? Sign in with email
          </button>
        )}
      </div>
      {error && <p className="text-sm text-white">{error}</p>}
    </Screen>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="dark flex min-h-screen items-center justify-center bg-og-midnight px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <img src="/logo-dark.png" alt="Ordergroove" className="mx-auto w-full max-w-xs" />
        {children}
      </div>
    </main>
  );
}
