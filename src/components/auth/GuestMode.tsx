import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccess } from "@/hooks/use-access";

/** Flags the page for guest-only styles and shows who is viewing. */
export function GuestMode() {
  const access = useAccess();
  useEffect(() => {
    const root = document.documentElement;
    if (access === "guest") root.setAttribute("data-guest", "");
    else root.removeAttribute("data-guest");
  }, [access]);

  if (access === "guest") {
    return (
      <div className="fixed bottom-4 left-4 z-[60] rounded-full bg-og-midnight px-4 py-2 text-xs font-semibold text-white shadow-lg">
        Guest view
      </div>
    );
  }
  if (access === "admin") {
    return (
      <Link to="/admin/guests" className="fixed bottom-4 left-4 z-[60] rounded-full bg-og-midnight px-4 py-2 text-xs font-semibold text-white shadow-lg">
        Manage guests
      </Link>
    );
  }
  return null;
}
