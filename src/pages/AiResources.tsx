import { AiResources as AiResourcesContent } from "@/components/brand/AiResources";
import { HubShell } from "@/components/hub/HubShell";
import { HeroAction } from "@/components/layout/ChapterHero";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { OnThisPage } from "@/components/layout/OnThisPage";
import { AI_RESOURCE_SECTIONS } from "@/data/ai-resources";
import { isWipSection } from "@/data/hub";

export default function AiResourcesPage() {
  return (
    <HubShell activeId="ai-skills">
      <ChapterPage
        navId="ai-skills"
        wip={isWipSection("ai-skills")}
        updated="2026-11-10"
        title="AI Resources & Guidance"
        intro="How to use Claude at Ordergroove: what’s safe to share, which skills to use, and where to get help."
        primaryAction={<HeroAction href="#ai-skills-library">Browse skills</HeroAction>}
        heroFooter={<OnThisPage sections={AI_RESOURCE_SECTIONS} />}
      >
        <AiResourcesContent />
      </ChapterPage>
    </HubShell>
  );
}
