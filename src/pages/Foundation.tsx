import { HubShell } from "@/components/hub/HubShell";
import { FoundationContent } from "@/components/brand/FoundationContent";
import { ChapterPage } from "@/components/layout/ChapterPage";

export default function Foundation() {
  return (
    <HubShell activeId="messaging">
      <ChapterPage
        eyebrow="Brand foundation"
        title="Who we are and what we lead with"
        intro="Ordergroove is the enterprise standard for subscriptions and recurring revenue. Always ladder down from the category, never up from features."
      >
        <FoundationContent />
      </ChapterPage>
    </HubShell>
  );
}
