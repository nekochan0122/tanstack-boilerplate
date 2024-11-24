import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'

import { authedMiddleware } from '~/middlewares/auth'
import { changeEmailSchema, changePasswordSchema, updateUserSchema } from '~/services/user.schema'

export const updateUser = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(updateUserSchema()))
  .handler(async ({ context, data }) => {
    // TODO:
  })

export const changeEmail = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(changeEmailSchema()))
  .handler(async ({ context, data }) => {
    // TODO:
  })

export const changePassword = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(changePasswordSchema()))
  .handler(async ({ context, data }) => {
    // TODO:
  })

export const sendVerificationEmail = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .handler(async ({ context }) => {
    // TODO:
  })
