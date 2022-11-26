/*
 * @Author: xuxinjiang
 * @Date: 2022-11-01 11:39:56
 * @LastEditors: your name
 * @LastEditTime: 2022-11-01 11:39:56
 * @Description: file content
 */
module.exports = {
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-react",
    ["@babel/preset-env"],
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@": "./src",
        },
      },
    ],
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-typescript",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
  ignore: ["./src/*.d.ts", ".vscode/*"],
};
