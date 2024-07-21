import { defineConfig } from "tsup";

export default {
  entry: ["src/index.ts"],
  clean: true,
  output: "miniprogram_dist",
  dts: true,
  minify: false, // 压缩选项
  format: ["iife"],
  target: "es5",
  noExternal: ["@noble/curves"],
  tsconfig: "tsconfig.json",
  esbuildOptions(options) {
    if (options.define) {
      options.define.__BUILD_TS__ = Date.now().toString();
      options.define.import = "require";
    }
    options.globalName = "ocean-common";
    options.supported = {
      "dynamic-import": false,
    };
  },
};
