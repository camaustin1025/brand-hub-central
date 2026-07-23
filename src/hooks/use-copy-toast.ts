import { useCallback, useEffect, useRef, useState } from "react";

export type CopyResult = { text: string; ok: boolean };

/**
 * Write to the clipboard, falling back to the legacy path when the async
 * Clipboard API is denied (older browsers, and any context where the write
 * permission isn't granted). Returns false only when both routes fail.
 */
async function writeClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * Click-to-copy with a single shared confirmation toast.
 *
 * Every copyable value on a page routes through one `copy()` so the page never
 * stacks toasts; a second copy replaces the first and restarts the timer.
 * Pair with <CopyToast toast={toast} />.
 */
export function useCopyToast(duration = 1800) {
  const [toast, setToast] = useState<CopyResult | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (value: string, shownAs?: string) => {
      const ok = await writeClipboard(value);
      if (timer.current) clearTimeout(timer.current);
      setToast({ text: shownAs ?? value, ok });
      timer.current = setTimeout(() => setToast(null), ok ? duration : duration * 2);
      // GA4 hook point: track('copy_value', { value, ok })
    },
    [duration],
  );

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return { copy, toast };
}
