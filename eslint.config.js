import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintReact from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'build', 'coverage', '.vite', '*.config.js'] },
  {
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked, // Type-checked rules, (Could be strict if needed)
        eslintReact.configs.flat.recommended, // React rules
        jsxA11y.flatConfigs.recommended, // Accessibility rules for the sake of it
        prettierConfig // Prettier integration
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
        parserOptions: {
          project: ['./tsconfig.app.json', "./tsconfig.node.json"],
            tsconfigRootDir: import.meta.dirname,
            EXPERIMENTAL_useProjectService: { // Remove the warning about performance
              allowDefaultProjectForFiles: ['./*.ts', './*.tsx'], // Root files
                defaultProject: './tsconfig.app.json', // Default project
            },
        }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': eslintReact, // React plugin
      'import': importPlugin, // Import plugin
    },

      settings: {
        react: {
            version: 'detect', // Detect React version
            runtime: 'automatic', // New JSX transform
        },
        'import/resolver': {
              typescript: {
                  project: ['./tsconfig.app.json', "./tsconfig.node.json"], // tsconfig paths
              }
          },
      },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }],
          'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
            'react/jsx-uses-react': 'off', // Not needed with new JSX transform

            // Import rules
            'import/no-unresolved': 'error',
            'import/order': [ 'warn', {
          groups: [
              'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
          ],
            'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        }
      ],
    },
  },
)
