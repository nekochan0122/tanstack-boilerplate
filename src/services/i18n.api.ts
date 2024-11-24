import { createServerFn } from '@tanstack/start'
import type { IntlConfig } from 'use-intl'

import { getPreference } from '~/services/preference.api'
import type { Messages } from '~/libs/i18n'

export const getI18n = createServerFn({ method: 'GET' })
  .handler(async () => {
    const preference = await getPreference()
    const messages = await import(`../messages/${preference.locale}.ts`)

    return {
      locale: preference.locale,
      messages: messages.default as Messages,
      timeZone: 'UTC',
    } satisfies IntlConfig
  })
