import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AssetForm } from "@/components/admin/AssetForm";

export const Route = createFileRoute("/admin/assets/new")({
  component: NewAsset,
});

function NewAsset() {
  const navigate = useNavigate();
  return (
    <div>
      <Link
        to="/admin/assets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to assets
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">New asset</h1>

      <div className="mt-6 rounded-xl border border-border bg-white p-6">
        <AssetForm
          initial={{
            slug: "",
            title: "",
            description: "",
            category_id: null,
            type: "logo",
            formats: [],
            tags: [],
            storage_path: null,
            preview_path: null,
            preview_bg: null,
            is_published: true,
            sort_order: 100,
          }}
          onSaved={(id) => navigate({ to: "/admin/assets/$id", params: { id } })}
        />
      </div>
    </div>
  );
}
