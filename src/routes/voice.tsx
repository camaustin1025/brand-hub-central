import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleHead } from "@/components/brand/SectionHead";
import { Kicker } from "@/components/brand/Kicker";

export const Route = createFileRoute("/voice")({
  component: Voice,
});

const RULES = [
  'Never lead with "AI" or "AI agents." No "AI-powered." The category and outcome lead; the technology supports.',
  '"Subscriptions" must appear in any hero subhead.',
  "No em-dashes anywhere. Use commas, colons, or periods.",
  '"Everychannel" is one word. Always.',
  "Never name competitors in any external material.",
  'No "out of the box." Say "ready on day one" or "no custom builds required."',
  'No "heartland intelligence." Say "diversified data."',
  'No "Relationship Commerce." The category is Autonomous Subscriptions.',
  'Avoid "build" as the adoption verb. Use launch, deploy, activate, adopt.',
  'Never frame the company as "new." Ordergroove is 16 years old.',
  'No AI-tells: delve, seamless, innovative, game-changing, "excited to announce," "experience" as filler.',
];

const TERMS: [string, string][] = [
  ["Subscribers", "Users, customers (in subscription context)"],
  ["Retention", "Churn prevention"],
  ["Flexible subscriptions", "Locked-in programs"],
  ["Everychannel / omnichannel", "Multi-channel"],
  ["Recurring revenue", "MRR/ARR in marketing copy"],
  ["Built for scale", "Enterprise-grade"],
  ["Diversified data", "Heartland intelligence"],
  ["Autonomous Subscriptions", "Relationship Commerce"],
  ["Launch, deploy, activate", "Build (as adoption verb)"],
  ["Ready on day one", "Out of the box"],
];

function Voice() {
  return (
    <>
      <PageHeader
        eyebrow="Voice & Language Rules"
        title="How we sound, and the lines we don't cross"
        subhead="Ordergroove sounds like the confident operator in the room who doesn't need to shout. Calm authority earned from 15+ years of doing the work."
      />

      {/* The contents rail that used to hold columns 9–12 moved into the side
          nav, so the body takes the full field. */}
      <section className="site-container grid-12 section-step section-end">
        <div className="col-span-12">
          <div>
            <ModuleHead id="personality" title="Personality" />
            <div className="block-step grid gap-4 sm:grid-cols-2">
              <div className="visual-container border border-border bg-card p-5">
                <Kicker as="p" className="mb-2">
                  We are
                </Kicker>
                <p className="text-sm">
                  Confident, precise, operator-minded, direct, evidence-led.
                </p>
              </div>
              <div className="visual-container border border-border bg-card p-5">
                <Kicker as="p" className="mb-2">
                  We are not
                </Kicker>
                <p className="text-sm">
                  Hype-driven, breathless, salesy, academic, cute for cuteness's sake.
                </p>
              </div>
            </div>
          </div>

          <div className="module-step">
            <ModuleHead
              id="pass-fail"
              title="The pass/fail rules"
              aside={<span className="text-sm text-muted-foreground">{RULES.length} checks</span>}
              note="These are binary checks. If a draft violates any of them, it fails review. Each exists because of a real cost we've already paid."
            />
            {/* Hairline-joined rows, not a loose stack: eleven equally spaced
                lines had no grouping at all, so nothing marked where one rule
                ended and the next began. */}
            <ol className="block-step border-t border-border">
              {RULES.map((rule, i) => (
                <li key={i} className="flex gap-3 border-b border-border py-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm">{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="module-step">
            <ModuleHead id="use-this" title="Use this, not that" />
            <div className="block-step overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card">
                    <th className="p-3 text-left font-semibold text-primary">Use</th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">Avoid</th>
                  </tr>
                </thead>
                <tbody>
                  {TERMS.map(([use, avoid]) => (
                    <tr key={use} className="border-t border-border">
                      <td className="p-3 font-medium">{use}</td>
                      <td className="p-3 text-muted-foreground">{avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
