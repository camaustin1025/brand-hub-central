---
type: project
title: "Brand Hub Addendum - Asset Search, AI Assistant, MCP"
created: 2026-07-22
status: active
related: ["[[Brand Hub Build vs Frontify - Feasibility and Pilot Plan]]"]
tags: [topic/work, type/wiki]
---

# Addendum: Asset Search, Brand Assistant, and the MCP Question

*Companion to the main feasibility doc, 2026-07-22. Three deep dives Cameron requested after reading it: can we mimic Frontify's asset search (Algolia?), can Lovable AI power the brand assistant, and does Lovable's new MCP server replace Frontify's.*

## The three answers in brief

1. **Asset search: yes, and for our scale the right engine is the database we already have.** Postgres full-text search plus trigram typo tolerance covers 50-2,000 assets indistinguishably from Algolia in practice, at $0 with no quota cliff. Algolia's free Build plan is real but has three catches that make it wrong for a production internal tool (details below). The proposed DAM-lite feature set is specced in Section 2, and its best feature is one Frontify doesn't have: Claude does the tagging at ingest, with Ordergroove vocabulary.
2. **Brand assistant: yes, Lovable AI supports exactly this**, with one twist (no Anthropic models through their gateway; we can bring our own Claude key if we want) and one design win: our canon is small enough to skip RAG entirely, which sidesteps the failure mode Frontify's assistant is built on.
3. **MCP: the page you linked is the wrong feature, but the right one shipped July 15.** The "Lovable MCP server" drives the Lovable *builder* (build-time). The runtime answer is **Agent integrations** ("publish your app as an MCP server"): the deployed hub itself becomes a hosted, sign-in-gated MCP server, free on all plans. Lovable's launch blog lists "marketing teams testing drafts against brand guidelines" as a headline use case. It is one week old, so we treat it as a fast-follow, not a launch dependency.

---

## 2. Asset search: findings and the proposed feature set

### The scale fact that decides everything

Our published-asset universe is small. The curated set (final logos in all formats, social banners, Zoom backgrounds, campaign finals, customer logos) is realistically **50-150 assets at launch, growing by low hundreds per year**. The working-file volume is much bigger (a single project folder like Payment Recovery Intro holds 425 renders and iterations), but working files never enter a DAM; that's what project folders and Drive are for. Frontify's front-end/back-end split exists to enforce exactly this, and we get it with a `status` flag and an admin-only upload page.

Every search decision below follows from that number. Search infrastructure starts mattering around 5,000+ records and high query volume. We are two orders of magnitude below that.

### What Algolia's free Build plan actually includes (July 2026)

You're right that Build is free, and it's generous on paper: **1M records, 10K searches/month, 10 indices, no credit card**, with the core search features (typo tolerance, faceting, synonyms, the InstantSearch UI libraries) genuinely included on every plan. Algolia restructured pricing in October 2025 (Build → Grow → Grow Plus → Elevate), so most blog math about their plans is stale.

Three catches matter for us:

1. **The quota cliff is a hard stop, not a bill.** Algolia's own support docs: exceed 10K searches and the API returns **403 errors until the next billing cycle**. No card on file means nothing to auto-bill; search just breaks mid-month. And the meter counts *requests*, not human searches: search-as-you-type fires a request per keystroke, so 10K requests is roughly **1-2K real human searches** with an instant-search box. For 30-50 regular hub users, that's within reach of a busy month, and "search is down until the 1st" is the worst possible failure for an internal tool.
2. **Search analytics, the feature we'd actually want, is a 7-day window on free.** Algolia's pricing table only advertises analytics retention starting at Grow (30 days). Multiple independent sources report Build carries roughly 7 days. "What did people search for last quarter" is unanswerable on the free plan.
3. **Inactive free apps get deleted.** Warning around 6 weeks of zero operations, blocked at 8, deleted around 10. A quiet holiday stretch could literally erase the index.

Also: Lovable's Algolia integration is a **credentials connector, not scaffolding**. It stores the API keys securely (backend key proxied, public key validated to search-only) and then you prompt Lovable to write the indexing and search code. No auto-sync from the database, no pre-built UI. Lovable's own docs say it plainly: for "filtering a small list, basic text matching," keep it in your database; reach for Algolia at larger record sets.

### The $0 baseline we'd use instead

Supabase Postgres, which the hub runs on anyway, ships everything we need natively:

- **Full-text search** (`tsvector`, weighted ranking so title outranks tags outranks description, Google-style query syntax) with sub-millisecond response at our row counts. Search-as-you-type works fine with a 150-250ms debounce.
- **pg_trgm** for typo tolerance ("labtop" finds "laptop"). Not Algolia-grade on multi-word queries, but decent, and tunable.
- **Facets** at 2,000 rows are just WHERE clauses with counts. Algolia's faceting advantage is operational at scale we don't have.
- **pgvector** sits there free if we ever want semantic search (below).

What Postgres lacks out of the box is search analytics, and the fix is better than Algolia's free version: a `search_logs` table (query, user, timestamp, result count, what got clicked) written by our own search function. **Unlimited retention versus 7 days**, and "queries that returned zero results" becomes a standing content-roadmap report. For an internal tool, that beats the SaaS dashboard.

### Proposed feature set: DAM-lite

Mapped one-to-one against what Frontify demoed. Build estimate for the whole core tier: **2-3 days of my time, spread across v1.5**, roughly a week or two after the pilot.

| Frontify feature | Our version | How |
|---|---|---|
| Asset libraries + front/back split | Published gallery vs admin upload page | `assets` table with `status` (draft/published/archived); only Cameron/Liv see admin. Finals only, by rule |
| Keyword search | Postgres FTS, weighted (title > tags > OCR text > description) | Built into the database, $0 |
| Typo tolerance | pg_trgm fallback when FTS misses | One extension, one query branch |
| AI auto-tagging (theirs: AWS Rekognition generic labels) | **Claude tags at ingest with OG vocabulary** | Upload triggers a Claude pass: title, description, tags, category, campaign, dark/light background, suggested filename. It knows "Summer Groove," "Payment Agent," "Groovy Green" because we tell it the canon. Cameron approves or edits before publish |
| OCR search (text inside images) | Same Claude ingest pass extracts visible text into `ocr_text`, searchable | Vision call at upload, one-time per asset |
| Filters / conditional facets | Chip filters: format, campaign, category, orientation, background | WHERE clauses with counts |
| Search analytics | `search_logs` table + a small admin report (top queries, zero-result queries, top downloads) | Unlimited retention; feeds what to make next |
| Download tracking | Counter + GA4 event per asset | Trivial |
| Collections / campaign toolkits | Curated groups: "BFCM 2026 kit," "New hire kit," "Event social pack" | A `collections` table; a page per collection |
| Renditions (auto-resize) | **Cut.** We publish the sizes we make | Real Frontify advantage; not worth replicating at our volume |
| Rights/expiry management | **Cut**, except a manual `archived` status | Same |

Storage mechanics per Lovable's docs: files up to 2GB, **private buckets by default with signed URLs** (which matches our sign-in model; public buckets are blocked by default platform-wide and we'd leave them that way). One open item: Lovable Cloud meters storage/bandwidth against a 20-credit monthly grant with no published per-GB rates, so during the pilot we watch the usage dashboard for a week before moving big video files in. If metering surprises us, assets can live in our own Supabase project instead (supported for new projects) where pricing is published and predictable.

### When Algolia enters (or from day one, on Grow)

Two valid paths, decided at v1.5 build time:

**Trigger path:** start on Postgres; add Algolia when assets pass ~5,000 or people actually complain about search quality.

**Day-one path (Cameron's lean, 7/22):** realistic volume is 100-500 human searches a month, far below the limits, so **Algolia Grow from the start** bills approximately $0 most months and maybe $5-10 in a spike week. Grow is monthly with no contract and, per the current pricing page, no base fee (verify at signup; Algolia has hidden floors before): first 10K requests and 100K records included, then $0.50 per 1K searches and $0.40 per 1K records. The card on file converts the free tier's 403 cliff into cents, analytics retention goes from ~7 days to 30, and the nightly sync job keeps the app active regardless (which also neutralizes the inactivity-deletion risk even on free Build). What Grow buys over Postgres isn't capacity, it's polish and self-service: zero-tuning typo tolerance, instant-search UI components, and an analytics dashboard Cameron or Liv can read without an engineer. Either way it's the same `assets` table and Claude-tagging ingest underneath; the difference is about a day of sync wiring (webhook to edge function, or a nightly full reindex, which at 150 records is nearly failure-proof). At our scale even a nightly full reindex is defensible. Skip Grow Plus and Elevate entirely; AI re-ranking and NeuralSearch solve problems a small internal hub doesn't have. Insurance note: Algolia has changed pricing models three times since 2022; if terms shift again, Typesense Cloud (~$7/month flat, no per-search meter) is the escape hatch.

**Semantic search** (the "moody dark photo with green gradients" query) stays a v2 delighter: Lovable AI's docs list Gemini Embedding 2 with multimodal retrieval across text/images/video/PDFs, and pgvector is free, but I found no independent confirmation of the multimodal path working in real apps yet, and browsing plus filters carries a few hundred assets comfortably. Revisit when the library or the requests justify it.

---

## 3. Brand assistant on Lovable AI

**Confirmed workable, and the design is nicer than Frontify's.** Lovable AI gives deployed apps LLM access through an edge function Lovable generates: server-side, streaming, no API keys to manage, system prompt fully ours. Chatbots and document Q&A are their documented use cases.

The design win: **no RAG.** Frontify's Brand Assistant is a retrieval bot over your guidelines text, which means retrieval misses are its core failure mode (and per the earlier research, it can't see images or PDFs at all). Our entire canon (style guide + brand.md + token values) is ~20K tokens. It fits in the system prompt whole. Every answer sees every rule, always: no chunking, no embeddings, no "the assistant didn't find that section." The prompt instructs: answer only from canon, cite the section, say "not in the guide, ask #brand" instead of guessing.

Two realities to plan around:

- **No Claude through their gateway.** Models are Gemini (3 Flash default) and OpenAI's GPT-5.x line; docs state Anthropic models aren't offered. Two options: start on the gateway default, which is fast, cheap, and fine for Q&A over provided context, since the system prompt is doing the brand work; or drop a company Anthropic key into an edge-function secret (a documented Lovable pattern) so the assistant runs on Claude and bills the org account directly. I'd start with the default and swap only if answer quality disappoints.
- **Credits are the meter, and empty credits stop the feature.** AI usage draws from a 4-credit monthly grant, then general workspace credits; when they're gone, the gateway returns errors and the assistant goes down until top-up ($15-30 per 50 credits by plan). Internal Q&A volume is small (this is dozens of questions a day, not thousands), and the AI activity dashboard (shipped July 8) shows burn, but it goes on the ops checklist: check the dashboard when updating content each month.

Privacy notes for the Ophir conversation, both from Lovable's docs: AI request/response logging is retained 90 days and defaults on for Free/Pro workspaces, and the training-data opt-out is a settings toggle only on Business/Enterprise (Free/Pro must contact support). Brand guidelines are low-sensitivity content, so neither blocks the pilot, but if the company wants the opt-out toggle and log default-off, that's an argument for their Business tier eventually.

And the meeting beat: in the demo you told the rep the assistant should live on the homepage, not hide in the top-right, and the answer was "maybe we'll make it a content block." **On our hub it ships as the homepage centerpiece.** Every Q&A gets logged like searches do, so the assistant doubles as a listening post for what the guide is missing. Build estimate: about a half-day inside phase 2, so I'm treating it as a pilot stretch goal rather than v1.5.

---

## 4. The MCP question, answered precisely

**The feature you linked does not do what Frontify's MCP does.** The "Lovable MCP server" (mcp.lovable.dev) is a build-time tool: it lets Claude, Cursor, or ChatGPT drive the Lovable *builder*: create projects, send prompts, read diffs, deploy. Its OAuth grant covers your whole Lovable account. Useful to us while building the hub; irrelevant to an employee asking brand questions. It cannot serve guidelines at runtime, full stop.

**The feature that answers your question is Agent integrations, shipped July 15** ("Let AI assistants use your published app"; docs title: "Publish your app as an MCP server"):

- Lovable **creates and hosts an MCP server for your published app**, proposing tools from the app's actual functionality: for us, things like `search_brand_guidelines`, `get_voice_rules`, `search_assets`, `get_tokens`. We can add, remove, or rename tools by asking.
- **Our Google sign-in stays in the loop.** Connecting users hit the hub's own sign-in screen plus an OAuth consent step, and every tool call acts as the signed-in user, so the same @ordergroove.com gate and row-level permissions apply.
- Works with **ChatGPT and Claude out of the box**, plus anything that speaks remote MCP (Claude Code, Cursor). Distribution is clean on our side: on claude.ai Team/Enterprise, an org admin adds the hub as a custom connector once in Organization settings, then every employee enables it. Confirmed in Anthropic's own support docs.
- **Free on all plans, no separate hosting or per-tool-call fee**; underlying database/AI usage just meters as normal.

The honest caveats, all from Lovable's own docs: it's **one week old** with no independent reliability reports yet; "workspace/internal apps are not supported yet," so the app must be publicly published with sign-in as the gate (which is already our model); there's **no rate limiting or tool-call quota control**; calls time out after tens of seconds; and unpublishing the app kills the server.

Head-to-head with what Frontify is selling:

| | Frontify MCP | Our path (Lovable Agent integrations) |
|---|---|---|
| Status | Beta, "may be unstable," no formal support | GA-labeled, but 1 week old |
| Access | CSM-gated enablement, one tool-pack active at a time | Self-serve toggle, tools we define |
| Price | Free during beta, future pricing "possible" | Free, stated no separate fee |
| Auth | Frontify account | Our Google sign-in + OAuth consent |
| Content it serves | Whatever guidelines you wrote in Frontify | Whatever guidelines we wrote in the hub |
| Fallback if it breaks | Wait for the vendor | llms.txt + raw markdown, which never breaks |

Both are bleeding-edge, and neither should anchor a $15-30K decision, which was the main doc's point. The difference is that ours is free, in our control, and sits on top of a boring fallback that already works: the hub serves llms.txt and raw markdown from day one, so any employee's Claude can read canon with zero infrastructure.

**Sequencing:** llms.txt ships in the pilot. Agent integrations gets flipped on in v1.5 week, tested from my Claude and yours for a few days, then the org-connector ask goes to whoever admins claude.ai. For the Lauren/Heidi meeting, the line is: "Frontify's AI connector is a beta their CSM has to unlock. Ours is live, here's Claude answering from it."

---

## 5. What this changes in the main plan

- **The cut list gets two amendments.** "DAM and search" moves from cut to **defined v1.5** (the DAM-lite spec above, 2-3 days of my time, still zero dollars). "Embedded chat widget" moves from cut to **pilot stretch goal** (half a day via Lovable AI). "A real MCP server" stays out of the pilot but becomes a **v1.5 toggle** instead of a someday-build.
- **Costs don't move.** Everything above runs on the existing stack at $0 hard cost. Algolia enters only on trigger, as Grow, at ~$0-10/month. The only new line item to watch is Lovable credit burn (storage/bandwidth + AI grants), checked on the usage dashboards during pilot week.
- **The meeting story gets stronger.** Three of the four features Frontify demoed as differentiators (search, assistant, MCP) now have concrete, free, dated implementations on our side, and two of them (homepage assistant, ingest tagging with OG vocabulary) are things their product doesn't do.

*Sources: algolia.com/pricing and service-limits docs, Algolia support articles on quota blocking and free-app deletion, docs.lovable.dev (AI, storage, cloud, edge functions, Algolia integration, MCP server, agent integrations) and the Lovable changelog (May 18 through Jul 15, 2026 entries), lovable.dev/blog/agent-integrations, supabase.com docs (FTS, pg_trgm, pgvector, webhooks), Anthropic support doc on custom remote-MCP connectors for Team/Enterprise. All fetched 2026-07-22. Analytics-retention figure on Algolia's free tier is reported by multiple independent sources but absent from Algolia's own table; verify in-dashboard in two minutes if it becomes decision-relevant.*
