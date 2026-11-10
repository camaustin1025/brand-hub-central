import { HubShell } from "@/components/hub/HubShell";
import { VoiceContent } from "@/components/brand/VoiceContent";
import { HeroAction } from "@/components/layout/ChapterHero";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { isWipSection } from "@/data/hub";

export default function Voice() {
  return (
    <HubShell activeId="voice">
      <ChapterPage
        navId="voice"
        wip={isWipSection("voice")}
        updated="2026-11-05"
        title="How we sound and the lines we don't cross"
        intro="Ordergroove sounds like the confident operator in the room who doesn't need to shout. Calm authority, earned from 15+ years of doing the work."
        primaryAction={<HeroAction href="#pass-fail-rules">See the pass/fail rules</HeroAction>}
      >
        <VoiceContent />
      </ChapterPage>
    </HubShell>
  );
}
