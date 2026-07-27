import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";

export const Route = createFileRoute("/ai-skills")({
  component: AISkills,
});

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
      <section className="site-container grid-12 pb-16 pt-12">
        <div className="col-span-12 space-y-10 md:col-span-8">
          <div>
            <h2 className="text-2xl font-bold">Available now</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {SKILLS.map((s) => (
                <div key={s.name} className="visual-container border border-border bg-card p-5">
                  <code className="text-sm font-semibold text-primary">{s.name}</code>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="visual-container border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">The brand assistant</h2>
              <DraftBadge>Pilot stretch goal</DraftBadge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              A hub assistant that answers brand questions from the full canon, lives on the
              homepage, and logs every question and answer so the guide keeps improving. Planned as
              an edge function once the core pages ship.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
