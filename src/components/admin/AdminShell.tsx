import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, FolderTree, ExternalLink, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/assets", label: "Assets", icon: Package, exact: false },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
] as const;

export function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-border px-5">
          <span className="text-sm font-semibold text-foreground">Brand Hub Admin</span>
        </div>
        <nav className="flex-1 p-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink size={16} />
            View site
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("og-admin-unlocked");
              window.location.reload();
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut size={16} />
            Lock admin
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
