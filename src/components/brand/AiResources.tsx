import { ArrowUpRight, Check, Copy } from "lucide-react";
import { CLAUDE_SKILLS_GUIDE_URL, SLIDES_STARTER_PROMPT } from "@/data/brand-resources";
import { useCopyText } from "@/hooks/use-copy-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AiResources() {
  const { copy, copied, error } = useCopyText(SLIDES_STARTER_PROMPT);

  return (
    <div className="space-y-10">
      <article className="rounded-lg border border-border bg-white p-6 md:p-8" aria-labelledby="slides-skill-title">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="slides-skill-title" className="text-2xl font-bold">Ordergroove Slides 2.0</h2>
          <span className="rounded bg-og-lemon px-2 py-1 text-xs font-semibold text-og-midnight">Beta</span>
        </div>
        <p className="mt-4 max-w-[68ch] text-base leading-7 text-muted-foreground">Create a new deck or put an existing presentation on brand. This Claude skill applies Ordergroove’s Figma layouts, Figtree, approved colors, logos, icons, and chart styles.</p>
        <dl className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold">Use it for</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">Sales decks, QBRs, internal updates, pitch decks, and rebranding existing presentations.</dd></div>
          <div><dt className="text-sm font-semibold">What you get</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">A .pptx file that opens in Google Slides, PowerPoint, and Keynote. Supplied wording, numbers, images, and speaker notes are preserved.</dd></div>
        </dl>

        <h3 className="mt-6 text-base font-semibold">Get started</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          <li>Ask Marketing for the current Slides 2.0 beta skill package.</li>
          <li>In Claude, open Customize &gt; Skills. Enable the shared skill, or upload the approved ZIP if it has not been added.</li>
          <li>Attach your content and tell Claude the audience, goal, and any required customer assets.</li>
        </ol>
        <a href={CLAUDE_SKILLS_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="action-focus mt-3 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">Claude’s skill setup guide <ArrowUpRight size={15} aria-hidden="true" /></a>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold">Start with this prompt</h3>
          <button type="button" onClick={copy} className={cn(buttonVariants({ size: "sm" }), "min-h-11")}>
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy prompt"}
          </button>
        </div>
        <p className="mt-3 rounded-lg bg-og-gray-950 p-5 text-sm leading-7">{SLIDES_STARTER_PROMPT}</p>
        <p role="status" className={error ? "mt-2 text-sm text-muted-foreground" : "sr-only"}>{error ? "Copy unavailable. Select the prompt above to copy manually." : copied ? "Slides starter prompt copied" : ""}</p>
      </article>

      <div className="grid gap-6 md:grid-cols-2">
        <div><h2 className="text-lg font-semibold">Give Claude a useful brief</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Include the audience, desired outcome, source material, and anything that must stay exactly as written. Separate supplied facts from ideas you want Claude to develop.</p></div>
        <div><h2 className="text-lg font-semibold">Review before you share</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Check names, figures, customer logos, placeholders, and slide layouts against your source material. A skill applies the brand rules; you still review the content and final file.</p></div>
      </div>
    </div>
  );
}
