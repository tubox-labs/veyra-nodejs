import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/lib/streamHelpers.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  splitting: false,
  clean: true,
  treeshake: true,
  target: "node18",
  outDir: "dist",
  outExtension: ({ format }) => ({ js: format === "esm" ? ".mjs" : ".cjs" }),
  esbuildOptions: (options) => {
    options.conditions = ["import", "require"];
  },
});
