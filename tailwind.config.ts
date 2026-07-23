import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Ordergroove Brand Hub — Tailwind theme.
 *
 * The `og` palette holds canonical brand values verified against brand.md
 * (see docs/Phase 0 - Old Hub Content Audit.md). The green contrast rule is
 * encoded as two tokens: `og.green.DEFAULT` (#00FF85) for dark backgrounds,
 * `og.green.light` (#009A50) for light backgrounds. Never use the dark-bg
 * green as text on white.
 *
 * NOTE: D1 (logo-on-white ring green) and D2 (Green-300 ramp value) are still
 * open in the audit. The ramp below uses the canon value #009A50 for green-300.
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
            light: "#009A50", // green for LIGHT backgrounds
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        // Signature gradient (Green -> Cyan, on dark)
        "og-signature": "linear-gradient(135deg, #00FF85, #00FAFF)",
        // Web brand gradient (canon brand.md — deliberate, distinct from marketing stops)
        "og-web": "linear-gradient(135deg, #E0FE00, #0BFE5F, #00FEFE)",
        // Purple -> Blue -> Green (Gradient 1, hexes from old hub)
        "og-purple": "linear-gradient(135deg, #7821F5, #71ACFF, #00FF85)",
        // Orange -> Yellow (approved, generated at conversion)
        "og-warm": "linear-gradient(135deg, #FF8500, #EAFF00)",
      },
      keyframes: {
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
