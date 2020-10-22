module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'extend',
                    'extends',
                    'ignores',
                    'include',
                    'for',
                    'at-root',
                    'if',
                    'return',
                    'mixin',
                    'each',
                    'function',
                    'else',
                    'error',
                ],
            },
        ],
        indentation: 4,
        'comment-empty-line-before': null,
        'comment-whitespace-inside': null,
        'declaration-block-trailing-semicolon': null,
        'declaration-empty-line-before': null,
        'font-family-no-missing-generic-family-keyword': null,
        'function-name-case': null,
        'no-missing-end-of-source-newline': null,
        'value-keyword-case': null,
    },
};
