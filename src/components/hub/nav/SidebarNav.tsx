/**
 * Option 2 (?nav=sidebar): a shadcn-style app sidebar, in Midnight (dark) or the hub's off-white (light, ?navTheme=light).
 * Each hub group is a collapsible menu item with a line icon, and its pages hang off a left rail line as sub-items.
 * The current page sits in a darker pill with a green tick on the rail. A trigger in the footer (or Cmd/Ctrl+B)
 * collapses the sidebar to a 64px icon rail with tooltips. Trimmed after the 2026-11-13 critique: no "Sections"
 * strip, no Brand/Company tier and no user card, so the current page stays above the fold on a laptop.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  ArrowUpRight,
  Blocks,
  Building2,
  ChevronRight,
  Library,
  MessageSquareText,
  PackageOpen,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideProps,
} from "lucide-react";
import { WipTag } from "@/components/brand/WorkInProgress";
import { useAccess } from "@/hooks/use-access";
import { onSectionLinkClick } from "@/lib/hub-navigation";
import { cn } from "@/lib/utils";
import { DrawerScrim, useCollapsedGroups, useDockedWidth, useDrawerFocus, useIsDrawer, useNavKeys, useVisibleNav, type NavOptionProps } from "./shared";

const EXPANDED = 272;
const ICON_RAIL = 64;
const ICON_KEY = "hub-nav-sidebar-icon-rail";

const GROUP_ICONS: Record<string, ComponentType<LucideProps>> = {
  "Grab-and-go": PackageOpen,
  "Visual identity": Palette,
  "Verbal identity": MessageSquareText,
  "Brand systems": Blocks,
  Resources: Library,
  "Working at OG": Building2,
};

const PARENT_BASE = "group/parent flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors [@media(pointer:coarse)]:h-11";
const SUB_BASE = "relative flex h-8 w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] transition-colors [@media(pointer:coarse)]:h-11";
const TICK = "before:absolute before:-left-[13px] before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full";

/** Dark is Midnight with Groovy Green accents; light is the hub's off-white rail with #008847, since #00FF85 fails on white. */
const THEMES = {
  dark: {
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green",
    aside: "border-white/10 bg-og-midnight text-white",
    line: "border-white/10",
    rule: "bg-white/10",
    eyebrow: "text-white/55",
    groupLabel: "text-white/45",
    iconButton: "text-white/70 hover:bg-white/10 hover:text-white",
    parent: "text-white/80 hover:bg-white/[0.07] hover:text-white",
    parentActive: "text-white",
    icon: "text-white/60 group-hover/parent:text-white",
    accent: "text-og-green",
    chevron: "text-white/60",
    subList: "border-white/15",
    sub: "text-white/70 hover:bg-white/[0.07] hover:text-white",
    subActive: cn("bg-[#0B0919] font-semibold text-white ring-1 ring-white/[0.08] hover:bg-[#0B0919] before:bg-og-green", TICK),
    subDisabled: "cursor-default text-white/40 hover:bg-transparent hover:text-white/40",
    railButton: "text-white/70 hover:bg-white/[0.07] hover:text-white",
    railActive: "bg-[#0B0919] text-og-green ring-1 ring-white/[0.08]",
    name: "text-white",
    email: "text-white/55",
    avatar: "bg-og-green text-og-midnight",
  },
  light: {
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    aside: "border-border bg-[#F8F8FA] text-og-midnight",
    line: "border-og-midnight/10",
    rule: "bg-og-midnight/10",
    eyebrow: "text-og-midnight/55",
    groupLabel: "text-og-midnight/50",
    iconButton: "text-og-midnight/60 hover:bg-og-midnight/[0.06] hover:text-og-midnight",
    parent: "text-og-midnight/80 hover:bg-og-midnight/[0.05] hover:text-og-midnight",
    parentActive: "text-og-midnight",
    icon: "text-og-midnight/50 group-hover/parent:text-og-midnight",
    accent: "text-primary",
    chevron: "text-og-midnight/60",
    subList: "border-og-midnight/15",
    sub: "text-og-midnight/70 hover:bg-og-midnight/[0.05] hover:text-og-midnight",
    subActive: cn("bg-white font-semibold text-og-midnight shadow-sm ring-1 ring-og-midnight/10 hover:bg-white before:bg-primary", TICK),
    subDisabled: "cursor-default text-og-midnight/35 hover:bg-transparent hover:text-og-midnight/35",
    railButton: "text-og-midnight/60 hover:bg-og-midnight/[0.05] hover:text-og-midnight",
    railActive: "bg-white text-primary shadow-sm ring-1 ring-og-midnight/10",
    name: "text-og-midnight",
    email: "text-og-midnight/55",
    avatar: "bg-og-midnight text-og-green",
  },
} as const;

function readIconRail() {
  try {
    return window.localStorage.getItem(ICON_KEY) === "1";
  } catch {
    return false;
  }
}

/** Tooltips only speak when the sidebar is an icon rail; expanded, the label is already on screen. */
function Tip({ label, enabled, children }: { label: string; enabled: boolean; children: React.ReactElement }) {
  if (!enabled) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="right" sideOffset={10} className="z-[70] rounded-md bg-og-midnight px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/15">
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default function SidebarNav({ activeId, open, onClose, theme }: NavOptionProps) {
  const t = THEMES[theme];
  const FOCUS = t.focus;
  const PARENT = cn(PARENT_BASE, t.parent, FOCUS);
  const SUB = cn(SUB_BASE, t.sub, FOCUS);
  const SUB_ACTIVE = t.subActive;
  const navRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const { nav, isGuest, activeGroup } = useVisibleNav(activeId);
  const { collapsed, toggleGroup } = useCollapsedGroups(activeGroup);
  const onKeyDown = useNavKeys(navRef, toggleGroup);
  const isDrawer = useIsDrawer();
  useDrawerFocus(asideRef, navRef, open, activeId);
  const isAdmin = useAccess() === "admin";

  // The phone drawer is always the full sidebar; the icon rail is a desktop mode.
  const [iconRail, setIconRail] = useState(readIconRail);
  const rail = iconRail && !isDrawer;
  useDockedWidth(rail ? ICON_RAIL : EXPANDED);
  function setRail(next: boolean) {
    setIconRail(next);
    try {
      window.localStorage.setItem(ICON_KEY, next ? "1" : "0");
    } catch {
      // Storage blocked: the choice lasts for this page view.
    }
  }
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "b" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      // Leave Cmd/Ctrl+B to text fields (bold in an editor, a character in search).
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      setIconRail((value) => {
        try {
          window.localStorage.setItem(ICON_KEY, value ? "0" : "1");
        } catch {
          // Storage blocked.
        }
        return !value;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <DrawerScrim open={open} onClose={onClose} />
      <aside
        ref={asideRef}
        id="hub-section-menu"
        data-state={rail ? "collapsed" : "expanded"}
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 flex w-[284px] max-w-[85vw] flex-col border-r transition-[transform,width] duration-200 motion-reduce:transition-none lg:translate-x-0",
          t.aside,
          rail ? "lg:w-[64px]" : "lg:w-[272px]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav ref={navRef} aria-label="Brand hub sections" onKeyDown={onKeyDown} className={cn("flex-1 overflow-y-auto overscroll-contain py-3", rail ? "px-2" : "px-3")}>
          <ul className="space-y-0.5">
                {nav.map((group) => {
                  const Icon = GROUP_ICONS[group.label] ?? Library;
                  const isOpen = !collapsed.includes(group.label);
                  const holdsActive = group.label === activeGroup;
                  const listId = `sidebar-list-${group.items[0].id}`;
                  const external = group.externalLink && !isGuest ? group.externalLink : undefined;
                  if (rail) {
                    return (
                      <li key={group.label}>
                        <Tip label={group.label} enabled>
                          <button
                            type="button"
                            onClick={() => {
                              setRail(false);
                              toggleGroup(group.label, true);
                            }}
                            aria-label={holdsActive ? `${group.label}, contains the current page` : group.label}
                            className={cn(
                              "mx-auto grid size-10 place-items-center rounded-lg transition-colors",
                              t.railButton,
                              FOCUS,
                              holdsActive && t.railActive
                            )}
                          >
                            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                          </button>
                        </Tip>
                      </li>
                    );
                  }
                  return (
                    <li key={group.label} data-nav-section="">
                      <button
                        type="button"
                        data-nav-group={group.label}
                        aria-expanded={isOpen}
                        aria-controls={listId}
                        onClick={() => toggleGroup(group.label)}
                        className={cn(PARENT, holdsActive && t.parentActive)}
                      >
                        <Icon size={18} strokeWidth={1.75} aria-hidden="true" className={cn("shrink-0", holdsActive ? t.accent : t.icon)} />
                        <span className="flex-1 truncate">{group.label}</span>
                        <ChevronRight
                          size={16}
                          aria-hidden="true"
                          className={cn("shrink-0 transition-transform duration-200 motion-reduce:transition-none", t.chevron, isOpen && "rotate-90")}
                        />
                        {holdsActive && !isOpen && <span className="sr-only">, contains the current page</span>}
                      </button>
                      <ul id={listId} hidden={!isOpen} className={cn("mb-1 ml-[21px] mt-0.5 space-y-0.5 border-l pl-3", t.subList)}>
                        {external && (
                          <li>
                            <a href={external.href} target="_blank" rel="noopener noreferrer" className={cn(SUB, "group justify-between")}>
                              {external.label}
                              <ArrowUpRight size={14} aria-hidden="true" className={cn("transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px", t.accent)} />
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          </li>
                        )}
                        {group.items.map((item) => {
                          const isActive = activeId === item.id;
                          return (
                            <li key={item.id}>
                              {item.disabled ? (
                                <span aria-disabled="true" className={cn(SUB, t.subDisabled)}>
                                  <span className="flex-1 truncate">{item.label}</span>
                                  {item.wip && <WipTag />}
                                </span>
                              ) : item.path ? (
                                <Link to={item.path} onClick={onClose} aria-current={isActive ? "page" : undefined} className={cn(SUB, isActive && SUB_ACTIVE)}>
                                  <span className="flex-1 truncate">{item.label}</span>
                                  {item.wip && <WipTag />}
                                </Link>
                              ) : (
                                <Link to={`/#${item.id}`} onClick={(event) => onSectionLinkClick(event, item.id, onClose)} aria-current={isActive ? "location" : undefined} className={cn(SUB, isActive && SUB_ACTIVE)}>
                                  <span className="flex-1 truncate">{item.label}</span>
                                  {item.wip && <WipTag />}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
          </ul>
        </nav>

        {/* Footer: the collapse trigger (desktop only). The admin "Manage guests" pill floats bottom-left, so admins get room under it. */}
        <div className={cn("hidden shrink-0 border-t lg:block", t.line, rail ? "px-2 py-3" : "px-3 py-3", isAdmin && "pb-16")}>
          <Tip label="Expand sidebar" enabled={rail}>
            <button
              type="button"
              onClick={() => setRail(!rail)}
              aria-label={rail ? "Expand sidebar" : undefined}
              aria-expanded={!rail}
              className={cn("flex h-9 items-center gap-3 rounded-lg text-sm font-medium transition-colors", rail ? "mx-auto w-10 justify-center" : "w-full px-3", t.iconButton, FOCUS)}
            >
              {rail ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
              {!rail && <span>Collapse to icons</span>}
            </button>
          </Tip>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
