import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The ownable Ordergroove card module. Uniform 20px radius by default
 * (matching the live site and the Carta hub). Pass `notch` to opt into the
 * signature asymmetric shape: three rounded corners + one square corner.
 */
export function VisualContainer({
  className,
  notch,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  notch?: "bottom-right" | "bottom-left";
}) {
  return (
    <div
      className={cn(
        "visual-container",
        notch === "bottom-right" && "notch-br",
        notch === "bottom-left" && "notch-bl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
