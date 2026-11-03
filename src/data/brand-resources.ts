export const ICONS_FIGMA_URL = "https://www.figma.com/design/1LAizYM7R7QVubcHuix1KF/Slide-Skill-2.0?node-id=289-2635";
export const MATERIAL_SYMBOLS_GUIDE_URL = "https://developers.google.com/fonts/docs/material_symbols";
export const CLAUDE_SKILLS_GUIDE_URL = "https://support.claude.com/en/articles/12512180-use-skills-in-claude";

// Verified against Figma Icon Tile (27:782) and Icon Tile Dark (32:803).
// Tile Teal is an icon treatment color, separate from the general palette.
export const ICON_COLORS = {
  light: [
    { name: "Flamingo Pink", hex: "#FF61D3", tint: "rgba(255,97,211,0.12)", image: "light-card-pink" },
    { name: "Tile Teal", hex: "#00BEC0", tint: "rgba(0,190,192,0.12)", image: "light-card-teal" },
    { name: "Brand Green", hex: "#009A50", tint: "rgba(0,154,80,0.12)", image: "light-card-green" },
    { name: "Midnight", hex: "#17132F", tint: "rgba(23,19,47,0.12)", image: "light-card-midnight" },
  ],
  dark: [
    { name: "Groovy Green", hex: "#00FF85", tint: "rgba(0,255,133,0.12)", image: "dark-card-green" },
    { name: "Flamingo Pink", hex: "#FF61D3", tint: "rgba(255,97,211,0.12)", image: "dark-card-pink" },
    { name: "Intense Cyan", hex: "#00FAFF", tint: "rgba(0,250,255,0.12)", image: "dark-card-cyan" },
    { name: "Neon Carrot", hex: "#FF8500", tint: "rgba(255,133,0,0.12)", image: "dark-card-orange" },
    { name: "White", hex: "#FFFFFF", tint: "rgba(255,255,255,0.12)", image: "dark-card-white" },
  ],
};

export const SLIDES_STARTER_PROMPT = "Use the Ordergroove Slides 2.0 skill to turn the attached content into an Ordergroove presentation. Keep the supplied wording, numbers, images, and speaker notes. Use placeholders for anything missing and list those items for review. Ask me for the audience and goal if I haven't provided them.";

// Contact confirmed by Cameron on 2026-11-03; profile and workspace verified in Slack.
export const MARKETING_CONTACT = {
  label: "@cameron.austin",
  url: "https://ordergroove.slack.com/team/U07HGNK3VJ5",
};
