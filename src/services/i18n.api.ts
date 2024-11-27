import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'
import type { IntlConfig } from 'use-intl'

import { preferenceSchema } from '~/services/preference.schema'
import type { Locale, Messages } from '~/libs/i18n'

export const getI18n = createServerFn({ method: 'GET' })
  .validator(zodValidator(preferenceSchema.shape.locale))
  .handler(async ({ data }) => {
    const messages = await import(`../messages/${data}.ts`)

    return {
      locale: data as Locale,
      timeZone: 'UTC',
      messages: messages.default as Messages,
    } as const satisfies IntlConfig
  })
