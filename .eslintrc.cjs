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
  plugins: ["react-refresh", "react", "react-hooks"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "info", "debug"],
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
    "sort-imports": [
      "warn",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: false,
      },
    ],
    "padding-line-between-statements": [
      "warn",
      {
        blankLine: "always",
        prev: "*",
        next: "return",
      },
      {
        blankLine: "always",
        prev: ["const", "let", "var"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
    ],
    "react/jsx-sort-props": [
      "warn",
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
    "react/react-in-jsx-scope": "off",
    "arrow-parens": "as-needed",
    // "prettier/prettier": [
    //   "warn",
    //   {
    //     printWidth: 90,
    //     tabWidth: 2,
    //     useTabs: true,
    //     semi: false,
    //     arrowParens: "avoid",
    //     bracketSpacing: true,
    //     bracketSameLine: false,
    //     singleQuote: true,
    //     trailingComma: "es5",
    //     endOfLine: "lf",
    //     htmlWhitespaceSensitivity: "css",
    //     jsxSingleQuote: true,
    //     quoteProps: "as-needed",
    //     requirePragma: false,
    //     insertPragma: false,
    //     proseWrap: "always",
    //   },
    // ],
  },
};
