import { AiResources as AiResourcesContent } from "@/components/brand/AiResources";
import { HubShell } from "@/components/hub/HubShell";
import { HeroAction } from "@/components/layout/ChapterHero";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { isWipSection } from "@/data/hub";

export default function AiResourcesPage() {
  return (
    <HubShell activeId="ai-skills">
      <ChapterPage
        navId="ai-skills"
        wip={isWipSection("ai-skills")}
        updated="2026-10-29"
        title="AI Resources & Guidance"
        intro="Shared Claude skills for everyday Ordergroove work. Start with the right skill, add your source material, and review the result."
        primaryAction={<HeroAction href="#slides-skill-title">Get the slides skill</HeroAction>}
      >
        <AiResourcesContent />
      </ChapterPage>
    </HubShell>
  );
}
