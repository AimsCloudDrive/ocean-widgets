import dts from "@rollup/plugin-typescript";
import babel from "vite-plugin-babel";
import { defineConfig } from "vite";
import addSourceCommentPlugin from "./vite-plugins/addSourceCommentPlugin";
import addTsIgnorePlugin from "./vite-plugins/addTsIgnorePlugin";
import createDecoratorPlugin from "./vite-plugins/decorator";
import viteRollupBabelPlugins from "./vite.rollup.babel.plugins";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    babel({
      babelConfig: {
        presets: [
          ["@babel/preset-env", { targets: "> 0.25%, not dead" }],
          ["@babel/preset-typescript", { allowDeclareFields: true }],
        ],
        plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
        sourceMaps: true,
        exclude: "node_modules/**",
        babelrc: false,
      },
    }),
    addSourceCommentPlugin(),
    addTsIgnorePlugin(),
    createDecoratorPlugin(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        dts({
          tsconfig: "./tsconfig.json",
          paths: {},
          noCheck: true,
        }),
      ] as any[],
      external: [/^@ocean\//, "fs", "path"],
    },
    target: ["esnext"],
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    outDir: "./dist",
    lib: {
      entry: ["src/index.ts"],
      name: "index.js",
      formats: ["es"],
      fileName: (format) => {
        if (/^esm?$/.test(format)) {
          return "index.js";
        }
        return `index.${format}.js`;
      },
    },
  },
});
