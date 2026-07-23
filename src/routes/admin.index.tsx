import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listAssetsAdmin, listCategoriesAdmin } from "@/lib/admin-assets.functions";
import { Package, FolderTree, EyeOff } from "lucide-react";

const assetsOpts = queryOptions({
  queryKey: ["admin", "assets"],
  queryFn: () => listAssetsAdmin(),
});
const catsOpts = queryOptions({
  queryKey: ["admin", "categories"],
  queryFn: () => listCategoriesAdmin(),
});

export const Route = createFileRoute("/admin/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(assetsOpts);
    context.queryClient.ensureQueryData(catsOpts);
  },
  component: Dashboard,
});

function Dashboard() {
  const { data: assets } = useSuspenseQuery(assetsOpts);
  const { data: cats } = useSuspenseQuery(catsOpts);

  const unpublished = assets.filter((a) => !a.is_published).length;
  const recent = [...assets]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);

  const stats = [
    { label: "Assets", value: assets.length, icon: Package },
    { label: "Categories", value: cats.length, icon: FolderTree },
    { label: "Unpublished", value: unpublished, icon: EyeOff },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the brand asset library.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon size={16} className="text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Recent updates</h2>
          <Link to="/admin/assets" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No assets yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <Link
                    to="/admin/assets/$id"
                    params={{ id: a.id }}
                    className="text-sm font-medium text-foreground hover:text-primary"
                  >
                    {a.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {a.category_label ?? "Uncategorized"} · {a.type}
                    {!a.is_published && " · unpublished"}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(a.updated_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
