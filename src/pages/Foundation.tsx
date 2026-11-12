import { HubShell } from "@/components/hub/HubShell";
import { FoundationLadderPreview } from "@/components/brand/FoundationLadderPreview";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { isWipSection } from "@/data/hub";

/** Section ids from FoundationLadderPreview, in page order. Rename one there, rename it here. */
const SECTIONS = [
  { id: "category", label: "The category we own" },
  { id: "say-it", label: "Pitches & boilerplate" },
  { id: "rights", label: "Rights to Win" },
  { id: "products", label: "Products" },
  { id: "audience", label: "Who we serve" },
  { id: "personas", label: "Personas" },
];

/**
 * Foundation & Messaging, built on the message ladder (ladder strip, category plate,
 * Pitches & boilerplate, Rights to Win, products, ICPs). The previous layout is
 * components/brand/FoundationContent.tsx, kept until this one is committed.
 */
export default function Foundation() {
  return (
    <HubShell activeId="messaging">
      <ChapterPage
        compactHeader
        navId="messaging"
        wip={isWipSection("messaging")}
        updated="2026-11-11"
        title="Foundation & Messaging"
        intro="The approved positioning, message ladder, ready-to-use lines, and ICPs. Start here before you write anything about Ordergroove."
      >
        {/* Same jump-link style as the AI Resources page header. */}
        <nav aria-label="On this page" className="mb-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {SECTIONS.map((section) => (
            <a key={section.id} className="action-focus underline underline-offset-4" href={`#${section.id}`}>{section.label}</a>
          ))}
        </nav>
        <FoundationLadderPreview />
      </ChapterPage>
    </HubShell>
  );
}
