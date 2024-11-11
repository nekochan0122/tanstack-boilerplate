import { z } from 'zod'

import { tKey } from '~/libs/i18n'
import { emailSchema, nameSchema, passwordSchema, usernameSchema } from '~/services/auth.schema'
import type { InferAuthAPIZodShape } from '~/libs/auth'

export const setUserSchema = (t = tKey) => z
  .object({
    username: usernameSchema(t).optional(),
    name: nameSchema(t).optional(),
    email: emailSchema(t).optional(),
  })

export const changePasswordSchema = (t = tKey) => z
  .object<InferAuthAPIZodShape<'changePassword'>>({
    revokeOtherSessions: z.boolean().optional(),
    currentPassword: passwordSchema(t),
    newPassword: passwordSchema(t),
  })
  .extend({
    newPasswordConfirm: passwordSchema(t),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: t('auth.password-must-different'),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: t('auth.password-must-match'),
  })
