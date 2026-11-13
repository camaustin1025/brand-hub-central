/**
 * Option 1 (?nav=tree): the tree rail. Each group's links hang off a thin vertical rail that ends in a dot.
 * In the group holding the current page, a #008847 run grows down the rail to the active row and a 7px
 * diamond sits on the rail beside it. A white chip stays on the active row (it no longer follows the pointer,
 * so "you are here" never moves); hover is a light tint. Links use the 14px Midnight nav-item token.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { WipTag } from "@/components/brand/WorkInProgress";
import { onSectionLinkClick } from "@/lib/hub-navigation";
import { cn } from "@/lib/utils";
import { DrawerScrim, springEasing, useCollapsedGroups, useDockedWidth, useDrawerFocus, useNavKeys, useVisibleNav, type NavOptionProps } from "./shared";

const WIDTH = 264;
const SPRING = springEasing(0);
const GLIDE: CSSProperties = { transitionDuration: "220ms, 160ms", transitionTimingFunction: `${SPRING}, ease-out`, transitionProperty: "transform, opacity" };

const ROW =
  "relative z-10 flex min-h-8 w-full items-center gap-2 rounded-lg py-1.5 pl-3 pr-2 text-left text-sm leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight [@media(pointer:coarse)]:min-h-11";
const HEADER =
  "relative z-10 flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-og-midnight transition-colors hover:bg-og-midnight/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight [@media(pointer:coarse)]:min-h-11";

type Box = { x: number; y: number; w: number; h: number };

function boxOf(element: HTMLElement, container: HTMLElement): Box {
  const a = element.getBoundingClientRect();
  const b = container.getBoundingClientRect();
  return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
}

/** One group's list hanging off its rail, with the accent run and diamond when it holds the current page. */
function Tree({ id, hidden, activeKey, children }: { id: string; hidden: boolean; activeKey: string | null; children: ReactNode }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{ center: number; height: number } | null>(null);
  const [grown, setGrown] = useState(false);
  const measure = useCallback(() => {
    const tree = treeRef.current;
    const row = activeKey ? tree?.querySelector<HTMLElement>(`[data-tree-row="${CSS.escape(activeKey)}"]`) : null;
    if (!tree || !row || hidden) return setGeometry(null);
    const box = boxOf(row, tree);
    const next = { center: box.y + box.h / 2, height: tree.offsetHeight };
    setGeometry((current) => (current && current.center === next.center && current.height === next.height ? current : next));
  }, [activeKey, hidden]);
  useLayoutEffect(() => {
    measure();
    const tree = treeRef.current;
    if (!tree) return;
    const observer = new ResizeObserver(measure);
    observer.observe(tree);
    return () => observer.disconnect();
  }, [measure]);
  // Grow from the top on first paint, so the run reads as a path to where you are.
  const shown = geometry !== null;
  useEffect(() => {
    if (!shown) return setGrown(false);
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, [shown]);
  return (
    <div id={id} hidden={hidden} ref={treeRef} className="relative ml-2 mt-0.5 pb-2">
      {/* The rail and its dot terminal. */}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[5px] left-[7px] top-0 w-px bg-og-midnight/[0.14]" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[5px] size-[5px] rounded-full bg-og-midnight/25" />
      {geometry && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[6.75px] top-0 w-[1.5px] origin-top bg-og-green-light motion-reduce:!transition-none"
            style={{ ...GLIDE, transitionDuration: "420ms, 160ms", height: geometry.height, transform: `scaleY(${grown ? geometry.center / geometry.height : 0})` }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[4px] top-0 size-[7px] bg-og-green-light motion-reduce:!transition-none"
            style={{ ...GLIDE, transform: `translateY(${geometry.center - 3.5}px) rotate(45deg)`, opacity: grown ? 1 : 0 }}
          />
        </>
      )}
      {children}
    </div>
  );
}

export default function TreeNav({ activeId, open, onClose }: NavOptionProps) {
  const navRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const { nav, isGuest, activeGroup } = useVisibleNav(activeId);
  const { collapsed, toggleGroup } = useCollapsedGroups(activeGroup);
  const onKeyDown = useNavKeys(navRef, toggleGroup);
  useDrawerFocus(asideRef, navRef, open, activeId);
  useDockedWidth(WIDTH);

  // One chip for the whole nav: it stays on the active row, so "you are here" never moves.
  const [pill, setPill] = useState<(Box & { glide: boolean }) | null>(null);
  const target = activeId;

  const measurePill = useCallback(() => {
    const container = navRef.current;
    const row = container?.querySelector<HTMLElement>(`[data-tree-row="${CSS.escape(target)}"]`);
    if (!container || !row || row.getClientRects().length === 0) {
      setPill((current) => (current ? { ...current, w: 0, glide: false } : null));
      return;
    }
    const box = boxOf(row, container);
    // Glide only when the pill is already showing; appearing from nothing it fades in place.
    setPill((current) => ({ ...box, glide: !!current && current.w > 0 }));
  }, [target]);

  useLayoutEffect(() => {
    measurePill();
  }, [measurePill, collapsed]);
  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measurePill());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measurePill]);

  return (
    <>
      <DrawerScrim open={open} onClose={onClose} />
      <aside
        ref={asideRef}
        id="hub-section-menu"
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 w-[284px] max-w-[85vw] overflow-y-auto overscroll-contain border-r border-border bg-[#F8F8FA] transition-transform motion-reduce:transition-none lg:w-[264px] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav
          ref={navRef}
          className="relative px-4 pb-20 pt-4"
          aria-label="Brand hub sections"
          onKeyDown={onKeyDown}
        >
          {pill && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-white shadow-sm ring-1 ring-og-midnight/5 motion-reduce:!transition-none"
              style={{
                ...GLIDE,
                transitionProperty: pill.glide ? "transform, opacity" : "opacity",
                width: pill.w || undefined,
                height: pill.h,
                transform: `translate(${pill.x}px, ${pill.y}px)`,
                opacity: pill.w > 0 ? 1 : 0,
              }}
            />
          )}
          <ul className="space-y-3">
            {nav.map((group) => {
              const isOpen = !collapsed.includes(group.label);
              const listId = `tree-list-${group.items[0].id}`;
              const holdsActive = group.label === activeGroup;
              if (group.linkTitle) {
                const item = group.items[0];
                return (
                  <li key={group.label}>
                    <Link to={item.path!} onClick={onClose} aria-current={activeId === item.id ? "page" : undefined} className={HEADER}>
                      {group.label}
                    </Link>
                  </li>
                );
              }
              const external = group.externalLink && !isGuest ? group.externalLink : undefined;
              return (
                <li key={group.label}>
                  <section aria-labelledby={`tree-${group.items[0].id}`} data-nav-section="">
                    <h2 id={`tree-${group.items[0].id}`}>
                      <button
                        type="button"
                        data-nav-group={group.label}
                        aria-expanded={isOpen}
                        aria-controls={listId}
                        onClick={() => toggleGroup(group.label)}
                        className={HEADER}
                      >
                        <span className="flex items-center gap-2">
                          {group.label}
                          {holdsActive && !isOpen && <span className="size-[7px] rotate-45 bg-og-green-light" aria-hidden="true" />}
                        </span>
                        <ChevronDown
                          size={15}
                          strokeWidth={2.25}
                          aria-hidden="true"
                          className={cn("shrink-0 text-og-midnight/60 transition-transform duration-200 motion-reduce:transition-none", !isOpen && "-rotate-90")}
                        />
                        {holdsActive && !isOpen && <span className="sr-only">, contains the current page</span>}
                      </button>
                    </h2>
                    <Tree id={listId} hidden={!isOpen} activeKey={holdsActive ? activeId : null}>
                      <ul className="space-y-px pl-[18px]">
                        {external && (
                          <li>
                            <a
                              href={external.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-tree-row={`external-${group.label}`}
                              className={cn(ROW, "group font-medium text-og-midnight hover:bg-og-midnight/[0.05]")}
                            >
                              <span className="flex-1">{external.label}</span>
                              <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" className="text-og-midnight/50 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-og-green-light" />
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          </li>
                        )}
                        {group.items.map((item) => {
                          const isActive = activeId === item.id;
                          const tone = isActive ? "font-semibold text-og-midnight" : "text-og-midnight hover:bg-og-midnight/[0.05]";
                          return (
                            <li key={item.id}>
                              {item.disabled ? (
                                <span aria-disabled="true" className={cn(ROW, "cursor-default text-og-midnight/45")}>
                                  <span className="flex-1">{item.label}</span>
                                  {item.wip && <WipTag />}
                                </span>
                              ) : item.path ? (
                                <Link
                                  to={item.path}
                                  onClick={onClose}
                                  data-tree-row={item.id}
                                  aria-current={isActive ? "page" : undefined}
                                  className={cn(ROW, tone)}
                                >
                                  <span className="flex-1">{item.label}</span>
                                  {item.wip && <WipTag />}
                                </Link>
                              ) : (
                                <Link
                                  to={`/#${item.id}`}
                                  onClick={(event) => onSectionLinkClick(event, item.id, onClose)}
                                  data-tree-row={item.id}
                                  aria-current={isActive ? "location" : undefined}
                                  className={cn(ROW, tone)}
                                >
                                  <span className="flex-1">{item.label}</span>
                                  {item.wip && <WipTag />}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </Tree>
                  </section>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
