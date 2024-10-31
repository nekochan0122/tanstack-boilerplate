import { z } from 'zod'
import type { Except, UnknownRecord } from 'type-fest'

import { translateKey } from '~/libs/i18n'
import type { AuthAPI, InferAuthOptions } from '~/libs/auth'
import type { InferZodObjectShape } from '~/libs/zod'

export type Auth = z.infer<typeof authSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().nullable(),
  role: z.enum(['user', 'admin']),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.date().nullable(),
})

export const sessionSchema = z.object({
  id: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().nullable(),
})

export const authSchema = z.discriminatedUnion('isAuthenticated', [
  z.object({
    isAuthenticated: z.literal(false),
    user: z.null(),
    session: z.null(),
  }),
  z.object({
    isAuthenticated: z.literal(true),
    user: userSchema,
    session: sessionSchema,
  }),
])

type InferZodAuthAPIShape<API extends AuthAPI> =
  InferAuthOptions<API> extends { body: UnknownRecord }
    ? InferZodObjectShape<Except<InferAuthOptions<API>['body'], 'callbackURL' | 'image'>>
    : never

export const NAME_MIN = 2
export const NAME_MAX = 10

export const USERNAME_MIN = 4
export const USERNAME_MAX = 20
export const USERNAME_REGEX = /^[\d_a-z-]*$/

export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 100
export const PASSWORD_ONE_UPPERCASE_REGEX = /.*[A-Z].*/
export const PASSWORD_ONE_LOWERCASE_REGEX = /.*[a-z].*/
export const PASSWORD_ONE_NUMBER_REGEX = /.*\d.*/
export const PASSWORD_ONE_SPECIAL_REGEX = /.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-].*/

export const nameSchema = (t = translateKey) => z
  .string()
  .min(NAME_MIN, t('auth.name-min', { min: NAME_MIN }))
  .max(NAME_MAX, t('auth.name-max', { max: NAME_MAX }))

export const emailSchema = (t = translateKey) => z
  .string()
  .email(t('auth.email-invalid'))

export const usernameSchema = (t = translateKey) => z
  .string()
  .regex(USERNAME_REGEX, t('auth.username-regex'))
  .min(USERNAME_MIN, t('auth.username-min', { min: USERNAME_MIN }))
  .max(USERNAME_MAX, t('auth.username-max', { max: USERNAME_MAX }))

export const passwordSchema = (t = translateKey) => z
  .string()
  .regex(PASSWORD_ONE_UPPERCASE_REGEX, t('auth.password-one-uppercase-regex'))
  .regex(PASSWORD_ONE_LOWERCASE_REGEX, t('auth.password-one-lowercase-regex'))
  .regex(PASSWORD_ONE_NUMBER_REGEX, t('auth.password-one-number-regex'))
  .regex(PASSWORD_ONE_SPECIAL_REGEX, t('auth.password-one-special-regex'))
  .min(PASSWORD_MIN, t('auth.password-min', { min: PASSWORD_MIN }))
  .max(PASSWORD_MAX, t('auth.password-max', { max: PASSWORD_MAX }))

export const signUpSchema = (t = translateKey) => z
  .object<InferZodAuthAPIShape<'signUpEmail'>>({
    name: nameSchema(t),
    email: emailSchema(t),
    username: usernameSchema(t),
    password: passwordSchema(t),
  })

export const signInSchema = (t = translateKey) => z
  .object<InferZodAuthAPIShape<'signInUsername'>>({
    username: usernameSchema(t),
    password: passwordSchema(t),
    dontRememberMe: z.boolean().optional(),
  })
