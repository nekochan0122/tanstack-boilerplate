import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'
import { getHeader } from 'vinxi/http'

import { AVAILABLE_LOCALES, DEFAULT_LOCALE, isLocale } from '~/libs/i18n'
import { authMiddleware } from '~/middlewares/auth'
import { prisma } from '~/server/db'
import { COOKIE_OPTIONS_BASE, getCookieJSON, setCookieJSON } from '~/server/utils'
import { preferenceSchema } from '~/services/preference.schema'
import type { Locale } from '~/libs/i18n'
import type { Preference } from '~/services/preference.schema'

const PREFERENCE_COOKIE_NAME = 'preference'
const PREFERENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const getPreference = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler<Preference>(async ({ context }) => {
    let preference: Preference | undefined

    // 1. if user is authenticated get preference from database
    if (context.auth.isAuthenticated) {
      // 1.1 get preference from database
      const preferenceDatabase = await prisma.preference.findUnique({
        where: { userId: context.auth.user.id },
      })

      // 1.2 if preference is found, parse it
      if (preferenceDatabase !== null && typeof preferenceDatabase.data === 'object') {
        preference = parsePreference(preferenceDatabase.data)
      }

      // 1.3 if preference is not found, get preference from cookie
      if (preference === undefined) {
        preference = parsePreference(getCookieJSON(PREFERENCE_COOKIE_NAME))
      }
    }
    // 2. else get preference from cookie
    else {
      preference = parsePreference(getCookieJSON(PREFERENCE_COOKIE_NAME))
    }

    // 3. if preference is not found, generate default preference
    if (preference === undefined) {
      preference = generateDefaultPreference()
    }

    setCookieJSON(PREFERENCE_COOKIE_NAME, preference, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: PREFERENCE_COOKIE_MAX_AGE,
    })

    return preference
  })

export const updatePreference = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(zodValidator(preferenceSchema.partial()))
  .handler<Preference>(async ({ context, data }) => {
    const preference = await getPreference()

    const preferenceUpdated = {
      ...preference,
      ...data,
    }

    if (context.auth.isAuthenticated) {
      await prisma.preference.upsert({
        where: {
          userId: context.auth.user.id,
        },
        update: {
          data: preferenceUpdated,
        },
        create: {
          userId: context.auth.user.id,
          data: preferenceUpdated,
        },
      })
    }

    setCookieJSON(PREFERENCE_COOKIE_NAME, preferenceUpdated, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: PREFERENCE_COOKIE_MAX_AGE,
    })

    return preferenceUpdated
  })

function parsePreference(data: unknown): Preference | undefined {
  if (data === null || data === undefined) return undefined
  const preference = preferenceSchema.safeParse(data)
  return preference.success ? preference.data : undefined
}

function generateDefaultPreference(): Preference {
  const acceptLanguageHeader = getHeader('Accept-Language')
  const acceptLanguages = parseAcceptLanguage(acceptLanguageHeader)
  const dectectedLocale = detectLocale(acceptLanguages)

  return {
    locale: dectectedLocale || DEFAULT_LOCALE,
  }
}

function detectLocale(acceptLanguages: string[]): Locale | undefined {
  for (const acceptLanguage of acceptLanguages) {
    // exact match
    if (isLocale(acceptLanguage)) return acceptLanguage

    // base language match (e.g., "en" from "en-GB")
    const baseLanguage = new Intl.Locale(acceptLanguage).language
    if (isLocale(baseLanguage)) return baseLanguage

    // base language fallback to region that is available
    const supportedRegionsLanguage = AVAILABLE_LOCALES.filter(
      (lang) => new Intl.Locale(lang).language === baseLanguage,
    )
    if (supportedRegionsLanguage.length > 0) return supportedRegionsLanguage[0]
  }
}

function parseAcceptLanguage(acceptLanguageHeader?: string): string[] {
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
