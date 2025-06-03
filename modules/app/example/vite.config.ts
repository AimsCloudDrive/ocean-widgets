import babel from "@rollup/plugin-babel";
import dts from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "vite";
import viteRollupBabelPlugins from "../../../vite.rollup.babel.plugins";

const SourceCommentRegExp = /^\*[\s\S]*?Source:[\s\S]*?$/;

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        dts({
          tsconfig: "./tsconfig.json",
          paths: {},
        }),
        babel({
          babelHelpers: "bundled",
          presets: [
            ["@babel/preset-env", { targets: "> 0.25%, not dead" }],
            ["@babel/preset-typescript", { allowDeclareFields: true }],
          ],
          plugins: viteRollupBabelPlugins,
          sourceMaps: "inline",
          exclude: "node_modules/**",
          extensions: [".ts", ".js", ".tsx", ".jsx"],
          babelrc: false,
        }),
        terser({
          ecma: 2020,
          compress: {
            keep_fargs: false,
          },
          mangle: { properties: { keep_quoted: "strict" } },
          keep_classnames: true,
          keep_fnames: true,
          format: {
            braces: true,
            comments: SourceCommentRegExp,
          },
        }),
      ] as any[],
      external: /^@ocean\//,
    },
    target: ["esnext"],
    sourcemap: true,
  },
});
