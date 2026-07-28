/**
 * The in-page heading map for every route that has one.
 *
 * These used to be a `SECTIONS` const inside each route, feeding a right-hand
 * `OnThisPage` rail on that page. The rail now lives inside the side nav — the
 * active route expands to show its own headings — and the side nav renders
 * above the router outlet, so it cannot read a const the route owns. Keyed by
 * path here, imported by nobody else.
 *
 * The `id` values must match the `id` passed to `ModuleHead` on the route.
 * Nothing enforces that at build time: a typo shows up as a heading that never
 * highlights, not as an error. Check the route when you edit an id.
 *
 * `/downloads` is deliberately absent — its sections are Supabase categories
 * resolved at request time, so a static list here would go stale silently.
 * `/toolkit` is absent because it is one flat grid with nothing to map.
 */

export type PageSection = { id: string; label: string };

export const PAGE_SECTIONS: Record<string, readonly PageSection[]> = {
  "/foundation": [
    { id: "category", label: "The category we own" },
    { id: "belief", label: "Central belief" },
    { id: "audience", label: "Who we serve" },
    { id: "rights", label: "Rights to Win" },
    { id: "ladder", label: "The message ladder" },
    { id: "boilerplate", label: "Company boilerplate" },
  ],
  "/voice": [
    { id: "personality", label: "Personality" },
    { id: "pass-fail", label: "The pass/fail rules" },
    { id: "use-this", label: "Use this, not that" },
  ],
  // Ids come from visual-identity's own `slug()` over the COLOR_GROUPS titles,
  // then the four hand-written sections after them.
  "/visual-identity": [
    { id: "core", label: "Core" },
    { id: "supporting-neutrals", label: "Supporting neutrals" },
    { id: "secondary", label: "Secondary" },
    { id: "gradients", label: "Gradients" },
    { id: "green-legibility", label: "Green legibility" },
    { id: "logo", label: "Logo" },
    { id: "misuse", label: "Misuse" },
  ],
  "/tokens": [
    { id: "kits", label: "Downloadable token kits" },
    { id: "core-color", label: "Core color" },
    { id: "type", label: "Type" },
    { id: "gradients", label: "Gradients" },
  ],
  "/ai-skills": [
    { id: "available", label: "Available now" },
    { id: "assistant", label: "The brand assistant" },
  ],
};
