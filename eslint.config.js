import nekoConfig from '@nekochan0122/config/eslint'
import eslintPluginTailwind from 'eslint-plugin-tailwindcss'
import eslintPluginTanStackQuery from 'eslint-plugin-tanstack-query'
import eslintPluginTanStackRouter from 'eslint-plugin-tanstack-router'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...nekoConfig.presets.react,
  ...eslintPluginTailwind.configs['flat/recommended'],
  ...eslintPluginTanStackQuery.configs['flat/recommended'],
  ...eslintPluginTanStackRouter.configs['flat/recommended'],
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
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'jsx-a11y/no-autofocus': ['error', {
        ignoreNonDOM: true,
      }],
      'unicorn/no-useless-undefined': 'off', // a quickfix for server function
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
