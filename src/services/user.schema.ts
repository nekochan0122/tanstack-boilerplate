import { z } from 'zod'

import { tKey } from '~/libs/i18n'
import { emailSchema, nameSchema, usernameSchema } from '~/services/auth.schema'

export const setUserSchema = (t = tKey) => z.object({
  username: usernameSchema(t).optional(),
  name: nameSchema(t).optional(),
  email: emailSchema(t).optional(),
})
