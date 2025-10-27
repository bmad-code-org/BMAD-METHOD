export default {
  $schema: 'https://json.schemastore.org/prettierrc',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  proseWrap: 'preserve',
  overrides: [
    {
      files: ['*.md'],
      options: { proseWrap: 'preserve' },
    },
    {
      files: ['*.yaml'],
      options: { singleQuote: false },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: { singleQuote: false },
    },
    {
      files: ['*.cjs'],
      options: { parser: 'babel' },
    },
  ],
  plugins: ['prettier-plugin-packagejson'],
};
