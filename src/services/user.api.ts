import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'

import { authedMiddleware } from '~/middlewares/auth'
import { prisma } from '~/server/db'
import { hashPassword, verifyPassword } from '~/server/password'
import { changeEmailSchema, changePasswordSchema, updateUserSchema } from '~/services/user.schema'

export const updateUser = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(updateUserSchema()))
  .handler(async ({ context, data }) => {
    await prisma.user.update({
      where: {
        // @ts-expect-error https://github.com/TanStack/router/issues/2780
        id: context.auth.user.id,
      },
      data,
    })
  })

export const changePassword = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(changePasswordSchema()))
  .handler(async ({ context, data }) => {
    const user = await prisma.user.findUnique({
      where: {
        // @ts-expect-error https://github.com/TanStack/router/issues/2780
        id: context.auth.user.id,
      },
    })

    if (user === null) {
      throw new Error('User not found')
    }

    const isPasswordValid = await verifyPassword(user.hashedPassword, data.currentPassword)

    if (isPasswordValid === false) {
      throw new Error('Current password is incorrect')
    }

    if (data.newPassword !== data.newPasswordConfirm) {
      throw new Error('New password and confirm password must match')
    }

    const hashedPassword = await hashPassword(data.newPassword)

    await prisma.user.update({
      where: {
        // @ts-expect-error https://github.com/TanStack/router/issues/2780
        id: context.auth.user.id,
      },
      data: {
        hashedPassword,
      },
    })
  })

export const changeEmail = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(changeEmailSchema()))
  .handler(async ({ context, data }) => {
    // TODO:
  })

export const sendVerificationEmail = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .handler(async ({ context }) => {
    // TODO:
  })
