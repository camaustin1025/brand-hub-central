import { build } from "vite";
import path from "node:path";
import { URL } from "node:url";

// Compile in memory with existing Vite tooling, without a server or new dependency.
const bundle = await build({
  configFile: false,
  logLevel: "error",
  define: { "import.meta.url": JSON.stringify(new URL("../src/data/social-template-fixture.ts", import.meta.url).href) },
  build: { target: "node22", ssr: path.resolve("scripts/social-customizer-checks.ts"), write: false, minify: false },
});
const output = Array.isArray(bundle) ? bundle[0].output : bundle.output;
const entry = output.find((item) => item.type === "chunk" && item.isEntry);
if (!entry) throw new Error("Social checks did not compile.");
try {
  await import(`data:text/javascript;base64,${Buffer.from(entry.code).toString("base64")}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
