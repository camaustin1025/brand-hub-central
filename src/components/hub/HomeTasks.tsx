import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { WipTag } from "@/components/brand/WorkInProgress";
import { DESIGN_CANVAS_PATH, isDisabledSection, isWipSection, RESOURCE_PAGE_PATHS, ZOOM_BACKGROUNDS_PATH } from "@/data/hub";
import { SOCIAL_ASSETS } from "@/data/social-templates";
import { useAccess } from "@/hooks/use-access";
import { cn } from "@/lib/utils";

type Task = {
  label: string;
  to: string;
  /** Staff-only destination, so guests don't get a door that sends them back here. */
  staffOnly?: boolean;
  wip?: boolean;
  /** Destination is paused on the live site, so the card is left out. */
  hidden?: boolean;
  /** A real glimpse of the destination, shown when the cards have room for it. */
  preview: ReactNode;
};

const ZOOM_PREVIEWS = ["office-lounge", "midnight-logo", "gradient"];

const TASKS: Task[] = [
  {
    label: "Zoom backgrounds",
    to: ZOOM_BACKGROUNDS_PATH,
    staffOnly: true,
    preview: (
      <span className="grid h-full grid-cols-3 gap-px bg-og-midnight">
        {ZOOM_PREVIEWS.map((name) => (
          <img key={name} src={`/zoom-backgrounds/previews/${name}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
        ))}
      </span>
    ),
  },
  {
    label: "LinkedIn graphics",
    to: DESIGN_CANVAS_PATH,
    staffOnly: true,
    preview: <img src={SOCIAL_ASSETS["new-employee-split-dark-preview"]} alt="" loading="lazy" className="h-full w-full object-cover" />,
  },
  {
    label: "Words to use and avoid",
    to: "/voice",
    wip: isWipSection("voice"),
    hidden: isDisabledSection("voice"),
    preview: (
      <span className="flex h-full flex-col justify-center gap-2 bg-[#F4F3F8] px-5 text-[13px] font-semibold">
        <span className="flex items-center gap-2"><Check size={15} className="shrink-0 text-og-green-light" />Ready on day one</span>
        <span className="flex items-center gap-2 text-muted-foreground line-through decoration-og-midnight/50"><X size={15} className="shrink-0" />Out of the box</span>
      </span>
    ),
  },
  {
    label: "AI and Claude guidance",
    to: RESOURCE_PAGE_PATHS["ai-skills"],
    staffOnly: true,
    preview: (
      <span className="flex h-full flex-col justify-center gap-1.5 bg-og-midnight px-5 text-white">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-og-green">Claude skill</span>
        <code className="text-[13px] font-semibold">ordergroove-slides</code>
      </span>
    ),
  },
];

/**
 * The jobs that live on their own pages, one click from the top of the homepage.
 * Text rows in a narrow column; cards with a preview of the destination once four fit across.
 */
export function HomeTasks({ className }: { className?: string }) {
  const isGuest = useAccess() === "guest";
  const tasks = TASKS.filter((task) => !task.hidden && !(isGuest && task.staffOnly));
  if (tasks.length < 2) return null;

  return (
    <nav aria-labelledby="home-tasks-heading" className={className}>
      <h2 id="home-tasks-heading" className="sr-only">Popular resources</h2>
      <ul className={cn("grid gap-2.5 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:56rem)]:gap-3", tasks.length === 3 ? "[@container(min-width:56rem)]:grid-cols-3" : "[@container(min-width:56rem)]:grid-cols-4")}>
        {tasks.map((task) => (
          <li key={task.to}>
            <Link
              to={task.to}
              className={cn(
                "action-focus group flex h-full flex-col overflow-hidden rounded-lg border border-og-midnight/15 bg-white text-og-midnight",
                "transition-[border-color,box-shadow] duration-200 hover:border-og-midnight/45 hover:shadow-[0_6px_18px_-8px_rgb(23_19_47/0.25)]"
              )}
            >
              <span aria-hidden="true" className="hidden aspect-[2/1] overflow-hidden border-b border-og-midnight/10 [@container(min-width:56rem)]:block">
                {task.preview}
              </span>
              <span className="flex flex-1 items-center justify-between gap-3 px-4 py-3.5">
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2 text-[15px] font-bold leading-5">
                    {task.label}
                    {task.wip && <WipTag />}
                  </span>
                </span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
