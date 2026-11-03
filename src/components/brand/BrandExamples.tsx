import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { findAssetFile, getAsset, isAssetAvailable } from "@/data/assets";
import { BACKGROUND_GRADIENT } from "@/data/tokens";

function Example({ good, children, note, coloredIcons = false }: { good: boolean; children: ReactNode; note: string; coloredIcons?: boolean }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-lg border border-border bg-white">
      <figcaption className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm font-semibold text-og-midnight">
        {good ? <Check size={16} className={coloredIcons ? "text-og-green-light" : undefined} aria-hidden="true" /> : <X size={16} className={coloredIcons ? "text-og-radish" : undefined} aria-hidden="true" />}{good ? "Use" : "Avoid"}
      </figcaption>
      {children}
      <p className="border-t border-border px-5 py-4 text-sm leading-6 text-og-midnight">{note}</p>
    </figure>
  );
}

export function LogoExamples() {
  if (!["logo-dark", "logo-light"].every((id) => isAssetAvailable(getAsset(id)))) return null;
  const darkLogo = findAssetFile("logo-dark", "SVG")?.href ?? getAsset("logo-dark").preview!;
  const lightLogo = findAssetFile("logo-light", "SVG")?.href ?? getAsset("logo-light").preview!;
  return (
    <div id="logo-examples" className="mt-10 scroll-mt-24">
      <h3 className="text-xl font-bold">Match the logo to its background</h3>
      <p className="mb-5 mt-2 text-sm leading-6">A background change needs the right original artwork.</p>
      <div className="grid grid-cols-1 gap-5">
        <Example good coloredIcons note="When on a dark background (such as Midnight), our default is to display the logo in white with Groovy Green-500 interlocking rings.">
          <div className="grid sm:grid-cols-2">
            <div className="flex h-24 items-center justify-center bg-og-midnight px-8"><img src={darkLogo} alt="Correct: white wordmark on Midnight" className="h-auto w-full max-w-80 object-contain" /></div>
            <div className="flex h-24 items-center justify-center bg-white px-8"><img src={lightLogo} alt="Correct: Midnight wordmark on white" className="h-auto w-full max-w-80 object-contain" /></div>
          </div>
        </Example>
        <Example good={false} coloredIcons note="The wrong version loses its lettering against the background. Choose another supplied file instead of recoloring the logo.">
          <div className="grid sm:grid-cols-2">
            <div className="flex h-24 items-center justify-center bg-white px-8"><img src={darkLogo} alt="Incorrect: white wordmark disappears on white" className="h-auto w-full max-w-80 object-contain" /></div>
            <div className="flex h-24 items-center justify-center bg-og-midnight px-8"><img src={lightLogo} alt="Incorrect: Midnight wordmark disappears on Midnight" className="h-auto w-full max-w-80 object-contain" /></div>
          </div>
        </Example>
      </div>
    </div>
  );
}

export function ColorExamples() {
  return (
    <div id="color-examples" className="mt-10 scroll-mt-24">
      <h3 className="text-xl font-bold">Keep the message readable</h3>
      <p className="mb-5 mt-2 text-sm leading-6">An accent color and a text color have different jobs.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Example good note="Midnight carries small text on white. Groovy Green works on Midnight. Light-background green stays an accent.">
          <div className="space-y-4 p-5">
            <div className="flex min-h-20 items-center gap-3 rounded-md border border-border p-4 text-sm text-og-midnight"><span className="h-8 w-2 shrink-0 rounded-full bg-[#009A50]" aria-hidden="true" />Clear words. Consistent design.</div>
            <div className="flex min-h-20 items-center rounded-md bg-og-midnight p-4 text-sm text-[#00FF85]">Clear words. Consistent design.</div>
          </div>
        </Example>
        <Example good={false} note="Neon green disappears on white. White labels on light-background green are also too low-contrast for small text.">
          <div className="space-y-4 p-5" aria-label="Incorrect color combinations, shown for comparison">
            <div className="flex min-h-20 items-center rounded-md border border-border p-4 text-sm text-[#00FF85]">Clear words. Consistent design.</div>
            <div className="flex min-h-20 items-center rounded-md bg-[#009A50] p-4 text-sm text-white">Clear words. Consistent design.</div>
          </div>
        </Example>
      </div>
    </div>
  );
}

// Uses the existing hub's wording, type hierarchy, and original gradient art.
// This demonstrates composition, without adding new brand measurements.
export function LayoutExample() {
  return (
    <div id="layout-example" className="mt-10 scroll-mt-24">
      <h3 className="text-xl font-bold">Give each element a job</h3>
      <p className="mb-5 mt-2 text-sm leading-6">Use type, spacing, and one accent to guide the reading order.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Example good note="A clear heading, quieter supporting copy, and room between groups. The gradient adds one moment of color.">
          <div className="flex min-h-72 flex-col p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-og-midnight">Ordergroove resources</p>
            <p className="mt-4 max-w-[18ch] text-[28px] font-extrabold leading-[1.1] tracking-tight text-og-midnight">Your starting point for everyday work</p>
            <p className="mt-4 max-w-[34ch] text-sm leading-6 text-og-midnight">Brand guidelines, useful tools, and employee resources.</p>
            <img src={BACKGROUND_GRADIENT.image} alt="" className="mt-6 h-9 w-full rounded-md object-cover" />
          </div>
        </Example>
        <Example good={false} note="Equal emphasis, cramped spacing, and a busy background make it harder to know what to read first.">
          <div className="flex min-h-72 items-center p-3" style={{ backgroundImage: `url(${BACKGROUND_GRADIENT.image})`, backgroundSize: "cover" }}>
            <div className="w-full text-center text-xl font-bold leading-tight text-og-midnight">
              <p>ORDERGROOVE RESOURCES</p><p>Your starting point for everyday work</p><p>Brand guidelines, useful tools, and employee resources.</p>
            </div>
          </div>
        </Example>
      </div>
    </div>
  );
}

// The wording pair comes from content-sources/brand-style-guide.md, section 7.
export function VoiceExample() {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold">Put the rule into practice</h3>
      <p className="mb-5 mt-3 text-sm leading-6">Replace vague packaging language with a clear statement about adoption.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Example good note="Direct, specific language. The reader knows what to expect."><p className="p-6 text-xl font-semibold leading-8 text-og-midnight">Ready on day one, no custom builds required.</p></Example>
        <Example good={false} note="“Out of the box” reads as lightweight and is on the avoid list."><p className="p-6 text-xl font-semibold leading-8 text-og-midnight">Out-of-the-box enterprise capability.</p></Example>
      </div>
    </div>
  );
}
