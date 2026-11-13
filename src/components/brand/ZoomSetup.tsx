import { Fragment, useState } from "react";
import { Check } from "lucide-react";
import { Heading } from "@/components/layout/Heading";
import { TintedIcon } from "@/components/brand/TintedIcon";
import { availableAssets } from "@/data/assets";
import { ICON_COLORS } from "@/data/brand-resources";
import { cn } from "@/lib/utils";

/** Menu names follow the Zoom desktop client. **Bold** marks a label you'll see in Zoom. */
const STEPS = [
  "In the Zoom desktop app, open **Settings**, then **Backgrounds & effects**.",
  "Under **Virtual backgrounds**, select the **plus button**, then **Add image**.",
  "Choose the PNG you downloaded.",
];

const MIDNIGHT_ICON = ICON_COLORS.light.find((color) => color.name === "Midnight")!;
const THUMBNAILS = availableAssets().filter((asset) => asset.type === "background").slice(0, 5);
// The thumbnail that gets picked in step 3.
const PICKED = 2;

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
        index % 2 ? <strong key={index} className="font-semibold">{part}</strong> : <Fragment key={index}>{part}</Fragment>,
      )}
    </>
  );
}

/** A simplified Zoom settings window. Decorative: the steps beside it carry the instructions. */
function ZoomWindow({ active }: { active: number }) {
  const ring = "ring-2 ring-og-green-light ring-offset-2";
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_12px_32px_-12px_rgba(23,19,47,0.25)]">
      <div className="flex items-center gap-2 border-b border-border bg-og-gray-950 px-3 py-2">
        <span className="size-2.5 rounded-full bg-og-gray-800" />
        <span className="size-2.5 rounded-full bg-og-gray-800" />
        <span className="size-2.5 rounded-full bg-og-gray-800" />
        <span className="ml-2 text-xs font-semibold text-og-midnight">Settings</span>
      </div>
      <div className="grid grid-cols-[38%_1fr] text-xs">
        <ul className="space-y-0.5 border-r border-border p-2">
          {["General", "Video", "Audio", "Backgrounds & effects"].map((item) => {
            const on = item === "Backgrounds & effects";
            return (
              <li key={item} className={cn("rounded px-2 py-1.5 text-og-midnight transition-shadow duration-200", on && "bg-[#0B5CFF]/10 font-semibold", on && active === 0 && ring)}>
                {item}
              </li>
            );
          })}
        </ul>
        <div className="p-3">
          <p className="font-semibold text-og-midnight">Virtual backgrounds</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <div className={cn("grid aspect-video place-items-center rounded border border-dashed border-og-gray-700 text-base text-og-midnight transition-shadow duration-200", active === 1 && ring)}>+</div>
            {THUMBNAILS.map((asset, index) => {
              const picked = active === 2 && index === PICKED;
              return (
                <div key={asset.id} className={cn("relative aspect-video overflow-hidden rounded transition-shadow duration-200", picked && ring)}>
                  <img src={asset.preview ?? undefined} alt="" loading="lazy" className="size-full object-cover" />
                  {picked && (
                    <span className="absolute right-0.5 top-0.5 grid size-3.5 place-items-center rounded-full bg-og-green-light text-white">
                      <Check size={9} strokeWidth={3} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Set up your background" on the Zoom backgrounds page: steps that light up a mock Zoom window, plus the mirror tip. */
export function ZoomSetup() {
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="zoom-setup-heading" className="mt-16">
      <Heading as="h2" id="zoom-setup-heading" className="reference-section-title">Set up your background</Heading>

      <div className="mt-8 grid items-center gap-8 rounded-lg border border-border bg-white p-6 md:grid-cols-2 md:p-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/platform-icons/zoom.svg" alt="" width={32} height={32} className="shrink-0" />
            <Heading as="h3" className="reference-item-title">Zoom desktop app</Heading>
          </div>
          <ol className="mt-5 space-y-1.5">
            {STEPS.map((step, index) => (
              <li key={step}>
                <button
                  type="button"
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={cn(
                    "flex w-full gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight",
                    active === index ? "bg-og-gray-950" : "hover:bg-og-gray-950",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-og-midnight text-xs font-bold tabular-nums text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-og-midnight">
                    <span className="sr-only">Step {index + 1}: </span>
                    <Rich text={step} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <ZoomWindow active={active} />
      </div>

      <div className="mt-4 flex gap-4 rounded-lg border border-border bg-white p-6">
        <TintedIcon name="swap_horiz" color={MIDNIGHT_ICON} size={44} className="shrink-0" />
        <div>
          <Heading as="h3" className="text-base font-semibold text-og-midnight">Does the logo look backwards?</Heading>
          <p className="measure mt-1 text-sm leading-6 text-og-midnight">
            <Rich text="Most video apps mirror your own preview, so the logo reads backwards to you. Everyone else on the call sees it the right way round. In Zoom, turn off **Mirror my video** under **Settings**, then **Video**, to check." />
          </p>
        </div>
      </div>
    </section>
  );
}
