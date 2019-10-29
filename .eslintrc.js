module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["plugin:vue/essential", "plugin:vue/recommended", "airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "import/no-unresolved": 0,
    "import/no-unassigned-import": 0,
    semi: ["error", "never"],
    "no-console": "off",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "always",
        asyncArrow: "always"
      }
    ]
  }
};
