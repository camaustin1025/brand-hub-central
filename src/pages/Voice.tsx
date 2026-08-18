import { HubShell } from "@/components/hub/HubShell";
import { VoiceContent } from "@/components/brand/VoiceContent";
import { ChapterPage } from "@/components/layout/ChapterPage";

export default function Voice() {
  return (
    <HubShell activeId="voice">
      <ChapterPage
        eyebrow="Brand foundation"
        title="How we sound and the lines we don't cross"
        intro="Ordergroove sounds like the confident operator in the room who doesn't need to shout. Calm authority, earned from 15+ years of doing the work."
      >
        <VoiceContent />
      </ChapterPage>
    </HubShell>
  );
}
