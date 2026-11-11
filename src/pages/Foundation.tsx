import { HubShell } from "@/components/hub/HubShell";
import { FoundationLadderPreview } from "@/components/brand/FoundationLadderPreview";
import { HeroAction } from "@/components/layout/ChapterHero";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { OnThisPage } from "@/components/layout/OnThisPage";
import { isWipSection } from "@/data/hub";

/** Section ids from FoundationLadderPreview, in page order. Rename one there, rename it here. */
const SECTIONS = [
  { id: "category", label: "The category we own" },
  { id: "say-it", label: "Say it" },
  { id: "rights", label: "Rights to Win" },
  { id: "products", label: "Products" },
  { id: "audience", label: "Who we serve" },
];

/**
 * Foundation & Messaging, built on the message ladder (ladder strip, category plate,
 * Say it shelf, Rights to Win, products, ICPs). The previous layout is
 * components/brand/FoundationContent.tsx, kept until this one is committed.
 */
export default function Foundation() {
  return (
    <HubShell activeId="messaging">
      <ChapterPage
        navId="messaging"
        wip={isWipSection("messaging")}
        updated="2026-11-11"
        title="Foundation & Messaging"
        intro="The approved positioning, message ladder, ready-to-use lines, and ICPs. Start here before you write anything about Ordergroove."
        primaryAction={<HeroAction href="#boilerplate">Get the boilerplate</HeroAction>}
        heroFooter={<OnThisPage sections={SECTIONS} />}
      >
        <FoundationLadderPreview />
      </ChapterPage>
    </HubShell>
  );
}
