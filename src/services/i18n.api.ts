import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'
import { lookup } from 'geoip'
import { getHeader } from 'vinxi/http'
import { z } from 'zod'

import { defaultLocale, defaultTimeZone, detectLocale, parseAcceptLanguage, supportedLocalesSchema } from '~/libs/i18n'
import { logger } from '~/libs/logger'
import { getVinxiSessionHelper } from '~/libs/session'
import type { Messages, SupportedLocales } from '~/libs/i18n'

export const getI18n = createServerFn({ method: 'GET' })
  .handler(async () => {
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

export const setLocale = createServerFn({ method: 'POST' })
  .validator(zodValidator(
    z.object({
      locale: supportedLocalesSchema,
    }),
  ))
  .handler(async ({ data }) => {
    const session = await getVinxiSessionHelper()
    await session.update(data)
  })

export const setTimeZone = createServerFn({ method: 'POST' })
  .validator(zodValidator(
    z.object({
      timeZone: z.string(),
    }),
  ))
  .handler(async ({ data }) => {
    const session = await getVinxiSessionHelper()
    await session.update(data)
  })
