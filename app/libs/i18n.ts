import type { LiteralUnion } from 'type-fest'
import type { IntlConfig } from 'use-intl'

import type enMessages from '~/i18n/en.ts'
import type { InferRouteContext } from '~/libs/router'

export const supportedLocales = ['en', 'zh-tw'] as const

export const defaultLocale: SupportedLocales = supportedLocales[0]

export const defaultTimeZone: IntlConfig['timeZone'] = 'Asia/Taipei'

export type I18nSession = {
  locale: SupportedLocales
  timeZone: string
}

export type Messages = typeof enMessages

export type SupportedLocales = typeof supportedLocales[number]

export type Translator = InferRouteContext<'/'>['i18n']['t']

export type TranslateKeys = Parameters<Translator>[0]

export const translateKey = ((key: TranslateKeys) => key) as Translator

export function detectLocale(acceptLanguages: string[]): SupportedLocales | undefined {
  for (const acceptLanguage of acceptLanguages) {
    // Exact match
    if (isSupportedLocale(acceptLanguage)) return acceptLanguage

    // Base language match (e.g., "en" from "en-GB")
    const baseLanguage = new Intl.Locale(acceptLanguage).language
    if (isSupportedLocale(baseLanguage)) return baseLanguage

    // Base language fallback to region that is available
    const supportedRegionsLanguage = supportedLocales.filter(
      (lang) => new Intl.Locale(lang).language === baseLanguage,
    )
    if (supportedRegionsLanguage.length > 0) return supportedRegionsLanguage[0]
  }
}

export function isSupportedLocale(locale: LiteralUnion<SupportedLocales, string>): locale is SupportedLocales {
  return supportedLocales.includes(locale as SupportedLocales)
}

export function parseAcceptLanguage(acceptLanguageHeader?: string) {
  if (!acceptLanguageHeader) return []

  const languages = acceptLanguageHeader.split(',')

  const parsedLanguages = languages.map((lang) => {
    const [languageValue, qualityValue] = lang.trim().split(';q=')

    const quality = qualityValue ? parseFloat(qualityValue) : 1
    const language = languageValue.trim().toLowerCase()

    return { language, quality }
  })

  parsedLanguages.sort((a, b) => b.quality - a.quality)

  return parsedLanguages.map((lang) => lang.language)
}
