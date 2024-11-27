import { z } from 'zod'

import { tKey } from '~/libs/i18n'
import { emailSchema, nameSchema, passwordSchema, usernameSchema } from '~/services/auth.schema'

export const updateUserSchema = (t = tKey) => z
  .object({
    username: usernameSchema(t).optional(),
    name: nameSchema(t).optional(),
  })

export const changeEmailSchema = (t = tKey) => z
  .object({
    newEmail: emailSchema(t),
  })

export const changePasswordSchema = (t = tKey) => z
  .object({
    revokeOtherSessions: z.boolean().optional(),
    currentPassword: passwordSchema(t),
    newPassword: passwordSchema(t),
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
