import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The ownable Ordergroove shape: a rounded rectangle with three rounded
 * corners and one square corner (Phase 0 audit, section 24 "Visual
 * Containers"). In multi-container layouts the hard corner should be the
 * same corner facing the same direction.
 */
export function VisualContainer({
  className,
  hardCorner = "bottom-right",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  hardCorner?: "bottom-right" | "bottom-left";
}) {
  return (
    <div
      className={cn(
        hardCorner === "bottom-left" ? "visual-container-left" : "visual-container",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
