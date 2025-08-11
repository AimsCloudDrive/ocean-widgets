import { defineConfig } from "@msom/xbuild";
import dts from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
  plugins: [],
  build: {
    external: [/^@msom\//],
    plugins: [
      dts({
        tsconfig: "./tsconfig.json",
        paths: {},
        noCheck: true,
        sourceMap: true,
      }),
    ],
    jsx: {
      mode: "automatic",
      jsxImportSource: "@msom/dom",
    },
    input: "./src/index.ts",
    output: [
      {
        sourcemap: true,
        dir: "./dist",
        format: "esm",
      },
    ],
  },
  dev: {
    port: 9999,
  },
});
