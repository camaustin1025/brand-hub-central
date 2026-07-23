import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import type { CopyResult } from "@/hooks/use-copy-toast";

/**
 * The copy confirmation: a Midnight pill against the bottom of the viewport.
 * Driven by `useCopyToast` (src/hooks/use-copy-toast.ts).
 */
export function CopyToast({ toast }: { toast: CopyResult | null }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-7 z-100 flex justify-center px-4"
    >
      {toast && (
        <div className="flex items-center gap-2 rounded-full bg-og-midnight px-5 py-2.5 text-sm font-medium text-white shadow-2xl shadow-og-midnight/20">
          {toast.ok ? (
            <>
              <MaterialSymbol name="check_circle" size={17} className="text-og-green" />
              Copied {toast.text}
            </>
          ) : (
            <>
              <MaterialSymbol name="error" size={17} className="text-destructive" />
              Your browser blocked the copy. Select {toast.text} by hand.
            </>
          )}
        </div>
      )}
    </div>
  );
}
