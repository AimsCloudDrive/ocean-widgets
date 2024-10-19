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
    sourcemap: true,
    minify: false,
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      name: "index.js",
      fileName: (format, entry) => {
        console.log("fileName: ", format, entry);
        if (/^esm?$/.test(format)) {
          return `index.js`;
        }
        return `index.${format}.js`;
      },
    },
  },
});
