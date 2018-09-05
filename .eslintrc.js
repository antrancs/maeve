module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript'],
  rules: {
    'arrow-parens': [2, 'as-needed'],
    'comma-dangle': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'function-paren-newline': ['error', 'consistent'],
    'object-curly-newline': ['error', { consistent: true }]
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
};
