module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn", // or "error"
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
};
