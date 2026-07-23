---
type: project
title: "Brand Hub Team Brief - Why We're Building It"
created: 2026-07-22
status: active
related: ["[[Brand Hub Build vs Frontify - Feasibility and Pilot Plan]]", "[[Brand Hub Addendum - Asset Search, AI Assistant, MCP]]"]
tags: [topic/work, type/wiki]
---

# The Brand Hub: Why We're Building It Ourselves

*From Cameron, July 22. The decision is at the bottom, the reasoning is everything before it. Ten-minute read.*

---

## Where this came from

We have a brand drift problem, and it finally became visible to everyone. Marketing follows one set of guidelines, product runs on a design system most of us had never seen, and the knowledge center pulls from a third source. Fonts in our product screenshots don't match fonts in our LinkedIn posts. Three teams, three sources of truth.

Part of the story is that our actual brand hub disappeared. We had a Frontify site, built in 2022 on their free plan. Last real update: March 2023. People used it anyway, for years, me included. I was still grabbing hex codes off it this spring, some of them outdated. When I reached out to Frontify to talk about upgrading, the free legacy plan got sunset and the site went dark.

So I did the homework. Two calls with Frontify (intro plus a full platform demo), independent research on their pricing and reviews, and an honest inventory of what we already have. This brief is the result.

## What Frontify costs, really

The quote on the table starts at **$15K a year** for guidelines plus asset management. The templates module, the drag-and-drop self-serve piece, takes it to **$30-35K**. And procurement data says that's not the ceiling, it's the middle: the median Frontify contract runs about **$32K a year**, onboarding is a separate $2-15K one-time cost, and renewals typically escalate 3-7% annually. The features that impressed in the demo have asterisks too. Analytics and SSO are gated to their Enterprise tier. The AI connector (their MCP server, the thing that lets Claude read your brand guidelines) is a beta that your account manager has to switch on, with a written disclaimer of no formal support and possible future pricing.

Over three years, the realistic spend is **$50-60K on the base path, or $100K+ with templates.** For a marketing team of our size, with maybe 10 to 15 people touching brand assets in a given month, that's $1-3K per active user per year.

And here's the part that stuck with me: the money doesn't buy back the actual work. Frontify is a container. The guidelines still get written by us, the assets still get organized by us, the pages still get updated by us. Companies that buy it and let it sit get exactly what we got: a stale site with outdated hex codes. We proved that ourselves for three years.

## What we already have (this surprised even me)

When I sat down to scope the build, the honest answer was that most of it exists.

- **The content is roughly 70% written.** Our brand style guide is a full working draft: foundation, voice, the pass/fail language rules, messaging architecture, visual identity, governance. It was written to be published somewhere; it just never had a home. Add the canonical brand context file our AI tools already use, plus the still-valid parts of the old hub (logo rules, color ramps, photography guidance), and v1 is an editing job, not a writing job.
- **The AI layer is already live.** We have a brand canon file that loads into Claude sessions across our active projects, plus on-brand skills for decks, docs, and LinkedIn posts with the correct fonts and tokens bundled in. This is the thing Frontify's beta is promising to do someday. Ours works today.
- **The build pattern is proven.** The landing pages and campaign sites we've shipped this year use the same stack this hub needs (Lovable, React, GitHub). This is not new ground for us.
- **The asset library is small and manageable.** The curated set (final logos, banners, Zoom backgrounds, social graphics, campaign finals) is 50-150 files at launch. That's a size we can organize well without enterprise software.

## What we're building

**V1, this week: the hub itself.** A clean internal site behind Google sign-in (your @ordergroove.com account, nothing new to remember). Guidelines pages built from the style guide: foundation, voice and language rules, colors with click-to-copy hexes, typography, logo usage, photography. A downloads section: logo kit, font kit, Zoom backgrounds, social banners, email signature. A design tokens page where anyone (including our agency and product design) can grab the exact colors and type values as ready-to-use files. Links into Drive and Canva for the templates and toolkits that already live there. Page analytics from day one, so we finally know what people actually use.

**Also in v1 if the week goes smoothly: a brand assistant on the homepage.** A chat box that answers questions like "which green goes on a Midnight background?" straight from our guidelines, and only from our guidelines. Fun fact: I asked Frontify if their AI assistant could live on the homepage instead of hiding in a corner, and the answer was "maybe we'll make that a content block someday." Ours ships there.

**V1.5, a week or two later: assets and AI connections.** A searchable asset gallery where Claude does the tagging when we upload (and it knows our vocabulary: Summer Groove, Payment Agent, Groovy Green, not generic labels like "green circle"). Search that logs what people look for and can't find, which becomes our roadmap for what to make next. And the piece I'm genuinely excited about: Lovable shipped a feature on July 15 that turns a published app into an MCP server, meaning your Claude or ChatGPT can connect to the hub and check brand rules mid-task. Same Google sign-in, no extra tools. Frontify sells this exact capability as a gated beta.

**Deliberately not building: the templates module.** The drag-and-drop editor where an AE customizes their own event graphic is Frontify's genuinely hard-to-copy feature, and it's the one that doubles the price. V1 keeps our existing Canva and Figma templates, linked from the hub. If usage data shows real demand for self-serve, we have two cheap paths: Canva's business tier (about $700 a year) or purpose-built mini-generators for our top two or three formats. We are not rebuilding Canva.

## Pros and cons, honestly

**The case for building:**

1. **The money.** Roughly $0 in new spend versus $50-100K+ over three years. Our stack is tools we already pay for or that are free at our scale.
2. **The work was always ours anyway.** Writing and maintaining guidelines is the job either way. We're skipping the container fee, not hiding the work.
3. **Staleness protection, for real this time.** Updates happen the way we already work: edit a file with Claude, and the site updates. No separate CMS to log into and avoid. The old hub went stale for three years inside Frontify; the tool was never the fix. The workflow is.
4. **We're ahead on the part that matters most going forward.** Brand context for AI tools is the future of brand governance, and ours is live while the vendor version is in beta. Our hub makes canon readable by every employee's Claude from day one.
5. **Control.** Homepage assistant, our vocabulary in the tagging, unlimited search analytics, features shipped the week we want them instead of on a vendor roadmap.
6. **Negotiating position.** If we ever do buy, we walk in with a working alternative and real usage data, which is the strongest position a team our size can have in a SaaS negotiation.
7. **It's on-story.** We sell autonomous agents and AI-assisted commerce. Our own brand infrastructure being AI-built and AI-readable is the brand walking its talk.

**The honest cons:**

1. **It lives or dies on us maintaining it.** Mostly me. The realistic upkeep is one to two hours a month, and if that stops happening, we get the stale-hub problem all over again. Mitigations: the update path is genuinely frictionless, a quarterly review goes on the calendar, and the hub gets a visible changelog so staleness is at least obvious. But this is the real risk and I'd rather name it than pretend a vendor contract would fix it. (It didn't last time.)
2. **No vendor support.** If something breaks, it's me and Claude fixing it, not a support ticket. At our simplicity level that's a manageable trade, but it's a trade.
3. **Some of this is bleeding-edge.** The MCP publishing feature is a week old. The AI features meter usage through Lovable credits, and if credits run dry the assistant pauses until topped up. We're early adopters and should expect a rough edge or two. The core hub (pages, downloads, sign-in) sits on boring, stable stuff, so the risky parts are the bonus layers, not the foundation.
4. **No self-serve templates at launch.** If you were hoping to customize your own event graphics without a designer, that's the one demo feature we're deferring. Speak up if this is a bigger pain than I think; the data will tell us too.
5. **Single-maintainer risk.** If I'm out or slammed, updates wait. Mitigations: Liv gets access from the start, content is plain files anyone can edit, and the how-to lives in the project itself.

## Bandwidth, time, and money

| | Building it | Buying Frontify |
|---|---|---|
| Cash, year one | ~$0 (existing tools) | $15-35K + $2-15K onboarding |
| Cash, three years | ~$0-3K (only if we add Canva Business or paid search later) | ~$50-115K with escalators |
| Setup time | ~1 week to pilot. My hands-on time ~3 hours; Claude does the heavy build | 3-8 weeks typical, plus the same content work either way |
| Ongoing | 1-2 hrs/month, mostly me | Admin time doesn't disappear: guidelines, tagging, and permissions still need an owner |
| Team asks | Liv: backup access + cold-test the pilot (~30 min). Everyone: 10 minutes of feedback in week one, and send me template wishes | Procurement, legal review, security review, then the same content work |

## When we'd revisit buying

This isn't anti-Frontify forever. It's the wrong spend at our size. The triggers that would reopen the conversation: active brand users grow several-fold (think 50+ people in it monthly), external agencies need self-serve asset distribution weekly, template demand clearly outgrows the Canva path, or the hub sits visibly stale for two straight quarters because the upkeep stopped happening. If any two of those hit, we buy, and we do it holding a working alternative and our own usage data.

## The verdict

**We're building it.** The pilot goes live this week, before the Frontify pricing review with Lauren and Heidi, so the conversation happens next to a working thing instead of a slide about one. Frontify's quote answers a problem we mostly don't have yet (enterprise-scale distribution), at a price that doesn't fit a problem we definitely do have (one source of truth, kept current, readable by humans and AI).

What I need from this team: click around the pilot when I share the link, tell me what's missing or confusing, and flag the templates you actually wish you could self-serve. The hub only works if it's the place you actually go, so be picky.

Questions, pushback, strong opinions: #brand or my DMs. All welcome.
