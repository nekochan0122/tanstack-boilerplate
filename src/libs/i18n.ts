import type { LiteralUnion } from 'type-fest'
import type { NamespaceKeys, NestedKeyOf, useTranslations } from 'use-intl'

import type enMessages from '~/messages/en'

export const AVAILABLE_LOCALES = ['en', 'zh-tw'] as const
export const DEFAULT_LOCALE = 'en' as const

export type Messages = typeof enMessages
export type Locale = typeof AVAILABLE_LOCALES[number]

export type MessageNamespace = NamespaceKeys<
  Messages, NestedKeyOf<Messages>
>

export type Translator<
  NestedKey extends MessageNamespace = never,
> = ReturnType<
  typeof useTranslations<NestedKey>
>
export type TranslateKeys<
  NestedKey extends MessageNamespace = never,
> = Parameters<
  Translator<NestedKey>
>[0]

export const tKey = ((key: TranslateKeys) => key) as Translator

export function isLocale(locale: LiteralUnion<Locale, string>): locale is Locale {
  return AVAILABLE_LOCALES.includes(locale as Locale)
}
