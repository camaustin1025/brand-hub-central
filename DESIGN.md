---
name: Ordergroove Brand Hub
description: The internal reference desk for the Ordergroove brand. Find the file or the rule in seconds.
colors:
  midnight: "#17132F"
  dark-indigo: "#2E2A47"
  groovy-green: "#00FF85"
  green-on-light: "#009A50"
  cyan: "#00FAFF"
  lemon: "#EAFF00"
  carrot: "#FF8500"
  radish: "#D32E55"
  flamingo: "#FF61D3"
  eggplant: "#8500FF"
  white: "#FFFFFF"
  canvas: "#F5F5F8"
  rail: "#F8F8FA"
  hairline: "#D8D7DF"
  slate: "#666279"
  ink-on-dark: "#EBEAF0"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontFeature: "\"ss01\", \"cv01\""
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"cv01\""
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontFeature: "\"ss01\", \"cv01\""
  item-title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.47
    letterSpacing: "normal"
    fontFeature: "\"ss01\", \"cv01\""
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
    fontFeature: "\"ss01\", \"cv01\""
  body-sm:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "normal"
    fontFeature: "\"ss01\", \"cv01\""
  control:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "\"ss01\", \"cv01\""
  eyebrow:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.16em"
    fontFeature: "\"ss01\", \"cv01\""
  nav-label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.12em"
    fontFeature: "\"ss01\", \"cv01\""
rounded:
  mark: "4px"
  base: "8px"
  pill: "9999px"
spacing:
  hair: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  masthead: "64px"
  rail-width: "284px"
  content-max: "1060px"
components:
  button-primary:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.white}"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-inverse-hover:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.white}"
  button-compact:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  download-link:
    textColor: "{colors.midnight}"
    typography: "{typography.control}"
    rounded: "{rounded.mark}"
    padding: "4px"
  input-search:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: "0 16px 0 48px"
    height: "48px"
  nav-item:
    textColor: "{colors.midnight}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.base}"
    padding: "8px 12px"
  nav-item-active:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    rounded: "{rounded.base}"
    padding: "8px 12px"
  nav-group-label:
    textColor: "{colors.dark-indigo}"
    typography: "{typography.nav-label}"
    rounded: "{rounded.base}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    rounded: "{rounded.base}"
    padding: "16px"
  tag-wip:
    textColor: "{colors.midnight}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  page-header:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.white}"
    typography: "{typography.headline}"
    padding: "32px 40px"
---

# Design System: Ordergroove Brand Hub

## Overview

**Creative North Star: "The Reference Desk"**

The hub is a well-run reference desk. Everything is labeled, shelved where you expect it, and handed over in seconds. People arrive from a Slack link or the search box with one need (a logo, a hex, a voice rule, a Claude skill) and the system's job is to get out of the way between them and the answer. Pages are calm and light; the desk itself (masthead, page headers) is Midnight; Groovy Green is the spark that tells you where you are and what you can take.

The mood is precise, quick, and quietly electric. Density is comfortable rather than airy: compact rows, two button sizes, 13 to 16px working type, with display weight reserved for page and chapter openers. Components are tactile and confident. Actions answer a hover or a click with a decisive change: a full Midnight inversion, a green highlighter swipe, a check that pops in. Because people copy what they see here, the hub follows the brand's own rules to the letter: Figtree everywhere, the two-greens contrast rule, Midnight labels on green.

**Key Characteristics:**
- Midnight chrome (masthead, page headers) framing a light canvas (#F5F5F8) with white surfaces
- One surface radius (8px); pills for every button
- Flat at rest; shadows only on floating layers
- Groovy Green as a spark, not a field, on light pages
- Decisive, tactile state changes: inversions, highlighter swipes, pop-in checks
- Compact, scannable directories with search and filters first

## Colors

A Midnight-and-light system with one electric accent and a reserve of brand accents used for meaning, not decoration.

### Primary
- **Midnight** (#17132F): The desk. Masthead, page header bands, primary button fill, all body text on light surfaces, labels on green fills.
- **Groovy Green** (#00FF85): The spark, on dark only. Eyebrows and accents on Midnight, the download highlighter fill (with Midnight text on it), hover arrows in the masthead and rail.
- **Green on Light** (#009A50): The same spark on light surfaces. Focus rings, the active rail indicator bar, saved-download checks, any green text on white.

### Secondary
- **Dark Indigo** (#2E2A47): Cards and secondary surfaces in dark mode; the rail's group-label text and its 6% tint background on light.

### Tertiary
- **Lemon** (#EAFF00): Work-in-progress and draft tags only (border plus a 20% tint, Midnight text).
- **Cyan** (#00FAFF), **Carrot** (#FF8500), **Radish** (#D32E55), **Flamingo** (#FF61D3), **Eggplant** (#8500FF): Brand accents shown as specimens and in gradients. Radish doubles as the destructive color. None of them is a UI chrome color.

### Neutral
- **Canvas** (#F5F5F8): Page background behind content.
- **Rail** (#F8F8FA): The left section rail, a half-step lighter than the canvas.
- **White** (#FFFFFF): Cards, table rows, inputs, the active rail item.
- **Hairline** (#D8D7DF): Every border and divider on light surfaces.
- **Slate** (#666279): Secondary text where Midnight is too strong.
- **Ink on Dark** (#EBEAF0): Body text on Midnight surfaces.

### Named Rules
**The Two Greens Rule.** Groovy Green (#00FF85) lives on dark backgrounds only. On light, green is #009A50. Never set #00FF85 as text or a fill on white, and never put white text on either green: labels on green are Midnight.

**The Spark Rule.** On a light page, green marks position and possession (active item, focus, download, saved) and covers a small fraction of the screen. Large green fields belong to brand specimens, not to UI.

## Typography

**Display Font:** Figtree (with system-ui, sans-serif)
**Body Font:** Figtree (with system-ui, sans-serif)

**Character:** One family carries everything. Hierarchy comes from weight (400 to 800), size, and tight negative tracking on display type; stylistic sets ss01 and cv01 are always on.

### Hierarchy
- **Display** (800, 40px rising to 56px by container width, 1.02, -0.03em): Chapter hero titles on Midnight.
- **Headline** (700, 32px on phones, 36px from md, 1.1, -0.02em): Page titles in the Midnight page header.
- **Title** (600, 24px, 1.25, -0.015em): Section headings inside a page.
- **Item Title** (600, 15px, 1.47): Row and card titles in directories.
- **Body** (400, 16px, 1.625): Explanatory copy. Paragraphs cap at the site measure (50ch, which renders 68 to 75 Figtree characters); directory descriptions at 70ch.
- **Body Small** (400, 14px, 1.43): Row descriptions, nav items, meta.
- **Control** (600, 13px): Compact buttons, filter chips, download links.
- **Eyebrow** (600, 12px, 0.16em, uppercase): Labels above headings. Midnight on light, Groovy Green on dark.
- **Nav Label** (700, 11px, 0.12em, uppercase): Rail group titles.

### Named Rules
**The Statement Rule.** Display and headline type are statements: no trailing periods, `text-wrap: balance`. Paragraphs use `text-wrap: pretty` and fill the measure.

**The Measure-Is-Rendered Rule.** Figtree's `ch` overstates line length by about 30%. Verify line length from rendered line boxes before changing `--measure`.

## Layout

A fixed 64px Midnight masthead (logo, "Brand Hub · Internal reference", search, last-updated stamp) sits above a 284px section rail that docks from 1024px and slides in as a drawer below that. Content sits in a single column capped at 1060px, with 24px gutters on phones and 40px from 768px. Each standalone page opens with a Midnight header band (breadcrumb, headline, one-line purpose, page actions) before returning to the light canvas.

Directories put search and filters first, then results as compact table rows with metadata folded into one disclosure per row. The directory toolbar is sticky under the masthead. Tables collapse to stacked rows through a container query at 44rem, so the layout responds to the content pane, not the viewport. Phones get a Midnight search strip under the masthead unless the page opens on its own search.

**The Search-First Rule.** On any page whose job is finding, the search field and filters come before the content they filter.

## Elevation & Depth

Flat by default. Depth comes from tonal layering: canvas, then white surfaces with hairline borders, then the Midnight frame. Shadows appear only on layers that float above the page (search results, menus) and as a soft lift on the active rail item.

### Shadow Vocabulary
- **Floating layer** (`box-shadow: 0 25px 50px -12px rgba(23, 19, 47, 0.2)`): Search results and popovers.
- **Active item** (`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)` plus a 1px Midnight ring at 5%): The current rail item.

### Named Rules
**The Flat Desk Rule.** Cards and rows never carry a resting shadow. If something needs to read as separate, give it a white surface and a hairline, not a shadow.

## Shapes

One surface radius, 8px, on every card, input, row group, and rail item; the Tailwind sm, md, and lg radii all resolve to it so nothing drifts softer. Every button and filter chip is a full pill. The download highlighter uses a tight 4px mark. The 2022 guide's notched "Visual Container" (three rounded corners and one square) survives as an opt-in for signature brand moments only.

**The One Radius Rule.** Surfaces are 8px, actions are pills. A third radius needs a reason.

## Components

### Buttons
Tactile pills that invert completely on hover.
- **Shape:** Full pill (9999px).
- **Sizes:** Two only. 40px (20px side padding) for the one main action on a surface; 32px (12px side padding, 13px type) for repeated or in-card controls. Compact buttons keep a 44px touch target on coarse pointers.
- **Primary:** Midnight fill, white label, Midnight border. Hover inverts to white with a Midnight label.
- **Outline (secondary):** White fill, Midnight border and label. Hover fills Midnight.
- **Inverse (on Midnight):** White fill, Midnight label. Hover flips to Midnight with a white label.
- **Focus:** 2px ring in the foreground color, offset 2px from the surface.
- **Motion:** 200ms color transitions.

### Download Links
The hub's signature control. A file is a link, not a button: the format name and a download glyph in 13px semibold Midnight. On hover a Groovy Green highlighter swipes in behind the label at a -12deg skew (300ms, cubic-bezier(0.16, 1, 0.3, 1)) while the arrow dips toward the tray. On click the arrow becomes a #009A50 check that pops in. Motion drops out under reduced-motion preferences.

### Chips (filters)
- **Style:** 32px pills, white with a light Midnight border (20% opacity), Midnight label, optional 14px icon.
- **State:** The selected chip fills Midnight with a white label, so it is the only heavy mark in the filter row; unselected chips take a full Midnight border on hover.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** White on the canvas; Dark Indigo in dark mode.
- **Shadow Strategy:** None at rest (see The Flat Desk Rule).
- **Border:** 1px hairline.
- **Internal Padding:** 16px.

### Inputs / Fields
- **Style:** White, 1px hairline border, 8px radius, 48px tall, 16px type, a 19px search glyph inset at the left.
- **Focus:** 2px foreground ring with a 2px offset.

### Navigation
- **Masthead:** Midnight, 64px, white logo; search sits right as a translucent field with a ⌘K hint.
- **Rail:** #F8F8FA with a hairline right edge. Group titles are 11px uppercase Dark Indigo labels on a 6% Dark Indigo tint. Items are 14px medium Midnight with an arrow on links that open their own page. The active item is a white, softly lifted chip with a 2px #009A50 bar on the rail's guide line.
- **Mobile:** The rail becomes a drawer over a blurred Midnight scrim.

### Status Tags
- **WIP / Draft:** Small pill, Lemon border, 20% Lemon tint, Midnight label. Unresolved canon shows this tag rather than being hidden.

### Resource Rows
Directory rows on white with a hairline bottom border: a 32px icon, a 15px semibold Midnight title, a 14px Slate description (up to 2 lines at the site measure), and right-aligned actions (a 32px outline pill plus a 13px semibold underlined Details disclosure). Rows are grouped under 15px bold Midnight type headings with a 13px Slate count; a multi-step workflow collapses into one row with a "Show N steps" disclosure in the same underlined style. Column headers are 12px uppercase Midnight; the result count is 13px Slate. Titles, headings and actions are Midnight; descriptions and counts recede to Slate, so the eye lands on the titles first. Hover tints the row to #FAFAFC; expanded details sit on #F7F7FA.

### Policy Panel
Rules people must follow (what you can share with AI tools) sit in a Midnight block instead of loose text at the end of a page. 8px radius, 40px padding (24px under a 40rem container), with `.dark` on the section so focus rings and link hovers use the dark-surface tokens. All text in the panel is pure white (not Ink on Dark). A 24px bold title with a Groovy Green icon, an intro, then two columns split by a 12% white hairline: a 24px Radish circle with a white X heads what is never allowed, a 24px Groovy Green circle with a Midnight check heads what is allowed with conditions. Items are 16px ruled rows (10% white top border). The lists end the panel; no closing line. Columns stack below 40rem.

## Do's and Don'ts

### Do:
- **Do** use #009A50 for any green on light surfaces and #00FF85 only on Midnight.
- **Do** put Midnight labels on green fills.
- **Do** keep buttons to two sizes: 40px for the main action, 32px for repeated controls.
- **Do** present file downloads as links with the green highlighter, not as buttons.
- **Do** answer every interaction with a decisive state change: a full inversion, the highlighter, a check.
- **Do** give every control a visible keyboard focus ring.
- **Do** open finding pages with search and filters before the content.

### Don't:
- **Don't** set #00FF85 as text or a fill on white, or put white text on any green.
- **Don't** add resting shadows to cards or rows.
- **Don't** introduce a radius other than 8px for surfaces or full pills for actions.
- **Don't** end display or headline type with a period.
- **Don't** use any typeface other than Figtree.
- **Don't** ship placeholder or "Coming soon" surfaces; show real content or a WIP tag.
