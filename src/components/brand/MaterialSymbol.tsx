import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * A single Material Symbols glyph — the ratified Ordergroove icon set
 * (Weight 300, Fill Off, Grade Normal; see audit D12).
 *
 * Decorative by default. Pass a `label` when the glyph carries meaning no
 * neighbouring text already provides.
 */
export function MaterialSymbol({
  name,
  size = 20,
  className,
  style,
  label,
}: {
  /** Glyph name, e.g. "menu_book". */
  name: string;
  /** Rendered size in px. Matches the optical size axis closely enough at 16-40. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{ fontSize: size, ...style }}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {name}
    </span>
  );
}
