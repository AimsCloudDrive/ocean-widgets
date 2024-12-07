import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react({
        jsxRuntime: "classic",
      }),
      dts({
        outDir: "./dist/types",
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
  };
});
