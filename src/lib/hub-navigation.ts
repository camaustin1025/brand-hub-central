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
