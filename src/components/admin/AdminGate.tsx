import { useEffect, useState, type ReactNode } from "react";

// TODO(auth): replace this passphrase gate with real Supabase auth + a
// has_role('admin') check before publishing. This is intentionally weak —
// the passphrase ships in the client bundle.
const KEY = "og-admin-unlocked";
const PASSPHRASE = import.meta.env.VITE_ADMIN_PASSPHRASE ?? "ordergroove";

export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUnlocked(sessionStorage.getItem(KEY) === "1");
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input === PASSPHRASE) {
              sessionStorage.setItem(KEY, "1");
              setUnlocked(true);
            } else {
              setError(true);
            }
          }}
          className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-lg"
        >
          <h1 className="text-lg font-semibold text-foreground">Admin access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the admin passphrase to continue.
          </p>
          <label
            htmlFor="admin-passphrase"
            className="mt-4 block text-sm font-medium text-foreground"
          >
            Passphrase
          </label>
          <input
            id="admin-passphrase"
            name="admin-passphrase"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Enter passphrase"
          />
          {error && (
            <p className="mt-2 text-xs text-destructive">Incorrect passphrase.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
