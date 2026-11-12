import { Heading } from "@/components/layout/Heading";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";

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

export default function AISkills() {
  return (
    <>
      <PageHeader
        eyebrow="AI & Skills"
        title="On-brand by default, not by review"
        subhead="The end state is a brand that enforces itself. These skills load the rules automatically so the first draft is already on brand."
      />

      <section className="container max-w-3xl space-y-10 pb-16">
        <div>
          <Heading as="h2" className="text-2xl font-bold">Available now</Heading>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {SKILLS.map((s) => (
              <div
                key={s.name}
                className="visual-container border border-border bg-card p-5"
              >
                <code className="text-sm font-semibold text-primary">{s.name}</code>
                <p className="mt-2 text-sm text-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="visual-container border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Heading as="h2" className="text-lg font-bold">The brand assistant</Heading>
            <DraftBadge>Pilot stretch goal</DraftBadge>
          </div>
          <p className="mt-3 text-sm text-foreground">
            A hub assistant that answers brand questions from the full canon,
            lives on the homepage, and logs every question and answer so the
            guide keeps improving. Planned as an edge function once the core
            pages ship.
          </p>
        </div>
      </section>
    </>
  );
}
