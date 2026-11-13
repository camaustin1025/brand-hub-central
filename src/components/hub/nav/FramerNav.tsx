/**
 * Option 3 (?nav=framer): after Framer's "Sidebar Navigation" component. A full-height dark panel with quiet
 * section labels and big, bold links; hovering a link slides a square arrow tile in from the left on a
 * slightly bouncy spring (0.4s, bounce 0.2). In Ordergroove dress: Midnight panel, white tile on hover,
 * Groovy Green tile for the page you are on, and the external Product Hub link as the panel's one pill button.
 */
import { useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { WipTag } from "@/components/brand/WorkInProgress";
import { useAccess } from "@/hooks/use-access";
import { cn } from "@/lib/utils";
import { DrawerScrim, springEasing, useChooseSection, useDockedWidth, useDrawerFocus, useNavKeys, useVisibleNav, type NavOptionProps } from "./shared";

const WIDTH = 288;
const BOUNCY: CSSProperties = { transitionProperty: "transform, opacity", transitionDuration: "520ms, 200ms", transitionTimingFunction: `${springEasing(0.2)}, ease-out` };

const LINK =
  "group/link relative flex min-h-9 w-full items-center gap-2 rounded-md py-1 pl-11 pr-2 text-left text-[17px] font-bold leading-6 tracking-[-0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green [@media(pointer:coarse)]:min-h-11";

/** The square arrow tile: hidden and tucked left at rest, springs in on hover or focus, stays lit on the current page. */
function Tile({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={BOUNCY}
      className={cn(
        "absolute left-2 top-1/2 -mt-[13px] grid size-[26px] place-items-center rounded-[4px] motion-reduce:!transition-none",
        active
          ? "translate-x-0 bg-og-green text-og-midnight opacity-100"
          : "-translate-x-3 bg-white text-og-midnight opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100"
      )}
    >
      <ArrowUpRight size={16} strokeWidth={2.25} />
    </span>
  );
}

function Label({ children, active }: { children: ReactNode; active: boolean }) {
  return (
    <span
      style={BOUNCY}
      className={cn(
        "flex-1 motion-reduce:!transition-none",
        active ? "text-white" : "text-white/70 group-hover/link:translate-x-0.5 group-hover/link:text-white"
      )}
    >
      {children}
    </span>
  );
}

export default function FramerNav({ activeId, open, onClose }: NavOptionProps) {
  const navRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const { nav, isGuest } = useVisibleNav(activeId);
  const chooseSection = useChooseSection(onClose);
  // Framer's panel has no folding groups, so Left and Right have nothing to do here; Up, Down, Home and End still move.
  const onKeyDown = useNavKeys(navRef);
  useDrawerFocus(asideRef, navRef, open);
  useDockedWidth(WIDTH);
  const isAdmin = useAccess() === "admin";
  const external = isGuest ? undefined : nav.find((group) => group.externalLink)?.externalLink;

  return (
    <>
      <DrawerScrim open={open} onClose={onClose} />
      <aside
        ref={asideRef}
        id="hub-section-menu"
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 flex w-[288px] max-w-[85vw] flex-col bg-og-midnight text-white transition-transform motion-reduce:transition-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav ref={navRef} aria-label="Brand hub sections" onKeyDown={onKeyDown} className="flex-1 overflow-y-auto overscroll-contain px-3 pb-6 pt-7">
          <ul className="space-y-6">
            {nav.map((group) => (
              <li key={group.label}>
                <h2 className="mb-1.5 pl-11 text-[13px] font-semibold text-white/50">{group.label}</h2>
                <ul>
                  {group.items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        {item.disabled ? (
                          <span aria-disabled="true" className={cn(LINK, "cursor-default text-white/35")}>
                            <span className="flex-1">{item.label}</span>
                            {item.wip && <WipTag />}
                          </span>
                        ) : item.path ? (
                          <Link to={item.path} onClick={onClose} aria-current={isActive ? "page" : undefined} className={LINK}>
                            <Tile active={isActive} />
                            <Label active={isActive}>{item.label}</Label>
                            {item.wip && <WipTag />}
                          </Link>
                        ) : (
                          <button type="button" onClick={() => chooseSection(item.id)} aria-current={isActive ? "location" : undefined} className={LINK}>
                            <Tile active={isActive} />
                            <Label active={isActive}>{item.label}</Label>
                            {item.wip && <WipTag />}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        {/* Framer's top-bar "Contact" pill, here the one way out to another internal site. */}
        {external && (
          <div className={cn("shrink-0 border-t border-white/10 px-5 py-4", isAdmin && "pb-16")}>
            <a
              href={external.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white px-5 text-[13px] font-semibold text-og-midnight transition-colors hover:bg-og-midnight hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green focus-visible:ring-offset-2 focus-visible:ring-offset-og-midnight"
            >
              {external.label}
              <ArrowUpRight size={15} strokeWidth={2.25} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
