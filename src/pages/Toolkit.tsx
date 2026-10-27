import { Download } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { buttonVariants } from "@/components/ui/button";
import { TOOLKIT_ITEMS } from "@/data/hub";
import { cn } from "@/lib/utils";

export default function Toolkit() {
  return (
    <HubShell activeId="toolkit">
      <ChapterPage title="GTM & employee toolkit" intro="Resources for day-to-day work.">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLKIT_ITEMS.filter((item) => item.href && !item.status).map((item) => (
            <div key={item.title} className="flex min-h-56 flex-col rounded-lg border border-border bg-white p-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="measure mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
              <a href={item.href!} download className={cn(buttonVariants({ size: "sm" }), "mt-5 min-h-11 self-start")}>
                {item.cta} <Download size={15} aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </ChapterPage>
    </HubShell>
  );
}
