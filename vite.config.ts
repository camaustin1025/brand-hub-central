import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "child_process";
import { socialTemplateBuildErrors } from "./scripts/validate-social-templates";

// The masthead's "Updated" date: the last commit's day, or the build day when
// the build has no git history to read.
function lastUpdated() {
  try {
    const day = execSync("git log -1 --format=%cs", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(day)) return day;
  } catch {
    // No git: fall through to the build day.
  }
  return new Date().toISOString().slice(0, 10);
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  define: {
    __LAST_UPDATED__: JSON.stringify(lastUpdated()),
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
