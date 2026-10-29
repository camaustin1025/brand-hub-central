import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { buttonVariants } from "@/components/ui/button";
import { TOOLKIT_ITEMS } from "@/data/hub";
import { publishedSocialTemplates, SOCIAL_ASSETS, type SocialTemplate } from "@/data/social-templates";
import { MarketingContact } from "@/components/social/MarketingContact";
import { useAuthUser } from "@/hooks/use-auth-user";
import { hasSocialDraft } from "@/lib/social-drafts";
import { cn } from "@/lib/utils";

const templates = publishedSocialTemplates();
const categories = new Map<string, SocialTemplate[]>();
for (const template of templates) {
  if (!categories.has(template.category)) categories.set(template.category, []);
  categories.get(template.category)!.push(template);
}

export default function Toolkit() {
  const user = useAuthUser();
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
  return (
    <HubShell activeId="toolkit">
      <ChapterPage title="GTM & employee toolkit" intro="Resources for day-to-day work.">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLKIT_ITEMS.filter((item) => !item.templateId && item.href && (item.action === "internal" || !item.status)).map((item) => (
            <div key={item.title} className="flex min-h-56 flex-col rounded-lg border border-border bg-white p-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="measure mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
              {item.action === "internal" ? (
                <Link to={item.href!} className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                  {item.cta} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <a href={item.href!} download className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                  {item.cta} <Download size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          ))}
        </div>
        {[...categories].map(([category, entries], index) => (
          <section key={category} id={`social-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} aria-labelledby={`social-category-${index}`} className="mt-10 scroll-mt-24">
            <h2 id={`social-category-${index}`} className="mb-5 text-2xl font-bold">{category}</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {entries.map((template) => (
                <div key={template.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-white">
                  {template.previewAssetId && <img src={SOCIAL_ASSETS[template.previewAssetId]} alt={`${template.title} design preview`} width={template.width} height={template.height} className="h-auto w-full" />}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{template.title}</h3>
                    </div>
                    <Link to={`/toolkit/social/${template.id}`} className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                      {draftTemplates.has(template.id) ? "Continue draft" : "Customize graphic"} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4"><MarketingContact /></div>
          </section>
        ))}
      </ChapterPage>
    </HubShell>
  );
}
