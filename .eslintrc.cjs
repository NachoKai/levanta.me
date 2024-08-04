module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "info", "debug"],
      },
    ],
    quotes: [2, "double", "avoid-escape"],
    indent: [
      0,
      "tab",
      {
        SwitchCase: 1,
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
      },
    ],
    "prefer-const": [
      1,
      {
        destructuring: "all",
      },
    ],
    "react/display-name": 0,
    "no-mixed-spaces-and-tabs": 0,
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/self-closing-comp": "warn",
    "react/prop-types": [
      "warn",
      {
        ignore: ["children", "className", "style"],
      },
    ],
    "array-callback-return": "warn",
    "no-self-compare": "warn",
  },
};
