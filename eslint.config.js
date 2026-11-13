import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "dist-ssr/**",
      ".output/**",
      ".wrangler/**",
      "node_modules/**",
      ".claude/**",
      ".codex/**",
      ".agents/**",
      // Research snapshots and local tool-generated code are not app sources.
      "docs/**",
      "src/impeccable/**",
      // Vendored MediaPipe runtime, copied unchanged from @mediapipe/tasks-vision.
      "public/mediapipe/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [js.configs.recommended],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
  },
  {
    // Preserve Lovable's generated auth adapter; do not restyle its declarations.
    files: ["src/integrations/supabase/previewAuthStorage.ts"],
    rules: { "prefer-const": "off" },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { Buffer: "readonly", console: "readonly", process: "readonly" },
    },
  },
]);
