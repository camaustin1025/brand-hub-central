# Foundation platform hierarchy

`src/components/brand/PlatformHierarchy.tsx` replaces the Products table on `/foundation#products`, using the platform slide supplied November 12, 2026. The slide's channel groups and four platform layers remain in their original order. Provider SVG logos link to their own websites; asset sources are documented in `public/platform-logos/README.md`.

The pattern uses the hub's Figtree type, reference headings, foreground and muted-foreground text roles, border token, 8px corners, light surfaces and Midnight base. Green identifies the growth and AI layers. Paragraph and content text stays high contrast; only the small “Seamlessly integrated” label uses muted text.

The November 12 follow-up edit removes Incentive Agents and Order Orchestration from the AI row, leaving Payment Agents, Retention Agent and Analytics Agent in a centered three-column row (stacked on narrow phones).

Container queries follow the available content width, including the sidebar. Channel groups form three columns at 44rem. Experiences is centered between three cells on either side at 60rem; on smaller layouts its heading moves above the grid. Growth Engine and Ordergroove AI have centered headings above their cells. Developer Platform retains its label column at 44rem. Experience and agent cells wrap into smaller grids without horizontal scrolling. Assistant logos use a two-column grid on smaller layouts and a single row at 60rem.

The platform layers are a static figure. Channel groups and the platform have level-three headings; platform layers have level-four headings and labeled lists. Decorative icons and connectors are hidden from assistive technology. Provider links have accessible logo names, a new-tab announcement and the hub's shared focus and touch-target styles. The enclosing Products heading retains its shared copy-link control and normal keyboard behavior.
