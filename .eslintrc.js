module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
