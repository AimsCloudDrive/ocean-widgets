// module.export = {
//   presets: [
//     [
//       "@babel/preset-env",
//       {
//         loose: true,
//         modules: false,
//       },
//     ],
//     ["@babel/preset-react"],
//   ],
//   plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
// };

//

module.exports = {
  // presets: ["@babel/preset-env", "@babel/preset-react"],
  // 支持编译装饰器语法
  plugins: [
    "@babel/plugin-proposal-decorators",
    "@babel/plugin-proposal-class-properties",
  ],
};
