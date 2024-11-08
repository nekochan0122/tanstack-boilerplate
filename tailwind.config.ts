import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

import shadcnPreset from './plugins/tailwind/shadcn-preset'

export default {
  presets: [
    shadcnPreset({ color: 'zinc' }),
  ],
  content: [
    './src/components/**/*.tsx',
    './src/routes/**/*.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Noto Sans TC Variable', ...defaultTheme.fontFamily.sans],
      },
    },
  },
} satisfies Config
