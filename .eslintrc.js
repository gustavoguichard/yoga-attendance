const { resolve } = require('path');

module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  globals: {
    document: true,
    window: true
  },
  extends: 'airbnb/base',
  plugins: ['html'],
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '@': resolve(__dirname, 'client'),
            },
          },
        },
      },
    },
  },
  rules: {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never',
    }],
    'import/no-extraneous-dependencies': 0,
    'func-names': 0,
    'semi': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-param-reassign': 0,
    'no-debugger': 0,
    'import/prefer-default-export': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'function-paren-newline': 0,
    'no-underscore-dangle': 0,
    'no-confusing-arrow': 0,
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'only-multiline',
    }],
  },
};
