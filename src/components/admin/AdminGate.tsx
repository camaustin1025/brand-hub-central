import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkAdmin, unlockAdmin } from "@/lib/gate.functions";

/**
 * The admin passphrase prompt.
 *
 * This used to compare the input against a `VITE_ADMIN_PASSPHRASE ?? "ordergroove"`
 * literal in the browser and record success in sessionStorage — a value that
 * shipped in the client bundle, behind a flag anyone could set from the console.
 * Both the secret and the decision now live on the server (ADMIN_PASSWORD, and
 * an httpOnly cookie), and this component only reflects that state.
 *
 * It is still only a convenience: the real protection is `requireAdmin` on the
 * server functions themselves (see lib/admin-session.ts), so hiding this UI is
 * no longer what keeps the write endpoints closed.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "session"],
    queryFn: () => checkAdmin(),
    staleTime: 0,
  });

  if (isPending) return null;

  if (!data?.admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            setError(false);
            try {
              const { ok } = await unlockAdmin({ data: { password: input } });
              if (ok) {
                setInput("");
                await qc.invalidateQueries({ queryKey: ["admin"] });
              } else {
                setError(true);
              }
            } catch {
              setError(true);
            } finally {
              setPending(false);
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
          {error && <p className="mt-2 text-xs text-destructive">Incorrect passphrase.</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
