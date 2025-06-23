module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            screens: "./src/screens",
            classes: "./src/classes",
            managers: "./src/managers",
            elements: "./src/elements",
            enum: "./src/enum",
            helpers: "./src/helpers",
            hooks: "./src/hooks",
            style: "./src/style",
            assets: "./src/assets"
          },
        },
      ],
    ],
  };
};
