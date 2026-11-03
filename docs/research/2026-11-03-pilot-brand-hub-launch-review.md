# Pilot reference: recommendations for the Brand Hub launch

November 3, 2026 · Review complete · Recommendations only

**Finish the practical guidance and self-service paths in the existing hub.** Keep the current homepage, navigation, visual identity sections, and Design canvas. The most useful launch additions are a real Quick reference, examples that demonstrate the rules, consistent access to existing files, and an approved brand brief employees can give AI tools.

## What Pilot contributes

[Pilot’s marketing system](https://design.pilot.com/marketing/) combines a quick reference, live specimens, side-by-side correct/incorrect treatments, contextual brand guidance, downloadable Markdown, a starter prompt, and links to source assets. Its useful lesson is connecting a rule to an example and a usable resource. Its separate technical reference serves people implementing marketing sites.

For Ordergroove, apply that teaching method to employees’ actual tasks. Retain OG’s approved typography, gradients, logo exceptions, and icon treatments. Pilot’s visual prohibitions and numerical specifications belong to Pilot; adopting them wholesale would introduce conflicting brand rules.

## What is already present

The signed-in [live hub](https://grooveguide.lovable.app/) already has tiered click-to-copy colors, four logo/mark PNGs, a Zoom background, a Figtree ZIP link, typography specimens, background-specific logo guidance, an interactive icon comparison, and a gradient preview with CSS, PNG, and Figma links. Design canvas has employee and event graphics. [AI Resources & Guidance](https://grooveguide.lovable.app/ai-resources) already contains Slides 2.0 beta instructions and a copyable prompt. These are extensions to finish, rather than new sections to recreate.

## Five launch changes, in priority order

### 1. Give Quick reference its own useful content

**Observed:** The homepage’s “View quick reference” action changes the URL to `#quick-reference` but lands at Grab-and-go assets. The two hero actions effectively lead to the same resource area.

**Implement:** Add a compact summary at that existing anchor, above Downloads. Cover the correct logo for each background, Figtree and its download, the green accent rule with readable text examples, a link to the voice rules, and a real help destination. Keep the longer explanations in their existing sections.

**Done when:** An employee can identify the correct logo and green treatment from the summary, and each shortcut reaches the specific guide or file. Quick reference and Browse assets have distinct purposes.

### 2. Demonstrate the rules with a few OG examples

**Observed:** The hub explains logo spacing and color roles and shows separate type specimens. It does not yet demonstrate common visual mistakes alongside their corrections. The voice page has principles and terminology, but no worked before/after passage.

**Implement:** Add three compact visual comparisons within the relevant sections: correct versus incorrect logo/background use; readable text and restrained accents; and one layout showing type hierarchy, grouping, spacing, and selective gradient use. Reuse an existing OG composition as the layout reference. Add one short voice before/after pair drawn from reviewed material.

Treat these as illustrations of established rules. Unsettled shape orientation, new measurements, and new photography rules need a source and owner review before they become requirements.

**Done when:** Each example identifies the specific change and explains why it helps. Examples contain no invented customer proof, quotations, or product claims. The layout makes OG’s style recognizable without requiring someone to assemble it from isolated swatches.

### 3. Make existing resources consistently findable

**Observed:** Downloads lists five PNG assets. The font ZIP is linked from Typography, but its Downloads record still has no URL. A light-logo SVG is available through the hero, and the gradient download is in its own section. Those files are not all represented in the shared asset inventory. Live search for “SVG” returned “No matching section,” despite the hero’s SVG resources.

Search now includes section metadata and published social templates, so the earlier description of it as section-only is outdated. It still does not index individual asset records. A live keyboard check also showed search results disappearing after Tab moved focus into a result; the input’s delayed blur handler closes the popup.

**Implement:** Use one maintained resource inventory for Downloads, hero links, guide links, and asset search. Register the existing font ZIP, original gradient, and verified SVG formats. Give each available format its actual URL. Preserve review holds and hide unavailable exports. Keep search open while focus remains within the input/results group, with visible focus and predictable selection and dismissal.

**Done when:** Searches such as “SVG,” “Figtree,” “Zoom,” and “logo for white background” reach the relevant resource. A keyboard user can select a result. File labels, previews, and actual exports agree. This needs a small local index, not a new search service or AI assistant.

### 4. Offer a small, approved brand brief for AI work

**Observed:** `llms.txt` is a short orientation and page index. The existing prompt covers slide creation. Neither is a complete, downloadable, general-purpose employee brand brief.

**Implement:** Add a “Download brand brief” Markdown file and a general starter prompt to AI Resources. Include the released palette and roles, Figtree, logo exceptions, approved voice guidance, source links, and instructions to preserve supplied facts and flag missing information. State which rules apply to external marketing, internal resources, or slides. Include a version, owner, and review date.

Generate or maintain it from the same reviewed rules used by the hub. Do not publish the old working style guide unchanged: it still contains placeholders and guidance that differs from the current hub, including a held-mark statement. Keep unapproved positioning, proof figures, and draft boilerplate out of the reusable brief.

**Done when:** The file agrees with visible guidance and links to accessible resources. An employee can download it and use the prompt without needing repository access. A universal brand skill and full token exports can follow later. If approval is delayed, ship the core hub without presenting a draft brief as authoritative.

### 5. Complete the access and help instructions

**Observed:** Slides setup begins with “Ask Marketing” for the beta package, without a direct package or request link. Foundation, Voice, Icons, and AI Resources are labeled work in progress. The masthead’s updated date reflects a commit/build date, not a content approval. The Design canvas contact component also has no configured destination.

**Implement:** Provide an access-controlled link to the designated beta package, or a working request link with a named owner. Connect the same help destination from Quick reference and Design canvas. Identify what is released versus beta or draft. Give maintained guidance an actual last-reviewed date; retain accurate WIP labels until the content owner resolves them.

**Done when:** A normal employee can follow the setup or request path without guessing whom to contact. Package and Figma access work for that audience. Internal packages retain their intended access restrictions. This does not require changing sign-in or guest-access behavior.

## What can follow launch

| Later addition | Why it can wait |
|---|---|
| Full web component catalogue, CSS utilities, integration reference | Useful for marketing-site builders, but beyond the employee launch’s core tasks. |
| Full token exports and unified brand skill | Requires source reconciliation and release management. A small approved brief is a bounded first step. |
| Photography library and a larger recipe gallery | Add when approved OG examples and usage rights are available. Use existing Design canvas graphics and the reviewed layout example first. |

Do not add a new homepage, a CMS, more empty download categories, or a broad template-production project to this launch scope.

## Suggested implementation sequence

1. Build the distinct Quick reference and connect a real help destination.
2. Add the reviewed visual and voice examples within the current sections.
3. Consolidate resource links, add asset search, and fix search focus behavior.
4. Release the approved AI brief and finish the beta-package access instructions.
5. Check the employee tasks on desktop and phone, including keyboard search and real downloads, before the authorized launch release.

**Planning estimate:** 2–3 working days for implementation and focused verification if approved examples, files, and access destinations are available. Content approval and new asset production are additional dependencies, not included commitments. Prioritize items 1–3 and usable help/access paths if the AI brief needs longer review.

## Evidence and review limits

Reviewed Pilot’s live marketing system and the signed-in production Brand Hub on November 3, 2026, with visual inspection and targeted checks of Quick reference, search, and AI Resources. Compared findings with local application source on `codex/single-page-brand-hub`, at commit `4e75ef8`. This was not a complete accessibility audit, mobile regression pass, approval audit, or download-file validation.

| Owning source | What it establishes |
|---|---|
| `src/pages/BrandHub.tsx`, `src/components/hub/WorkingCanvasHero.tsx` | Quick-reference anchor, current guide content, and hero resource links. |
| `src/data/assets.ts`, `src/components/brand/AssetTiles.tsx`, `src/components/hub/HubShell.tsx` | Download inventory, single-format buttons, search scope, and delayed blur behavior. |
| `src/components/brand/AiResources.tsx`, `src/data/brand-resources.ts`, `public/llms.txt` | Current beta setup, slide prompt, and agent-facing index. |
| `src/components/brand/VoiceContent.tsx`, `src/components/brand/IconGuidance.tsx`, `src/data/hub.ts` | Existing examples, voice guidance, and WIP status. |
| `content-sources/brand.md`, `content-sources/brand-style-guide.md`, `src/components/social/MarketingContact.tsx` | Canonical exceptions, working-guide debt, and the unconfigured help destination. |

Only this review document was created. No application code, source assets, permissions, database state, or published content was changed.
