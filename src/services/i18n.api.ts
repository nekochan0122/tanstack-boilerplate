import { createServerFn } from '@tanstack/start'
import { lookup } from 'doc999tor-fast-geoip'
import { getHeader } from 'vinxi/http'

import { defaultLocale, defaultTimeZone, detectLocale, parseAcceptLanguage } from '~/libs/i18n'
import { logger } from '~/libs/logger'
import { getVinxiSessionHelper } from '~/libs/session'
import type { I18nSession, Messages, SupportedLocales } from '~/libs/i18n'

export const getI18n = createServerFn('GET', async () => {
  logger.info('Getting i18n...')

  const session = await getVinxiSessionHelper()

  if (!session.data['locale']) {
    const acceptLanguageHeader = getHeader('Accept-Language')
    const acceptLanguages = parseAcceptLanguage(acceptLanguageHeader)
    const locale = detectLocale(acceptLanguages) || defaultLocale

    await session.update({ locale })
  }

  if (!session.data['timeZone']) {
    const ip = getHeader('x-forwarded-for')
    const geo = await lookup(ip ?? '')
    const timeZone = geo?.timezone || defaultTimeZone

    await session.update({ timeZone })
  }

  const messages = await import(`../messages/${session.data['locale']}.ts`)

  return {
    locale: session.data['locale'] as SupportedLocales,
    timeZone: session.data['timeZone'] as string,
    messages: messages.default as Messages,
  }
})

export const setLocale = createServerFn('POST', async (locale: SupportedLocales) => {
  const session = await getVinxiSessionHelper()
  await session.update({ locale })
})

export const setTimeZone = createServerFn('POST', async (timeZone: I18nSession['timeZone']) => {
  const session = await getVinxiSessionHelper()
  await session.update({ timeZone })
})
