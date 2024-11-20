import type { Locale, Messages } from '~/libs/i18n'

declare module 'use-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: Messages
  }
}
