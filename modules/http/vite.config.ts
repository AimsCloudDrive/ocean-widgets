import { defineConfig } from "vite";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    resolve(),
    commonjs(),
    typescript({ noEmit: true, emitDeclarationOnly: true }),
    terser({ sourceMap: true, module: true }),
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: "src/index.ts",
      output: {
        name: "ocean-http",
        dir: "./dist",
        entryFileNames: "index.js",
        format: "umd",
      },
    },
    sourcemap: true,
    minify: false,
    lib: {
      entry: "src/index.ts",
      name: "HTTP",
      formats: ["es"],
    },
  },
});
