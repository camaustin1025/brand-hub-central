/**
 * The masthead every inner route opens with. It sits on the same 12-column
 * field as Home — 8 columns of title — and closes on a hairline so the page
 * body reads as the next module in the stack rather than a fresh start.
 *
 * The rule lives on an inner element, not on `.site-container`: putting it on
 * the container drew it across the container's own 40px inline padding, so the
 * hairline overhung the title by 40px on each side and lined up with nothing.
 * Every other rule on the site (SectionHead, ModuleHead) sits flush with the
 * content edge, and now this one does too.
 *
 * The right column used to hold `Module: {eyebrow}`, which restated the eyebrow
 * word for word two inches away. The contents rail on the page body is the
 * thing that column is actually for.
 */
export function PageHeader({
  eyebrow,
  title,
  subhead,
}: {
  eyebrow: string;
  title: string;
  subhead?: string;
}) {
  return (
    <div className="site-container">
      <div className="grid-12 border-b border-border py-12 md:py-16">
        <div className="col-span-12 md:col-span-9">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
          {subhead && (
            <p className="mt-4 max-w-[52ch] text-lg text-foreground md:text-xl">{subhead}</p>
          )}
        </div>
      </div>
    </div>
  );
}
