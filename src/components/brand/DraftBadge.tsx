import type { ReactNode } from "react";

/**
 * Marks content cleared structurally but pending a canon decision (an audit
 * D-item, or a [TO GATHER]/[OPEN] flag in the style guide). Per the project
 * rule "no Coming Soon pages", we ship real structure with an honest draft
 * marker rather than an empty placeholder.
 */
export function DraftBadge({ children = "Draft" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-og-lemon bg-og-lemon/20 px-2 py-0.5 text-[11px] font-semibold text-og-midnight dark:border-og-lemon/40 dark:bg-og-lemon/10 dark:text-og-lemon">
      {children}
    </span>
  );
}
