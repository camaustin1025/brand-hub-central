import { AiResources as AiResourcesContent } from "@/components/brand/AiResources";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";

export default function AiResourcesPage() {
  return (
    <HubShell activeId="ai-skills">
      <ChapterPage
        title="AI Resources & Guidance"
        intro="Shared Claude skills for everyday Ordergroove work. Start with the right skill, add your source material, and review the result."
      >
        <AiResourcesContent />
      </ChapterPage>
    </HubShell>
  );
}
