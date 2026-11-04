import { build } from "vite";
import path from "node:path";

const bundle = await build({
  configFile: false,
  logLevel: "error",
  resolve: { alias: { "@": path.resolve("src") } },
  build: { target: "node22", ssr: path.resolve("scripts/icon-library-checks.ts"), write: false, minify: false },
});
const output = Array.isArray(bundle) ? bundle[0].output : bundle.output;
const entry = output.find((item) => item.type === "chunk" && item.isEntry);
if (!entry) throw new Error("Icon library checks did not compile.");
try {
  await import(`data:text/javascript;base64,${Buffer.from(entry.code).toString("base64")}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
