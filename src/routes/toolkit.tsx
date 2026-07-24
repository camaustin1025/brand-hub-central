import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";

export const Route = createFileRoute("/toolkit")({
  component: Toolkit,
});

type Tool = {
  title: string;
  body: string;
  cta: string;
  href: string | null;
  draft?: string;
};

const TOOLS: Tool[] = [
  {
    title: "Slide template",
    body: "On-brand Google Slides with correct colors, fonts, and layouts. The ordergroove-slides skill builds decks for you.",
    cta: "Open template",
    href: null,
    draft: "Re-sourcing link",
  },
  {
    title: "Word docs",
    body: "On-brand documents via the ordergroove-doc skill. Midnight and white, Figtree, no forbidden fonts.",
    cta: "How it works",
    href: null,
    draft: "Re-sourcing link",
  },
  {
    title: "Email signatures",
    body: "Fancy and simple variants, copy-paste ready. LinkedIn-only icons, correct-contrast green links.",
    cta: "Get your signature",
    href: null,
    draft: "Re-sourcing link",
  },
  {
    title: "New-hire graphics",
    body: "Welcome and I've-joined LinkedIn graphics. Copy the Canva design and drop in your headshot.",
    cta: "Open in Canva",
    href: null,
    draft: "Confirming Canva link",
  },
  {
    title: "Zoom backgrounds",
    body: "Midnight canvas with the paired-circle gradient, sized for video calls.",
    cta: "Download",
    href: "/midnight_bg.png",
  },
];

function Toolkit() {
  return (
    <>
      <PageHeader
        eyebrow="GTM & Employee Toolkit"
        title="The everyday, on-brand"
        subhead="Decks, docs, signatures, and social graphics, plus the skills that generate them. Most links are being re-homed after the old hub went dark."
      />

      <section className="site-container grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <div key={t.title} className="visual-container flex flex-col border border-border bg-card p-6">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{t.title}</h2>
                {t.draft && <DraftBadge>{t.draft}</DraftBadge>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
            {t.href ? (
              <a
                href={t.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {t.cta} <ArrowUpRight size={15} />
              </a>
            ) : (
              // Not a live link yet — render as a clearly non-actionable pending
              // state (muted, no external-arrow) so it never reads as a dead link.
              <span
                aria-disabled="true"
                className="mt-4 inline-flex cursor-default items-center gap-1.5 text-sm font-medium text-muted-foreground"
              >
                <Clock size={14} /> Coming soon
              </span>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
