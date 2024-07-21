import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/index.ts",
  output: {
    name: "ocean-common",
    file: "dist/index.js",
    format: "umd",
    sourcemap: true,
  },
  plugins: [
    json(),
    typescript(),
    commonjs(),
    resolve(),
    terser(),
    babel({ babelHelpers: "external" }),
  ],
};
