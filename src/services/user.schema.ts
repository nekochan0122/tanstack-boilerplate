import { z } from 'zod'

import { translateKey } from '~/libs/i18n'
import { emailSchema, nameSchema, usernameSchema } from '~/services/auth.schema'

export const setUserSchema = (t = translateKey) => z.object({
  username: usernameSchema(t).optional(),
  name: nameSchema(t).optional(),
  email: emailSchema(t).optional(),
})
