import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'

import { VerificationEmail } from '~/emails/verification-email'
import { authedMiddleware } from '~/middlewares/auth'
import { prisma } from '~/server/db'
import { sendEmail } from '~/server/email'
import { hashPassword, verifyPassword } from '~/server/password'
import { createVerification, deleteVerification, getVerification } from '~/server/verification'
import { changeEmailSchema, changePasswordSchema, updateUserSchema, verifyEmailSchema } from '~/services/user.schema'

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
    // @ts-expect-error https://github.com/TanStack/router/issues/2780
    if (data.newEmail === context.auth.user.email) {
      throw new Error('New email must be different from current email')
    }

    const user = await prisma.user.update({
      where: {
        // @ts-expect-error https://github.com/TanStack/router/issues/2780
        id: context.auth.user.id,
      },
      data: {
        email: data.newEmail,
        emailVerified: false,
      },
    })

    const emailVerification = await createVerification(
      'EMAIL_VERIFICATION',
      user.email,
      user.id,
    )

    sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      react: VerificationEmail({ code: emailVerification.code }),
    })
  })

export const verifyEmail = createServerFn({ method: 'POST' })
  .middleware([authedMiddleware])
  .validator(zodValidator(verifyEmailSchema()))
  .handler(async ({ context, data }) => {
    // @ts-expect-error https://github.com/TanStack/router/issues/2780
    if (context.auth.user.emailVerified) {
      throw new Error('Email already verified')
    }

    const verification = await getVerification(
      'EMAIL_VERIFICATION',
      data.code,
      // @ts-expect-error https://github.com/TanStack/router/issues/2780
      context.auth.user.id,
    )

    if (verification === null) {
      throw new Error('Invalid verification code')
    }

    if (verification.attempts >= 3) {
      // @ts-expect-error https://github.com/TanStack/router/issues/2780
      await deleteVerification('EMAIL_VERIFICATION', context.auth.user.id)

      throw new Error('Verification code has expired')
    }

    if (verification.code !== data.code) {
      await prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          attempts: verification.attempts + 1,
        },
      })

      throw new Error('Invalid verification code')
    }

    if (verification.expiresAt < new Date()) {
      // @ts-expect-error https://github.com/TanStack/router/issues/2780
      await deleteVerification('EMAIL_VERIFICATION', context.auth.user.id)

      throw new Error('Verification code has expired')
    }

    // @ts-expect-error https://github.com/TanStack/router/issues/2780
    await deleteVerification('EMAIL_VERIFICATION', context.auth.user.id)

    await prisma.user.update({
      where: {
        // @ts-expect-error https://github.com/TanStack/router/issues/2780
        id: context.auth.user.id,
      },
      data: {
        emailVerified: true,
      },
    })
  })
