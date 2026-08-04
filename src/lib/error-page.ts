/**
 * The 500 fallback, served by the error middleware when SSR throws.
 *
 * It is a standalone document: no app stylesheet, no Tailwind, no custom
 * properties to inherit — so the brand values are written as literals here,
 * which is the one place in the codebase that is correct rather than drift.
 * They still have to *be* the brand values, and they were not: this page ran
 * system-ui on #fafafa with Tailwind's default greys, so the one screen a
 * visitor sees when the hub breaks was the only screen not wearing the brand.
 *
 * Values, all from DESIGN.md:
 *   Cloud #F5F5F8 page, Midnight #17132F ink, Soft Ink #666279 body,
 *   UI accent #008040 primary fill, Figtree, pill buttons at weight 600.
 *
 * Measured contrast: Midnight on Cloud 16.7:1, Soft Ink on Cloud 5.38:1,
 * white on #008040 5.05:1, and the secondary button's Soft Ink border is
 * 5.85:1 on white — the old #d1d5db was 1.47:1, under the 3:1 that WCAG 2.2
 * SC 1.4.11 asks of a control boundary. Soft Ink rather than a new mid-grey:
 * the palette already has a documented neutral that clears the bar.
 */
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load — Ordergroove Brand Hub</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <style>
      /*
       * The face has to be declared here too. This document does not load the
       * app stylesheet, so naming Figtree without an @font-face just falls
       * through to the system stack — which is the bug this page started with.
       * Only the three weights below are used: body 400, buttons 600, eyebrow
       * and heading 700.
       */
      @font-face { font-family: "Figtree"; font-style: normal; font-weight: 400; font-display: swap; src: url("/fonts/Figtree-Regular.ttf") format("truetype"); }
      @font-face { font-family: "Figtree"; font-style: normal; font-weight: 600; font-display: swap; src: url("/fonts/Figtree-SemiBold.ttf") format("truetype"); }
      @font-face { font-family: "Figtree"; font-style: normal; font-weight: 700; font-display: swap; src: url("/fonts/Figtree-Bold.ttf") format("truetype"); }
      body { font: 15px/1.5 "Figtree", ui-sans-serif, system-ui, sans-serif; background: #F5F5F8; color: #17132F; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; -webkit-font-smoothing: antialiased; }
      .card { max-width: 28rem; width: 100%; text-align: center; background: #FFFFFF; border: 1px solid #D8D7DF; border-radius: 20px; padding: 2.5rem 2rem; }
      .eyebrow { font-size: 0.75rem; font-weight: 700; line-height: 1.2; letter-spacing: 0.16em; text-transform: uppercase; color: #008040; margin: 0 0 0.75rem; }
      h1 { font-size: 26px; font-weight: 700; line-height: 1.05; letter-spacing: -0.025em; margin: 0 0 0.5rem; }
      p { color: #666279; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { min-height: 40px; padding: 8px 24px; border-radius: 9999px; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: background-color 0.15s, color 0.15s; }
      .primary { background: #008040; color: #FFFFFF; }
      .primary:hover { background: #17132F; }
      .secondary { background: #FFFFFF; color: #17132F; border-color: #666279; }
      .secondary:hover { background: #F5F5F8; }
      :focus-visible { outline: 2px solid #008040; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { a, button { transition-duration: 0.01ms; } }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="eyebrow">Brand Hub</p>
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
