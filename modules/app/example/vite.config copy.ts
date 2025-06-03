// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       jsxRuntime: "classic",
//       babel: {
//         presets: [
//           ["@babel/preset-env", { targets: "> 0.25%, not dead" }],
//           ["@babel/preset-typescript", { allowDeclareFields: true }],
//         ],
//         plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
//         exclude: "node_modules/**",
//         babelrc: false,
//       },
//     }),
//   ],

//   build: {
//     target: ["esnext"],
//     rollupOptions: {
//       external: [/^@ocean\//, "modules/**"],
//     },
//     commonjsOptions: {
//       transformMixedEsModules: true, // 强制转换混合模块
//     },
//   },
// });
