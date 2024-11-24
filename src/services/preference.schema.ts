import { z } from 'zod'

import { AVAILABLE_LOCALES } from '~/libs/i18n'

export const preferenceSchema = z
  .object({
    locale: z.enum(AVAILABLE_LOCALES),
  })

export type Preference = z.infer<typeof preferenceSchema>
