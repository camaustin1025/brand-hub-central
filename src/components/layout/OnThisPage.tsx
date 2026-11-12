export type PageSection = { id: string; label: string };

/**
 * "On this page" jump links for a ChapterPage hero (pass it as `heroFooter`). Styled for
 * the Midnight hero. Each `id` must match an element id on the page; nothing checks
 * that at build time, so a typo shows up as a link that goes nowhere.
 */
export function OnThisPage({ sections, tone = "dark" }: { sections: readonly PageSection[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="On this page">
      <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${tone === "light" ? "text-muted-foreground" : "text-white"}`}>On this page</p>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`inline-flex min-h-8 items-center rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 ${tone === "light" ? "text-og-midnight focus-visible:ring-og-midnight" : "text-white focus-visible:ring-white"}`}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
