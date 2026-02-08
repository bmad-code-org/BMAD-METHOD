import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        files: ['src/**/*.ts'],
        extends: [
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        ignores: ['out/', 'node_modules/'],
    }
);
