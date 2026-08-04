import { createMiddleware } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

/**
 * The server-side admin gate.
 *
 * The admin surface used to be protected by <AdminGate> alone — a passphrase
 * compared in the browser against a value inlined into the client bundle, with
 * the unlocked state held in sessionStorage. None of that reaches the server,
 * so every admin server function was in practice a public, unauthenticated
 * write endpoint on /_serverFn/<id>.
 *
 * The passphrase now lives only in ADMIN_PASSWORD on the server, and the proof
 * of it is an httpOnly cookie. `requireAdmin` is attached to every admin server
 * function, so authorization is decided where it cannot be edited by the caller.
 */

export type AdminSession = { admin?: boolean };

export function adminSessionConfig() {
  return {
    password: process.env.SESSION_SECRET!,
    name: "admin-gate",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      // `lax`, never `none`: a cookie that authorizes writes must not ride
      // along on cross-site requests. See the CSRF middleware in start.ts.
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

/**
 * Fails closed. Thrown rather than returned so a handler can never accidentally
 * continue past a failed check.
 *
 * The rejection reaches serverFn callers as `Error: Unauthorized`, which is what
 * AdminGate keys off. Over raw HTTP it surfaces as a 500 rather than a 401 —
 * the Start handler does not map a thrown Error onto a status code, and routing
 * it through a Response would bypass the error middleware in start.ts. Cosmetic:
 * the request is refused either way.
 */
export const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD) {
    console.error("[admin] SESSION_SECRET and ADMIN_PASSWORD must both be set.");
    throw new Error("Unauthorized");
  }
  const session = await useSession<AdminSession>(adminSessionConfig());
  if (!session.data.admin) {
    throw new Error("Unauthorized");
  }
  return next();
});
