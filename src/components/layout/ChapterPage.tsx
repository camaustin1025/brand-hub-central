import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** Page frame for a standalone brand chapter. Mirrors HubSection's rhythm so a
 *  chapter reads the same whether it is visited directly or reached from the hub. */
export function ChapterPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1060px]">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} /> Brand hub
        </Link>
        <div className="mb-10 max-w-[var(--measure-header)]">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-3xl font-extrabold md:text-[42px]">{title}</h1>
          {intro && <p className="measure mt-4 text-lg leading-[1.6] text-muted-foreground">{intro}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
