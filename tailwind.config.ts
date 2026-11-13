import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { BACKGROUND_GRADIENT_CSS } from "./src/data/tokens";

/**
 * Ordergroove Brand Hub — Tailwind theme.
 *
 * The `og` palette holds canonical brand values verified against brand.md
 * (see docs/Phase 0 - Old Hub Content Audit.md). The green contrast rule is
 * encoded as two tokens: `og.green.DEFAULT` (#00FF85) for dark backgrounds,
 * `og.green.light` (#008847) for light backgrounds. Never use the dark-bg
 * green as text on white.
 *
 * D1 resolved 2026-10-26: supplied logo-on-white keeps #00CC6A as a logo-only
 * exception, not a UI token. D2 resolved 2026-11-12: green on light is #008847.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // --- Ordergroove canonical brand palette ---
        og: {
          midnight: "#17132F",
          indigo: "#2E2A47",
          green: {
            DEFAULT: "#00FF85", // Groovy Green — DARK backgrounds only
            light: "#008847", // green for LIGHT backgrounds
          },
          cyan: "#00FAFF",
          lemon: "#EAFF00",
          carrot: "#FF8500",
          radish: "#D32E55",
          flamingo: "#FF61D3",
          eggplant: "#8500FF",
          // Neutral ramp (verified against canon)
          gray: {
            100: "#17132F",
            200: "#2E2A47",
            300: "#4F4A6A",
            400: "#666279",
            500: "#787688",
            600: "#9896A7",
            700: "#ABA9BA",
            800: "#D8D7DF",
            900: "#EBEAF0",
            950: "#F5F5F8",
          },
        },
        // --- shadcn/ui semantic tokens (CSS-var driven) ---
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Figtree", "system-ui", "sans-serif"],
        figtree: ["Figtree", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.16em",
      },
      // One radius, 8px, on every surface. The shadcn lg/md/sm steps all
      // resolve to the same token so nothing drifts back to a softer corner.
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      backgroundImage: {
        // Cyan to Lemon, the only brand gradient (from src/data/tokens.ts)
        "og-gradient": BACKGROUND_GRADIENT_CSS,
      },      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
