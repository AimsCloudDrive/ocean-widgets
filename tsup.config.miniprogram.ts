import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  minify: false, // 压缩选项
  format: ["esm", "cjs", "iife"],
  target: "esnext",
  noExternal: ["@noble/curves"],
  tsconfig: "tsconfig.json",
  esbuildOptions(options) {
    if (options.define) {
      options.define.__BUILD_TS__ = Date.now().toString();
      options.define.import = "require";
    }
    options.globalName = "ocean-common";
    options.supported = {
      "dynamic-import": true,
    };
  },
});
