/** Loads one nav option on demand, so each option's code stays in its own chunk. */
import { lazy, Suspense } from "react";
import type { NavOption } from "./options";
import type { NavOptionProps } from "./shared";

const OPTIONS = {
  tree: lazy(() => import("./TreeNav")),
  sidebar: lazy(() => import("./SidebarNav")),
  framer: lazy(() => import("./FramerNav")),
};

export default function NavOptionHost({ option, ...props }: NavOptionProps & { option: Exclude<NavOption, "rail" | "highlight"> }) {
  const Option = OPTIONS[option];
  return (
    <Suspense fallback={null}>
      <Option {...props} />
    </Suspense>
  );
}
