import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { HUB_NAV, HUB_SECTIONS, type HubNavItem } from "@/data/hub";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

function HubLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: HubNavItem;
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      to={item.path}
      hash={item.hash}
      onClick={onNavigate}
      aria-current={active ? "location" : undefined}
      className={cn(
        "flex min-h-11 items-center border-l-2 transition-colors",
        collapsed ? "justify-center" : "gap-3 px-3",
        active
          ? "border-primary bg-white/8 font-semibold text-og-green"
          : "border-transparent text-white/72 hover:bg-white/6 hover:text-white",
      )}
    >
      <MaterialSymbol name={item.icon} size={collapsed ? 22 : 20} className="shrink-0" />
      {!collapsed && <span className="min-w-0 flex-1 text-body">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function HubNavTree({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const active = useActiveSection(HUB_SECTIONS);

  return (
    <nav aria-label="Brand hub sections" className="flex flex-col py-3">
      {HUB_NAV.map((group, groupIndex) => (
        <div
          key={group.label}
          className={cn(
            groupIndex > 0 && (collapsed ? "mt-1 border-t border-white/12 pt-1" : "mt-3"),
          )}
        >
          {!collapsed && (
            <p className="px-3 pb-1.5 pt-1 text-eyebrow font-bold uppercase text-primary">
              {group.label}
            </p>
          )}
          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                <HubLink
                  item={item}
                  active={item.path === "/" && active === item.hash}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function HubRail() {
  const [narrow, setNarrow] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const pinned = narrow || userCollapsed;
  const collapsed = pinned && !hovered;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 80rem)");
    const sync = () => setNarrow(!mq.matches);
    sync();
    try {
      setUserCollapsed(localStorage.getItem("og-sidenav") === "icon");
    } catch {
      // The rail still works when storage is blocked.
    }
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (pinned) document.documentElement.dataset.sidenav = "icon";
    else delete document.documentElement.dataset.sidenav;
  }, [pinned]);

  function toggle() {
    const next = !userCollapsed;
    setUserCollapsed(next);
    try {
      localStorage.setItem("og-sidenav", next ? "icon" : "full");
    } catch {
      // The preference is optional.
    }
  }

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        className="sticky top-[var(--stick)] hidden h-[calc(100dvh-var(--stick))] w-[var(--sidenav)] shrink-0 md:block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(false);
        }}
      >
        <div
          className={cn(
            "dark absolute inset-y-0 left-0 z-50 flex flex-col border-r border-white/12 bg-og-midnight transition-[width] duration-200",
            collapsed ? "w-[var(--sidenav-icon)]" : "w-[var(--sidenav-full)]",
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <HubNavTree collapsed={collapsed} />
          </div>
          {!narrow && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={!userCollapsed}
              aria-label={userCollapsed ? "Pin navigation open" : "Collapse navigation to icons"}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 border-t border-white/12 px-3 text-eyebrow font-bold uppercase text-white/70 transition-colors hover:bg-white/6 hover:text-white",
                collapsed && "justify-center px-0",
              )}
            >
              <MaterialSymbol
                name={userCollapsed ? "right_panel_open" : "left_panel_close"}
                size={20}
              />
              {!collapsed && (userCollapsed ? "Pin open" : "Collapse")}
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export function HubDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open section navigation"
        className="flex size-11 items-center justify-center border border-white/24 text-white transition-colors hover:border-primary md:hidden"
      >
        <MaterialSymbol name="menu" size={22} />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="dark top-[var(--stick)] h-[calc(100dvh-var(--stick))] w-[18rem] border-white/12 bg-og-midnight p-0 text-white"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Brand hub navigation</SheetTitle>
          <SheetDescription>Find an overview, guideline, asset, or tool.</SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-y-auto pt-6">
          <HubNavTree onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
