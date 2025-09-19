export default {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  ignoreFiles: ['**/node_modules/**', '**/vendor/**', '**/bitrix/**'],
  rules: {
    'no-descending-specificity': null,
  },
};
