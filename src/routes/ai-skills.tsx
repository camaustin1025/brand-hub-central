import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { OnThisPage, type PageSection } from "@/components/layout/OnThisPage";
import { ModuleHead } from "@/components/brand/SectionHead";

export const Route = createFileRoute("/ai-skills")({
  component: AISkills,
});

const SECTIONS: PageSection[] = [
  { id: "available", label: "Available now" },
  { id: "assistant", label: "The brand assistant" },
];

const SKILLS = [
  {
    name: "ordergroove-slides",
    body: "Generates on-brand PowerPoint and Google Slides decks with the correct palette, Figtree, and layouts.",
  },
  {
    name: "ordergroove-doc",
    body: "Creates and reformats Word docs to Ordergroove brand standards.",
  },
  {
    name: "v2linkedinpost",
    body: "Drafts LinkedIn posts in the company voice, following the hook and structure rules.",
  },
  {
    name: "brand.md",
    body: "The canonical, agent-facing brand context. Imported into project CLAUDE.md files so on-brand is the default output.",
  },
];

function AISkills() {
  return (
    <>
      <PageHeader
        eyebrow="AI & Skills"
        title="On-brand by default, not by review"
        subhead="The end state is a brand that enforces itself. These skills load the rules automatically so the first draft is already on brand."
      />

      {/* Prose sits in the same 8-column measure PageHeader's title block uses,
          so the masthead and the body share one left edge. */}
      <section className="site-container grid-12 section-step section-end">
        <div className="col-span-12 space-y-[var(--step-module)] md:col-span-8">
          <div>
            <ModuleHead id="available" title="Available now" />
            <div className="block-step grid gap-4 sm:grid-cols-2">
              {SKILLS.map((s) => (
                <div key={s.name} className="visual-container border border-border bg-card p-5">
                  <code className="text-sm font-semibold text-primary">{s.name}</code>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ModuleHead
              id="assistant"
              title="The brand assistant"
              aside={<DraftBadge>Pilot stretch goal</DraftBadge>}
            />
            <p className="visual-container block-step border border-border bg-card p-6 text-sm text-muted-foreground">
              A hub assistant that answers brand questions from the full canon, lives on the
              homepage, and logs every question and answer so the guide keeps improving. Planned as
              an edge function once the core pages ship.
            </p>
          </div>
        </div>

        <OnThisPage sections={SECTIONS} />
      </section>
    </>
  );
}
