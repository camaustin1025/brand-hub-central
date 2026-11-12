import { Heading } from "@/components/layout/Heading";
import { VoiceExample } from "./BrandExamples";
import { TERMS, VOICE_RULES } from "@/data/hub";

/** Voice principles, the pass/fail rules, and approved terminology.
 *  Lives on /voice; no longer inlined on the hub home page. */
export function VoiceContent() {
  return (
    <>
      <div className="grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2">
        <div className="bg-white p-6">
          <p className="eyebrow mb-2">We are</p>
          <p className="text-lg font-semibold">Confident, precise, operator-minded, direct, evidence-led</p>
        </div>
        <div className="bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-eyebrow text-og-radish">We are not</p>
          <p className="text-lg font-semibold">Hype-driven, breathless, salesy, academic, cute for cuteness's sake</p>
        </div>
      </div>

      <VoiceExample />

      <div className="mt-14">
        <Heading as="h2" id="pass-fail-rules" className="scroll-mt-24 reference-section-title">The pass/fail rules</Heading>
        <p className="measure mt-2 text-sm leading-6 text-muted-foreground">These are binary checks. If a draft violates any of them, it fails review.</p>
        <ol className="mt-6 grid gap-x-10 border-t border-border lg:grid-cols-2">
          {VOICE_RULES.map((rule, index) => (
            <li key={rule} className="flex gap-3 border-b border-border py-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-og-radish/10 text-xs font-extrabold text-og-radish">{index + 1}</span>
              <span className="text-sm leading-6">{rule}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14">
        <Heading as="h2" className="reference-section-title">Use this, not that</Heading>
        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-white">
          <div className="grid grid-cols-2 bg-og-midnight px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
            <span className="text-og-green">Use</span>
            <span className="text-white/55">Avoid</span>
          </div>
          {TERMS.map(([use, avoid]) => (
            <div key={use} className="grid grid-cols-2 gap-4 border-t border-border px-5 py-3 text-sm first:border-0">
              <span className="font-semibold">{use}</span>
              <span className="text-muted-foreground">{avoid}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
