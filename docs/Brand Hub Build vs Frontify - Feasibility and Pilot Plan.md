---
type: project
title: "Brand Hub Build vs Frontify - Feasibility and Pilot Plan"
created: 2026-07-22
status: active
related: ["[[Brand Strategy]]", "[[Ordergroove Voice & Messaging]]"]
tags: [topic/work, type/wiki]
---

# Brand Hub: Build vs Frontify

*Prepared 2026-07-22, ahead of the Frontify proposal review with Lauren and Heidi (targeted next Wed/Thu). Decisions already locked with Cameron: Google sign-in via Lovable, templates deferred past v1, marketing hub with downloadable token kits, pilot live before the meeting.*

*See also the companion deep dive: [[Brand Hub Addendum - Asset Search, AI Assistant, MCP]] (same day). It upgrades three cut-list items: asset search becomes a defined v1.5 on Postgres (Algolia only on trigger), the brand assistant becomes a pilot stretch goal via Lovable AI, and runtime MCP becomes a free v1.5 toggle via Lovable's July 15 Agent integrations release.*

---

## 1. Feasibility verdict

**Build it. This is unusually feasible for you specifically, and the reason is not that AI can build websites. It's that the two expensive parts of any brand hub, the content and the update pipeline, already exist on your machine.**

What most companies discover after buying Frontify is that they paid $15-30K for an empty container. The guidelines still have to be written, the assets still have to be organized, the pages still have to be maintained. You are in the opposite position:

- **The content is ~70% written.** `brand-style-guide.md` (v0.1, July 8) is a 344-line, 9-section guide covering foundation, voice, pass/fail language rules, messaging architecture, visual identity, applications, examples, and governance. Its own Section 8.3 says the guide's published home is `[LOCATION TBD: Notion/Drive/internal site]`. This hub is that location. Add `brand.md` (the agent-facing canon) and the salvageable evergreen sections of the old 40-page Frontify PDF (logo rules, color ramps, photography guidance, circle treatments) and v1 content is mostly an editing job, not a writing job.
- **The build is squarely inside your demonstrated pattern.** Lovable scaffold, React/Tailwind/shadcn, GitHub sync, Claude Code edits. That is literally the stack of `summergroove-ab` (Netlify) and `ordergroove-landing-pages` (Liv's repo). Nothing about this project is new muscle.
- **The AI layer is further along in your repo than in Frontify's product.** Their Brand Assistant is a RAG chatbot that can only read guidelines text you wrote. Their MCP server is a beta, enabled per-account by a CSM, one tool-pack at a time, with a written disclaimer of "no formal support" and possible future pricing. Meanwhile you already ship `brand.md` auto-imported into four repos and the vault, three OG-branded skills with bundled fonts and tokens, and a written roadmap (style guide Section 9) for a unified `ordergroove-brand` skill. On the axis you told the Frontify rep mattered most, you are ahead of the vendor.

### The real risks (they are not technical)

**1. Your bandwidth is the whole cost structure.** The pilot needs roughly 3 hours from you this week (breakdown in Section 5), against a live BFCM workstream, the white paper, and everything else. After launch, budget 1-2 hours a month of upkeep. If that hour doesn't happen, risk #2 arrives.

**2. Staleness, and here the evidence cuts an uncomfortable direction for the buy case:** the old hub went stale for three years *inside Frontify*. People kept using it anyway, pulling outdated hex codes. Zack left, updates stopped, "Coming soon!" stubs sat there from 2022. A vendor contract does not keep content fresh; an owner with a frictionless update path does. Your update path would be "edit markdown with Claude, commit, auto-deploy," which is a motion you make daily anyway. That's the honest mitigation, and it's a real one, but the risk stays with you personally.

**3. Bus factor and institutional optics.** A vendor product survives you changing roles; a repo needs a handoff plan. Mitigations: Liv gets repo access from day one (she already owns a GitHub repo in this stack), the README documents the update workflow, and the content is plain markdown that anyone can edit in GitHub's web editor without touching code. Worth saying out loud to Lauren and Heidi rather than letting it be the unspoken objection.

**4. Scope creep is the failure mode that kills DIY hubs.** The moment someone asks for asset search, upload workflows, or approval chains, you are rebuilding a DAM on nights and weekends. The cut list in Section 7 is a commitment, and Section 8 defines the specific triggers where the right answer flips to "buy."

What is *not* a real risk: whether the thing can be built well. Between the style guide, the token canon, and your existing repos, the pilot is a few days of Claude time.

---

## 2. What Frontify offers, module by module, against the $15K

Pricing reality first, from procurement data rather than the sales call: Vendr's observed contracts run **$13.8K to $56K with a median of $32.4K**, so the quoted $15K is the genuine floor and the $30-35K templates package is the median deal, not the high end. Add typical extras: onboarding **$2-15K one-time**, feature modules **$2-8K each**, storage overages, and **3-7% annual renewal escalators**. The free/self-serve tier that hosted your old hub is dead (their help center now files it under "self-service legacy plans," which is why the site vanished once you entered the sales process). One more negotiation-relevant fact: Frontify's own UK G-Cloud procurement document lists the base license as guidelines **or** DAM, with the other as an add-on. "They always come bundled" is packaging, not the rate card.

| What they demoed | How good it really is | DIY equivalent in the pilot | Honest gap |
|---|---|---|---|
| Guidelines pages | Their best module. G2 ~4.5/5. Known annoyances: no undo, confusing front/back-end split | Same content as site pages, from your style guide | None that matters. This is the part you can fully replicate |
| DAM + search | Search is the #1 recurring complaint across G2/Gartner; quality depends on metadata someone must maintain | Download kits for logos/fonts/tokens; deep links into organized Drive for everything else | Real gap only at scale: renditions, rights management, OCR search. You said assets were "less important" in the demo, and you were right |
| Templates module (+$15K) | Real, but a production tool: no auto-resizing text, no Figma components (instances only), all-caps import bug, weaker editing than Canva | Deferred by decision. V1 links to existing Canva/Figma templates, exactly like the old hub's new-hire graphics did | This is Frontify's genuinely hard-to-copy feature. If demand proves out, Canva Business covers the locked-template job at ~$700-750/yr for 3 seats, or we build 2-3 single-purpose generators |
| Brand Assistant AI | GPT-4o RAG over your guidelines text only. Can't see PDFs, images, or video. No independent reviewer praise found | A shared Claude Project preloaded with the style guide, plus the hub serving raw markdown/llms.txt so any AI tool can read canon | None. The company already runs on Claude; this is zero-build |
| MCP server | Beta. CSM-gated enablement, one tool-pack active at a time, "may be unstable," free during beta with pricing "possible" | Raw markdown endpoints now; a real MCP server later if product wants it | Their tool surface is broader today, but you'd be buying a beta promise. Don't buy on the MCP |
| Analytics | Enterprise-tier feature | GA4 tag from day one (marketing's existing stack) | Theirs is prettier and brand-specific. GA4 answers "who visits what," which is the question you actually asked |
| SSO + targeting | Enterprise-tier add-on; permission model praised but called complex | Google sign-in via Supabase, restricted to @ordergroove.com. One gate, no groups | Real gap if you someday need per-agency portals. You said in the demo you mostly won't |
| Newsletters, asset submission, campaign toolkits | Nice-to-haves riding along | Slack #brand, Drive, and a campaign page pattern on the hub | Not worth line-item money |

### Three-year money

| | Year 1 | 3-year total (with escalators + onboarding) |
|---|---|---|
| Frontify, guidelines+DAM | ~$15K + $2-8K onboarding | **~$50-60K** |
| Frontify, with templates | ~$30-35K + onboarding | **~$100-115K** |
| Build (this plan) | ~$0 hard cost (existing Lovable sub, Supabase free tier, GA4 free, Figtree is open-source) | **~$0-1K**, plus your 1-2 hrs/month |
| Build + Canva Business later, if templates prove out | ~$700-750/yr | **~$2-3K** |

The honest framing for leadership: at roughly 10-15 true monthly-active brand users, Frontify costs **$1-3K per active user per year**, for a container around content we have to write ourselves either way. Its differentiators (external agency portals, template self-serve for dozens of non-designers, MAU-scaled distribution) pay off at 50+ active users and multi-brand sprawl. We are not that company this year.

---

## 3. Architecture: the simplest thing that answers your questions

Everything below is a tool you already use. The only new moving part is one Supabase auth config.

```
GitHub repo (source of truth)
├── content/           markdown pages (from brand-style-guide.md + salvaged PDF sections)
├── tokens/            tokens.json + tokens.css + fonts/ + logos/   ← the downloadable kits
├── public/skills/     ordergroove-brand skill zips for download
└── app                Lovable-generated React/Tailwind/shadcn site
        │
        ├── Lovable hosting (pilot URL now; brand.ordergroove.com via a 5-min Ophir DNS ask later)
        ├── Supabase Google sign-in, restricted to @ordergroove.com
        ├── GA4 tag (page + download tracking)
        └── /llms.txt + raw markdown endpoints (any employee's Claude can read canon)
```

**Pages in v1:** Home (latest updates + the four things people actually come for) · Foundation & Messaging · Voice & Language Rules (the pass/fail list, verbatim) · Visual Identity (colors with click-to-copy hexes, type scale, logo rules, shape, photography) · Downloads (logo kit, font kit, Zoom backgrounds, social banners, email signature) · Design Tokens (tokens.json / tokens.css, the developer-kit idea you flagged in the demo) · GTM & Employee Toolkit (links into Drive/Canva for gated material) · AI & Skills (skill downloads + how to use the Brand Assistant Claude Project).

**How updates flow, which is the part that beats Frontify for you:** edit a markdown file or `tokens.json` with Claude Code, commit, site redeploys. `brand.md` stays the agent-facing distillation and gets updated in the same commit, so there is exactly one canon. No CMS login, no content blocks to rearrange, no second place for truth to drift.

**On Google sign-in via Lovable, your question from the decision round:** yes, it works. Lovable apps use Supabase auth, which supports Google OAuth out of the gate; restricting to @ordergroove.com is a small enforcement step (an auth hook rejecting other domains) that Claude can wire in minutes. Two honest caveats. First, this is workspace-login-grade gating, entirely appropriate for content that sat on a public URL for three years; anything genuinely sensitive stays behind Drive links, which enforce Google auth on their own. Second, sign-in breaks link unfurls in Slack, which is a small daily tax the public option didn't have. Given your answer I've planned for sign-in, and it does buy a cleaner story for Ophir and for the "is this legit" optics with leadership.

**Security review:** nothing sensitive is stored (Supabase holds auth emails, nothing else; no customer data anywhere). This needs a heads-up to Ophir, not a procurement review, and that's a genuine advantage over the vendor path, which pulls in legal for contract review regardless.

---

## 4. Pilot plan: prove the loop by next Wednesday

The pilot's job is to walk into the proposal review with a live URL that answers the demo's own script. Phases are sequenced so your time lands in three short sittings.

| Phase | What happens | My time | Your time |
|---|---|---|---|
| 1. Content freeze (today/tomorrow) | I convert the style guide + brand.md + evergreen PDF sections into site content, build tokens.json/css from canon, assemble font/logo kits from local assets, draft Home | The bulk of it | **60-90 min:** one pass over the style guide's 12 `[OPEN]`/`[TO GATHER]` flags. Resolve what you can, mark the rest "draft" (the hub can show a draft badge honestly) |
| 2. Build (day 2-3) | You start the Lovable project and connect GitHub (it's your account); I build pages, auth with domain restriction, downloads, GA4, llms.txt | Heavy | **~30 min:** kick off the Lovable project, then a click-through with taste notes (theme, density, what's on Home) |
| 3. Dry run (day 4-5) | Acceptance test below, run for real. Liv as second user. I fix what fails and produce a one-page cost comparison as the meeting leave-behind | Fixes + leave-behind | **~45 min:** run the acceptance list yourself, have Liv try it cold, decide live demo vs screenshots for the meeting |

Total: **~2.5-3 hours of you**, spread across the week. Everything else is my time. If the week blows up, phases 1-2 alone still produce something demoable.

---

## 5. What I need from you

1. **Say go, and do the Lovable kickoff** - create the project, connect the GitHub repo, flip on Supabase. It's your account, so I can't do this part. *(10 min)*
2. **The open-flags pass** on `brand-style-guide.md` - the 12 marked items, mostly picks not prose (boilerplate approval status, "15+ years" vs "16 years," Slack channel name, guide's official home = this hub). *(60-90 min)*
3. **Asset clearance call:** confirm what's fine on a signed-in-employees hub vs Drive-link-only (exec headshots and customer logos are the judgment calls; everything else is obvious). *(15 min)*
4. **Point me at the current Zoom backgrounds / social banners / email signature doc** if they live somewhere fresher than the old PDF's links. A Drive link each is plenty. *(10 min)*
5. **Acceptance run + Liv's cold test** in phase 3. *(45 min)*
6. **Meeting call:** live URL or screenshots in the Lauren/Heidi review. *(5 min, decide day-of)*
7. *(Post-pilot, optional)* **DNS ask to Ophir** for brand.ordergroove.com, plus the security heads-up. I'll draft the Slack message; you send it. *(5 min)*

---

## 6. Acceptance test: what "working" means

Built from the questions you yourself asked in the Frontify demo. The pilot passes when:

1. **The green question.** Someone lands on Visual Identity and can answer "which green goes on a Midnight background?" in under 30 seconds (Green-500 `#00FF85` on dark, Green-400/`#009A50` on light), with click-to-copy hexes.
2. **The AE event post.** From Home, an AE reaches the "I'm going to [event]" template (v1: the Canva/Figma link) in under a minute, without asking you.
3. **The new hire.** Day-one employee finds Zoom background, email signature, and LinkedIn banner in one visit, zero Slack DMs to you.
4. **The skills use case you pitched them.** An employee downloads the OG Claude skill zip from the AI page and installs it. (This was your "could the DAM host our skills" question; here it's just a file on a page.)
5. **The tokens kit.** A designer or engineer downloads `tokens.css`, and every value matches `brand.md` exactly. Spot-check Midnight `#17132F`, the green pair, the gradient stops.
6. **The MCP-style prompt, without an MCP.** Point Claude at the hub's llms.txt and ask for a payment-agent LinkedIn draft. Output must pass the Section 3 pass/fail rules (no em-dash, "subscriptions" in the subhead, no "AI-powered," no competitor names). That is the demo's AI promise, reproduced for free.
7. **The gate.** @ordergroove.com signs in; a personal Gmail is refused.
8. **The analytics question you asked them.** After the dry run, GA4 shows who visited which pages, which is the exact traffic curiosity you had about the old site (and in Frontify, an Enterprise-tier feature).

---

## 7. What v1 deliberately cuts, and why

- **DAM and search.** Out of the pilot, but now specced as v1.5 rather than cut outright: see the addendum's DAM-lite plan (Postgres search + Claude tagging at ingest, 2-3 days, $0). Drive stays the working-file home either way; the hub publishes finals only. Search is Frontify's most-complained-about feature, and at our 50-150 launch assets the database we already run matches it in practice.
- **Templates module.** Deferred by your call. Existing Canva/Figma links carry v1, matching how the old hub actually worked. If hub analytics show template hunger: first option is 2-3 single-purpose generators (event post, customer-launch post, email header) in your coded-UI pattern; fallback is Canva Business at ~$700/yr. Both are a rounding error against the $15K module.
- **Embedded chat widget.** Upgraded to a pilot stretch goal: Lovable AI supports a server-side assistant with our full canon in the system prompt (no RAG, roughly half a day; addendum Section 3). The shared Claude Project remains the zero-build fallback.
- **A real MCP server.** Stays out of the pilot, but Lovable's Agent integrations (shipped July 15) turns the published hub into a hosted, sign-in-gated MCP server as a free toggle; planned for v1.5 after a few days of testing (addendum Section 4). llms.txt and raw markdown ship in the pilot and remain the boring fallback that never breaks.
- **Asset submission / approval workflows, newsletters, granular targeting, employer-brand portal.** Slack, Drive, and one domain gate cover all of it at this headcount.
- **Any "Coming soon!" page.** The old hub's empty Business Cards and Swag stubs sat there for years telling every visitor the hub was abandoned. V1 ships only pages with real content. This is a rule, not a preference.

---

## 8. So is Frontify worth it?

**Not at $15-30K a year, not for this team, not this year.** The demo's value stack falls into three piles: things you already have in better shape than the product (guidelines content, AI brand context), things a link can do (asset downloads, employee toolkits, campaign pages), and things you genuinely can't replicate cheaply (the templates module at org scale, institutional permanence, permissioned external portals). You deferred the first, and the other two are 50-user problems being sold to a 3-user team. Paying the observed median of ~$32K, or even the floor $15K plus onboarding plus escalators, buys a container for work that stays on your plate either way.

**When the answer flips to buy:** any two of these and the math changes - true monthly-active brand users pass ~50; external agencies need self-serve asset distribution weekly; template demand outgrows 2-3 formats and the Canva/generator path visibly strains; or the hub sits stale for two consecutive quarters because the 1-2 hours a month stopped happening. If that day comes, walk in with this pilot as proof you can leave, and negotiate accordingly: the G-Cloud doc's guidelines-OR-DAM base license against the "always bundled" claim, a renewal-escalator cap, onboarding waived (your content is already structured), and MCP terms in writing once it exits beta. Your old account's content transferring over sweetens their side of it.

**The recommendation in one line:** build the pilot this week, put it on the table next to their proposal, and let a live URL argue with a quote. Either it ends the conversation and saves $45-100K over three years, or it becomes the strongest negotiating position a 3-person marketing team has ever walked into a renewal-priced SaaS deal with.

---

*Next step: say go. Phase 1 (content conversion) starts the moment you do, and needs nothing from you until the open-flags pass.*
