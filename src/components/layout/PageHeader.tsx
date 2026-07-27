/**
 * The masthead every inner route opens with. It sits on the same 12-column
 * field as Home — 8 columns of title, a right-aligned chrome label — and closes
 * on a hairline so the page body reads as the next module in the stack rather
 * than a fresh start.
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
    <div className="site-container border-b border-border py-12 md:py-16">
      <div className="grid-12 items-baseline">
        <div className="col-span-12 md:col-span-8">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
          {subhead && (
            <p className="mt-4 max-w-[640px] text-lg text-foreground md:text-xl">{subhead}</p>
          )}
        </div>
        {/* Decorative: the section's own name is already in the eyebrow above. */}
        <span aria-hidden className="eyebrow col-span-4 hidden md:block md:justify-self-end">
          Module: {eyebrow}
        </span>
      </div>
    </div>
  );
}
