module.export = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
      },
    ],
    ["@babel/preset-react"],
  ],
  plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
};
