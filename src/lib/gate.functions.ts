import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { adminSessionConfig, type AdminSession } from "@/lib/admin-session";

type GateSession = { unlocked?: boolean };

function getSessionConfig() {
  return {
    password: process.env.SESSION_SECRET!,
    name: "site-gate",
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: true,
      // `lax`, not `none`. Under `none` this cookie was attached to cross-site
      // requests, so any external page could drive an authenticated serverFn
      // call in a visitor's browser. Nothing here is embedded cross-origin, so
      // `lax` costs nothing and closes that door.
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/**
 * These are unauthenticated public endpoints, so the payload is whatever the
 * caller sent. Hashing a non-string throws inside node:crypto and surfaces as a
 * 500 error page rather than a clean auth failure, so narrow the type here and
 * let a bad shape fall through to the normal "wrong password" answer.
 */
function readPassword(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const password = (data as { password?: unknown }).password;
  return typeof password === "string" ? password : null;
}

export const checkUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  return { unlocked: Boolean(session.data.unlocked) };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.SITE_PASSWORD;
    if (!expected) throw new Error("SITE_PASSWORD is not set");
    const password = readPassword(data);
    if (password === null || !passwordMatches(password, expected)) {
      return { ok: false as const };
    }
    const session = await useSession<GateSession>(getSessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  await session.clear();
  return { ok: true as const };
});

/* ---------------------------------- admin --------------------------------- */

export const checkAdmin = createServerFn({ method: "GET" }).handler(async () => {
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD) return { admin: false };
  const session = await useSession<AdminSession>(adminSessionConfig());
  return { admin: Boolean(session.data.admin) };
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    const password = readPassword(data);
    if (password === null || !passwordMatches(password, expected)) {
      return { ok: false as const };
    }
    const session = await useSession<AdminSession>(adminSessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig());
  await session.clear();
  return { ok: true as const };
});
