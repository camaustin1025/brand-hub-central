import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { buttonVariants } from "@/components/ui/button";
import { TOOLKIT_ITEMS } from "@/data/hub";
import { getPublishedSocialTemplate } from "@/data/social-templates";
import { MarketingContact } from "@/components/social/MarketingContact";
import { useAuthUser } from "@/hooks/use-auth-user";
import { hasSocialDraft } from "@/lib/social-drafts";
import { cn } from "@/lib/utils";

export default function Toolkit() {
  const user = useAuthUser();
  const [draftTemplates, setDraftTemplates] = useState<Set<string>>(new Set());
  useEffect(() => {
    let active = true;
    setDraftTemplates(new Set());
    if (user) {
      const ids = TOOLKIT_ITEMS.flatMap((item) => item.templateId && getPublishedSocialTemplate(item.templateId) ? [item.templateId] : []);
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
          {TOOLKIT_ITEMS.filter((item) => item.href && (item.action === "internal"
            ? (!item.templateId || !!getPublishedSocialTemplate(item.templateId))
            : !item.status)).map((item) => (
            <div key={item.templateId ?? item.title} className="flex min-h-56 flex-col rounded-lg border border-border bg-white p-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="measure mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
              {item.action === "internal" ? (
                <Link to={item.href!} className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                  {item.templateId && draftTemplates.has(item.templateId) ? "Continue draft" : item.cta} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <a href={item.href!} download className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                  {item.cta} <Download size={15} aria-hidden="true" />
                </a>
              )}
              {item.templateId && <div className="mt-3"><MarketingContact /></div>}
            </div>
          ))}
        </div>
      </ChapterPage>
    </HubShell>
  );
}
