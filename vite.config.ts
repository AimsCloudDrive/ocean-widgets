import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
      babel: {
        plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
      },
    }),
    dts({
      outDir: "dist/types",
    }),
  ],
  build: {
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      name: "index.js",
      fileName: (format) => {
        if (/^esm?$/.test(format)) {
          return "index.js";
        }
        return `index.${format}.js`;
      },
    },
  },
});
