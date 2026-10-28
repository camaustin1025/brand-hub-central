import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { socialTemplateBuildErrors } from "./scripts/validate-social-templates";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    {
      name: "validate-social-templates",
      buildStart() {
        const errors = socialTemplateBuildErrors(path.resolve(__dirname, "public"));
        if (errors.length) this.error(`Social template validation failed:\n${errors.join("\n")}`);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
