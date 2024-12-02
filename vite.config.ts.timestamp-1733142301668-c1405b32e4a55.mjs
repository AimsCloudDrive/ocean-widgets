// ../../vite.config.ts
import { defineConfig } from "file:///D:/WebStorm/ocean-js/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
import react from "file:///D:/WebStorm/ocean-js/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@5.4.11_@types+node@22.10.0_terser@5.36.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///D:/WebStorm/ocean-js/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@22.10.0_rollup@4.27.4_typescript@5.7.2_vite@5.4.11_@types+node@22.10.0_terser@5.36.0_/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
      babel: {
        plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]]
      }
    }),
    dts({
      outDir: "dist/types"
    })
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
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vdml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXZWJTdG9ybVxcXFxvY2Vhbi1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV2ViU3Rvcm1cXFxcb2NlYW4tanNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1dlYlN0b3JtL29jZWFuLWpzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBqc3hSdW50aW1lOiBcImNsYXNzaWNcIixcbiAgICAgIGJhYmVsOiB7XG4gICAgICAgIHBsdWdpbnM6IFtbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWRlY29yYXRvcnNcIiwgeyB2ZXJzaW9uOiBcImxlZ2FjeVwiIH1dXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgZHRzKHtcbiAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCIsXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBcInNyYy9pbmRleC50c1wiLFxuICAgICAgbmFtZTogXCJpbmRleC5qc1wiLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IHtcbiAgICAgICAgaWYgKC9eZXNtPyQvLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgIHJldHVybiBcImluZGV4LmpzXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBpbmRleC4ke2Zvcm1hdH0uanNgO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsb0JBQW9CO0FBQ2pSLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFHaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osWUFBWTtBQUFBLE1BQ1osT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLENBQUMscUNBQXFDLEVBQUUsU0FBUyxTQUFTLENBQUMsQ0FBQztBQUFBLE1BQ3hFO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sVUFBVSxDQUFDLFdBQVc7QUFDcEIsWUFBSSxTQUFTLEtBQUssTUFBTSxHQUFHO0FBQ3pCLGlCQUFPO0FBQUEsUUFDVDtBQUNBLGVBQU8sU0FBUyxNQUFNO0FBQUEsTUFDeEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
