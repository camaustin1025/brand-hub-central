/**
 * Shared plumbing for the navigation options (?nav=tree | sidebar | framer).
 * Every option reads the same nav data, hides the same items, keeps the same keyboard model,
 * and opens as the same inert-aware drawer below 1024px as the default rail in HubShell.
 */
import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";
import { HUB_NAV, isGuestPath, type HubNavGroup } from "@/data/hub";
import { revealCurrent } from "@/lib/hub-navigation";
import { useAccess } from "@/hooks/use-access";
import type { NavTheme } from "./options";

export type NavOptionProps = { activeId: string; open: boolean; onClose: () => void; theme: NavTheme };

/** The visible nav: guests see Home sections only; disabled and hidden (WIP) items never show. */
export function useVisibleNav(activeId: string) {
  const isGuest = useAccess() === "guest";
  const nav: HubNavGroup[] = isGuest
    ? HUB_NAV.map((group) => ({ ...group, items: group.linkTitle ? [] : group.items.filter((item) => !item.disabled && !item.hiddenInNav && isGuestPath(item.path)) })).filter((group) => group.items.length > 0)
    : HUB_NAV.map((group) => ({ ...group, items: group.items.filter((item) => !item.hiddenInNav) })).filter((group) => group.items.length > 0);
  const activeGroup = nav.find((group) => group.items.some((item) => item.id === activeId))?.label;
  return { nav, isGuest, activeGroup };
}

/** Folded groups, shared with the default rail (same storage key) so a reader's choice carries across options. */
const COLLAPSED_KEY = "hub-nav-collapsed";
function readCollapsed(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(COLLAPSED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
  } catch {
    return [];
  }
}
function writeCollapsed(labels: string[]) {
  try {
    window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(labels));
  } catch {
    // Storage blocked: groups still fold, they just aren't remembered.
  }
}

export function useCollapsedGroups(activeGroup: string | undefined) {
  // The group you are in always opens, so the active page is never folded out of sight.
  const [collapsed, setCollapsed] = useState<string[]>(() => readCollapsed().filter((label) => label !== activeGroup));
  function toggleGroup(label: string, force?: boolean) {
    setCollapsed((current) => {
      const isOpen = !current.includes(label);
      const nextOpen = force ?? !isOpen;
      const next = nextOpen ? current.filter((entry) => entry !== label) : [...current, label];
      writeCollapsed(next);
      return next;
    });
  }
  return { collapsed, toggleGroup };
}

/** True below 1024px, where the nav is an off-canvas drawer. */
export function useIsDrawer() {
  const [isDrawer, setIsDrawer] = useState(() => typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDrawer(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isDrawer;
}

/** Every control a keyboard user can reach in the nav, in order, skipping folded groups. */
export function navControls(nav: HTMLElement) {
  return [...nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter((element) => element.getClientRects().length > 0);
}

/** Drawer behavior from the default rail: inert while closed off screen, focus to the current page on open. */
export function useDrawerFocus(asideRef: RefObject<HTMLElement>, navRef: RefObject<HTMLElement>, open: boolean, activeId?: string) {
  const isDrawer = useIsDrawer();
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    if (isDrawer && !open) aside.setAttribute("inert", "");
    else aside.removeAttribute("inert");
  }, [asideRef, isDrawer, open]);
  useEffect(() => {
    if (!open || !isDrawer || !navRef.current) return;
    const current = navRef.current.querySelector<HTMLElement>("[aria-current]") ?? navControls(navRef.current)[0];
    current?.focus({ preventScroll: true });
    current?.scrollIntoView({ block: "center" });
  }, [navRef, open, isDrawer]);
  // Desktop: keep the current page in view inside the rail on arrival and on every page change.
  useEffect(() => {
    if (isDrawer) return;
    const frame = requestAnimationFrame(() => revealCurrent(navRef.current));
    return () => cancelAnimationFrame(frame);
  }, [navRef, isDrawer, activeId]);
  return isDrawer;
}

/** The default rail's keys: Up/Down move, Home/End jump, Right/Left unfold/fold a group header, Left from a link goes to its header. */
export function useNavKeys(navRef: RefObject<HTMLElement>, toggleGroup?: (label: string, force?: boolean) => void) {
  return function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!navRef.current) return;
    const target = event.target as HTMLElement;
    const controls = navControls(navRef.current);
    const index = controls.indexOf(target);
    if (index < 0) return;
    const header = target.dataset.navGroup;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = (index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) % controls.length;
      controls[next].focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      controls[event.key === "Home" ? 0 : controls.length - 1].focus();
    } else if (header && toggleGroup && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      toggleGroup(header, event.key === "ArrowRight");
    } else if (event.key === "ArrowLeft") {
      const owner = target.closest<HTMLElement>("[data-nav-section]")?.querySelector<HTMLElement>("[data-nav-group]");
      if (owner) {
        event.preventDefault();
        owner.focus();
      }
    }
  };
}


/** Publishes the docked nav width so <main> stays offset by exactly the nav (see HubShell). */
export function useDockedWidth(px: number) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--hub-nav-w", `${px}px`);
    return () => {
      root.style.removeProperty("--hub-nav-w");
    };
  }, [px]);
}

/** The blurred Midnight scrim behind the phone drawer, as in the default rail. */
export function DrawerScrim({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <button
      className="fixed inset-0 top-16 z-30 bg-og-midnight/35 backdrop-blur-sm lg:hidden"
      aria-label="Close section menu"
      tabIndex={-1}
      onClick={onClose}
    />
  );
}

/**
 * CSS easing that traces a damped spring, so transform and opacity transitions glide like
 * motion/react springs without adding the library. bounce 0 is critically damped.
 */
export function springEasing(bounce: number) {
  const zeta = Math.max(0.05, 1 - bounce);
  const steps = 32;
  // Settle span: about 6.6 time constants for a critically damped spring, longer as bounce grows.
  const span = zeta >= 1 ? 6.6 : 6.6 / zeta;
  const points: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * span;
    let x: number;
    if (zeta >= 1) {
      x = 1 - (1 + t) * Math.exp(-t);
    } else {
      const wd = Math.sqrt(1 - zeta * zeta);
      x = 1 - Math.exp(-zeta * t) * (Math.cos(wd * t) + (zeta / wd) * Math.sin(wd * t));
    }
    points.push(i === steps ? "1" : x.toFixed(4));
  }
  return `linear(${points.join(", ")})`;
}
