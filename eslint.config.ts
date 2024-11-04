import module from 'node:module'

import nekoConfig from '@nekochan0122/config/eslint'
import eslintPluginTailwind from 'eslint-plugin-tailwindcss'
import eslintPluginTanStackQuery from 'eslint-plugin-tanstack-query'
import eslintPluginTanStackRouter from 'eslint-plugin-tanstack-router'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const require = module.createRequire(import.meta.url)

export default tseslint.config(
  ...nekoConfig.presets.react,
  ...eslintPluginTailwind.configs['flat/recommended'],
  ...eslintPluginTanStackQuery.configs['flat/recommended'],
  ...eslintPluginTanStackRouter.configs['flat/recommended'],
  {
    name: 'react-compiler/recommended',
    plugins: {
      'react-compiler': require('eslint-plugin-react-compiler'),
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      tailwindcss: {
        callees: ['cx', 'cva'],
        whitelist: ['toaster'],
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'react-refresh/only-export-components': 'off',
      'unicorn/no-useless-undefined': 'off', // a quickfix for server function
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }], // for react-day-picker autoFocus prop
    },
  },
  {
    files: [
      'src/components/**/*.tsx',
    ],
    rules: {
      'jsx-a11y/heading-has-content': 'off',
    },
  },
  {
    files: [
      'src/components/ui/form.tsx',
      'src/components/ui/form-builder.tsx',
      'src/components/form/**/*',
    ],
    rules: {
      'react/no-children-prop': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: [
      '.vinxi',
      '.output',
    ],
  },
)
