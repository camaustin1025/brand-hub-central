import { createServerFn } from "@tanstack/react-start";
import {
  getAdminGateState,
  getSiteGateState,
  lockAdminGate,
  lockSiteGate,
  unlockAdminGate,
  unlockSiteGate,
} from "@/lib/gate.server";

export const checkUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  return getSiteGateState();
});

export const unlockSite = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    return unlockSiteGate(data);
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  return lockSiteGate();
});

/* ---------------------------------- admin --------------------------------- */

export const checkAdmin = createServerFn({ method: "GET" }).handler(async () => {
  return getAdminGateState();
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    return unlockAdminGate(data);
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  return lockAdminGate();
});
