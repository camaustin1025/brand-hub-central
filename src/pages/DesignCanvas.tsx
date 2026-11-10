import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { buttonVariants } from "@/components/ui/button";
import { DESIGN_CANVAS_CATEGORIES, DESIGN_CANVAS_NAV_ID, designCanvasTemplatePath } from "@/data/hub";
import { SOCIAL_ASSETS } from "@/data/social-templates";
import { MarketingContact } from "@/components/social/MarketingContact";
import { useAuthUser } from "@/hooks/use-auth-user";
import { hasSocialDraft } from "@/lib/social-drafts";
import { cn } from "@/lib/utils";

const templates = DESIGN_CANVAS_CATEGORIES.flatMap((group) => group.templates);
const categoryIds = DESIGN_CANVAS_CATEGORIES.map((group) => group.id);

export default function DesignCanvas() {
  const user = useAuthUser();
  const requestedId = useLocation().hash.slice(1);
  const [draftTemplates, setDraftTemplates] = useState<Set<string>>(new Set());
  useEffect(() => {
    let active = true;
    setDraftTemplates(new Set());
    if (user) {
      const ids = templates.map((template) => template.id);
      void Promise.all(ids.map(async (id) => await hasSocialDraft(user.id, id) ? id : null)).then((found) => {
        if (active) setDraftTemplates(new Set(found.filter((id): id is string => !!id)));
      }).catch(() => {});
    }
    return () => { active = false; };
  }, [user]);
  // The editor breadcrumb links to a category hash: land on that category.
  useEffect(() => {
    if (categoryIds.includes(requestedId)) document.getElementById(requestedId)?.scrollIntoView({ block: "start" });
  }, [requestedId]);
  return (
    <HubShell activeId={DESIGN_CANVAS_NAV_ID}>
      <ChapterPage navId={DESIGN_CANVAS_NAV_ID} updated="2026-10-29" title="Design canvas" intro="Pick a design, add your photo and details, then download a PNG for LinkedIn.">
        <div className="space-y-12">
          {DESIGN_CANVAS_CATEGORIES.map(({ id, category, templates: entries }) => (
            <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
              <h2 id={`${id}-heading`} className="mb-5 text-2xl font-bold">{category}</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((template) => (
                  <div key={template.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-white">
                    {template.previewAssetId && <img src={SOCIAL_ASSETS[template.previewAssetId]} alt={`${template.title} design preview`} width={template.width} height={template.height} className="h-auto w-full" />}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{template.title}</h3>
                      </div>
                      <Link to={designCanvasTemplatePath(template.id)} className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                        {draftTemplates.has(template.id) ? "Continue draft" : "Customize graphic"} <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-10"><MarketingContact /></div>
      </ChapterPage>
    </HubShell>
  );
}
