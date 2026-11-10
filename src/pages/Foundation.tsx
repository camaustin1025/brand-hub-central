import { HubShell } from "@/components/hub/HubShell";
import { FoundationContent } from "@/components/brand/FoundationContent";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { isWipSection } from "@/data/hub";

export default function Foundation() {
  return (
    <HubShell activeId="messaging">
      <ChapterPage
        wip={isWipSection("messaging")}
        width="reading"
        eyebrow="Verbal identity"
        title="Foundation & Messaging"
        intro="Ordergroove is the enterprise standard for subscriptions and recurring revenue. Always ladder down from the category, never up from features."
      >
        <FoundationContent />
      </ChapterPage>
    </HubShell>
  );
}
