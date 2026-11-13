export function jumpTo(id: string, closeMenu?: () => void) {
  const target = document.getElementById(id);
  if (!target) {
    window.location.assign("/#" + id);
    return;
  }
  window.history.replaceState(null, "", "#" + id);
  target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  if (id.startsWith("asset-")) target.focus({ preventScroll: true });
  closeMenu?.();
}

/**
 * Desktop: when the current page's nav item sits outside its scrolling rail (a short laptop screen,
 * a tall nav), scroll that rail, and only that rail, so the item shows near the middle.
 */
export function revealCurrent(nav: HTMLElement | null) {
  const current = nav?.querySelector<HTMLElement>("[aria-current]");
  if (!current || !current.offsetParent) return;
  let box: HTMLElement | null = current.parentElement;
  while (box && box !== document.body && !(box.scrollHeight > box.clientHeight && /(auto|scroll)/.test(getComputedStyle(box).overflowY))) {
    box = box.parentElement;
  }
  if (!box || box === document.body) return;
  const item = current.getBoundingClientRect();
  const rail = box.getBoundingClientRect();
  const pad = 24;
  if (item.top >= rail.top + pad && item.bottom <= rail.bottom - pad) return;
  box.scrollTop += item.top - rail.top - (rail.height - item.height) / 2;
}

/** The skip link: move focus to the page's main content without touching the URL or the router. */
export function skipToContent(event: { preventDefault: () => void }) {
  const main = document.getElementById("content");
  if (!main) return;
  event.preventDefault();
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: "start" });
}
