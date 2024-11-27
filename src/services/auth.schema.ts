import { z } from 'zod'

import { tKey } from '~/libs/i18n'

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

export const nameSchema = (t = tKey) => z
  .string()
  .min(NAME_MIN, t('auth.name-min', { min: NAME_MIN }))
  .max(NAME_MAX, t('auth.name-max', { max: NAME_MAX }))

export const emailSchema = (t = tKey) => z
  .string()
  .email(t('auth.email-invalid'))

export const usernameSchema = (t = tKey) => z
  .string()
  .regex(USERNAME_REGEX, t('auth.username-regex'))
  .min(USERNAME_MIN, t('auth.username-min', { min: USERNAME_MIN }))
  .max(USERNAME_MAX, t('auth.username-max', { max: USERNAME_MAX }))

export const passwordSchema = (t = tKey) => z
  .string()
  .regex(PASSWORD_ONE_UPPERCASE_REGEX, t('auth.password-one-uppercase-regex'))
  .regex(PASSWORD_ONE_LOWERCASE_REGEX, t('auth.password-one-lowercase-regex'))
  .regex(PASSWORD_ONE_NUMBER_REGEX, t('auth.password-one-number-regex'))
  .regex(PASSWORD_ONE_SPECIAL_REGEX, t('auth.password-one-special-regex'))
  .min(PASSWORD_MIN, t('auth.password-min', { min: PASSWORD_MIN }))
  .max(PASSWORD_MAX, t('auth.password-max', { max: PASSWORD_MAX }))

export const signUpSchema = (t = tKey) => z
  .object({
    name: nameSchema(t),
    email: emailSchema(t),
    username: usernameSchema(t),
    password: passwordSchema(t),
    passwordConfirm: passwordSchema(t),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: t('auth.password-must-match'),
  })

export const signInSchema = (t = tKey) => z
  .object({
    username: usernameSchema(t),
    password: passwordSchema(t),
    rememberMe: z.boolean().optional(),
  })
