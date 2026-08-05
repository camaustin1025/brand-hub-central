import { createHash, timingSafeEqual } from "node:crypto";
import { getRequestHost, useSession } from "@tanstack/react-start/server";

import { adminSessionConfig, type AdminSession } from "@/lib/admin-session";

type GateSession = { unlocked?: boolean };

function gateSessionConfig() {
  return {
    password: process.env.SESSION_SECRET!,
    name: "site-gate",
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function isEditorPreview() {
  const hostname = getRequestHost({ xForwardedHost: true }).split(":")[0]?.toLowerCase() ?? "";
  return (
    hostname === "localhost" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname.includes("-preview--")
  );
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

function readPassword(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const password = (data as { password?: unknown }).password;
  return typeof password === "string" ? password : null;
}

export async function getSiteGateState() {
  if (isEditorPreview()) return { unlocked: true };
  const session = await useSession<GateSession>(gateSessionConfig());
  return { unlocked: Boolean(session.data.unlocked) };
}

export async function unlockSiteGate(data: unknown) {
  if (isEditorPreview()) return { ok: true as const };
  const expected = process.env.SITE_PASSWORD;
  if (!expected) throw new Error("SITE_PASSWORD is not set");
  const password = readPassword(data);
  if (password === null || !passwordMatches(password, expected)) return { ok: false as const };
  const session = await useSession<GateSession>(gateSessionConfig());
  await session.update({ unlocked: true });
  return { ok: true as const };
}

export async function lockSiteGate() {
  const session = await useSession<GateSession>(gateSessionConfig());
  await session.clear();
  return { ok: true as const };
}

export async function getAdminGateState() {
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD) return { admin: false };
  const session = await useSession<AdminSession>(adminSessionConfig());
  return { admin: Boolean(session.data.admin) };
}

export async function unlockAdminGate(data: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set");
  const password = readPassword(data);
  if (password === null || !passwordMatches(password, expected)) return { ok: false as const };
  const session = await useSession<AdminSession>(adminSessionConfig());
  await session.update({ admin: true });
  return { ok: true as const };
}

export async function lockAdminGate() {
  const session = await useSession<AdminSession>(adminSessionConfig());
  await session.clear();
  return { ok: true as const };
}