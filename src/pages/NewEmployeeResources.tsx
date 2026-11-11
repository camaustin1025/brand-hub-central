import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { HeroAction } from "@/components/layout/ChapterHero";
import { buttonVariants } from "@/components/ui/button";
import { MarketingContact } from "@/components/social/MarketingContact";
import {
  DESIGN_CANVAS_CATEGORIES,
  designCanvasTemplatePath,
  isWipSection,
  NEW_EMPLOYEE_NAV_ID,
  RESOURCE_PAGE_PATHS,
  ZOOM_BACKGROUNDS_PATH,
} from "@/data/hub";
import { SOCIAL_ASSETS } from "@/data/social-templates";
import { cn } from "@/lib/utils";

const announcementTemplates = DESIGN_CANVAS_CATEGORIES.find(({ category }) => category === "New Employee")?.templates ?? [];

/** Every link points at a live hub page, so the list never promises something that isn't there. */
const FIRST_WEEK = [
  {
    title: "Set up your video calls",
    body: "Download an approved background and add it in Zoom, Google Meet, or Microsoft Teams.",
    to: ZOOM_BACKGROUNDS_PATH,
    action: "Get a Zoom background",
  },
  {
    title: "Learn what we stand for",
    body: "Our category, who we sell to, the three Rights to Win, and the message ladder that ties them together.",
    to: "/foundation",
    action: "Read Foundation & messaging",
  },
  {
    title: "Learn how we sound",
    body: "The pass/fail language rules and preferred terms. Read these before you write anything customer-facing.",
    to: "/voice",
    action: "Read Voice & language",
  },
  {
    title: "Use the right colors and logo",
    body: "Copy exact color values and download the original logo files instead of screenshotting old decks.",
    to: "/#color",
    action: "See Color & gradients",
  },
  {
    title: "Use AI tools safely",
    body: "The Claude skills that keep work on brand, plus what you can and can't share with AI tools.",
    to: RESOURCE_PAGE_PATHS["ai-skills"],
    action: "Open AI resources",
  },
];

export default function NewEmployeeResources() {
  return (
    <HubShell activeId={NEW_EMPLOYEE_NAV_ID}>
      <ChapterPage
        navId={NEW_EMPLOYEE_NAV_ID}
        wip={isWipSection(NEW_EMPLOYEE_NAV_ID)}
        updated="2026-11-11"
        title="New employees"
        intro="Welcome to Ordergroove. Start here to announce your new role, set up your calls, and learn how we look and sound."
        primaryAction={<HeroAction href="#announce">Announce your new role</HeroAction>}
      >
        <section id="announce" aria-labelledby="announce-heading" className="scroll-mt-24">
          <h2 id="announce-heading" className="text-2xl font-extrabold md:text-3xl">Announce your new role</h2>
          <p className="measure mt-3 leading-7 text-muted-foreground">
            Pick a design, add your photo and job title, then download a PNG to post on LinkedIn.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {announcementTemplates.map((template) => (
              <div key={template.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-white">
                {template.previewAssetId && (
                  <img
                    src={SOCIAL_ASSETS[template.previewAssetId]}
                    alt={`${template.title} design preview`}
                    width={template.width}
                    height={template.height}
                    className="h-auto w-full"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="flex-1 text-lg font-bold">{template.title}</h3>
                  <Link to={designCanvasTemplatePath(template.id)} className={cn(buttonVariants(), "mt-5 self-start")}>
                    Customize graphic <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="first-week-heading" className="mt-16">
          <h2 id="first-week-heading" className="text-2xl font-extrabold md:text-3xl">Your first week</h2>
          <ol className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
            {FIRST_WEEK.map((step, index) => (
              <li key={step.title} className="grid gap-4 p-6 md:grid-cols-[32px_minmax(0,1fr)_auto] md:items-center md:gap-6">
                <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-og-midnight text-sm font-bold tabular-nums text-white">{index + 1}</span>
                <div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="measure mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
                <Link to={step.to} className="action-focus inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
                  {step.action}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10"><MarketingContact /></div>
      </ChapterPage>
    </HubShell>
  );
}
