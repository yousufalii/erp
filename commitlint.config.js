module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor']],

    'scope-case': [2, 'always', 'upper-case'],
    'scope-enum': [2, 'always', /^([A-Z]+-[0-9]+)$/],

    'subject-empty': [2, 'never'],

    'header-max-length': [2, 'always', 100],
  },
};
