import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { WipNotice } from "@/components/brand/WorkInProgress";
import { cn } from "@/lib/utils";

/** Page frame for a standalone brand chapter. Mirrors HubSection's rhythm so a
 *  chapter reads the same whether it is visited directly or reached from the hub. */
export function ChapterPage({
  eyebrow,
  title,
  intro,
  wip,
  width = "wide",
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Pass isWipSection(<nav id>) so the banner follows the nav flag. */
  wip?: boolean;
  /** "wide" (1060px) for galleries and tables. "reading" (57rem, 912px) for
   *  text-led chapters whose modules are sized to the reading measure, so panels
   *  and rows end where their text ends. Both share the same left edge, so the
   *  page start never jumps between chapters. */
  width?: "wide" | "reading";
  children: ReactNode;
}) {
  return (
    <div className="px-6 py-16 md:px-10 md:py-20">
      <div className={cn("mx-auto max-w-[1060px]", width === "reading" && "[&>*]:max-w-[57rem]")}>
        <Link
          to="/"
          className="mb-8 inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} /> Brand hub
        </Link>
        {/* The title runs uncapped; the intro takes the reading measure so a
            chapter's lede never stretches past ~70 characters a line. */}
        <div className="mb-10">
          {wip && <WipNotice />}
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {/* leading-[1.08] restores the base heading leading; text-3xl's 36px
              line height otherwise survives the md size bump and wraps tight. */}
          <h1 className="text-3xl font-extrabold leading-[1.08] md:text-[42px]">{title}</h1>
          {intro && <p className="measure mt-4 text-lg leading-[1.6] text-muted-foreground">{intro}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
