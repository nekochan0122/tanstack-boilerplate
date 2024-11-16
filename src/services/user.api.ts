import { createServerFn } from '@tanstack/start'
import type { z } from 'zod'

import { auth } from '~/libs/auth'
import { prisma } from '~/libs/db'
import { tryCatchAsync } from '~/libs/utils'
import { getAuth } from '~/services/auth.api'
import type { changeEmailSchema, changePasswordSchema, updateUserSchema } from '~/services/user.schema'

export const protectedUserProcedure = createServerFn('GET', async () => {
  const auth = await getAuth()

  if (!auth.isAuthenticated) {
    throw new Error('Unauthorized')
  }

  return {
    auth,
  }
})

export const updateUser = createServerFn('POST', async (input: z.infer<ReturnType<typeof updateUserSchema>>, ctx) => {
  await protectedUserProcedure()

  await auth.api.updateUser({
    headers: ctx.request.headers,
    body: input,
  })
})

export const changeEmail = createServerFn('POST', async (input: z.infer<ReturnType<typeof changeEmailSchema>>, ctx) => {
  const procedure = await protectedUserProcedure()

  if (input.newEmail === procedure.auth.user.email) {
    // TODO: i18n
    throw new Error('New email is the same as the current email')
  }

  const isEmailExists = await prisma.user.findUnique({
    where: {
      email: input.newEmail,
    },
  })

  if (isEmailExists) {
    // TODO: i18n
    throw new Error('Email already exists')
  }

  // make sure to unverify the email, so we can send a new verification email
  if (procedure.auth.user.emailVerified) {
    await prisma.user.update({
      where: {
        id: procedure.auth.user.id,
      },
      data: {
        emailVerified: false,
      },
    })
  }

  await auth.api.changeEmail({
    headers: ctx.request.headers,
    body: input,
  })

  await auth.api.sendVerificationEmail({
    headers: ctx.request.headers,
    body: {
      email: input.newEmail,
      callbackURL: '/',
    },
  })
})

export const changePassword = createServerFn('POST', async (input: z.infer<ReturnType<typeof changePasswordSchema>>, ctx) => {
  await protectedUserProcedure()

  const [changePasswordError, changePasswordResult] = await tryCatchAsync(
    auth.api.changePassword({
      headers: ctx.request.headers,
      body: input,
    }),
  )

  if (changePasswordError) {
    throw new Error('TODO: error handling')
  }

  return {
    result: changePasswordResult,
    revokeOtherSessions: Boolean(input.revokeOtherSessions),
  }
})

export const sendVerificationEmail = createServerFn('POST', async (_, ctx) => {
  const procedure = await protectedUserProcedure()

  await auth.api.sendVerificationEmail({
    headers: ctx.request.headers,
    body: {
      email: procedure.auth.user.email,
      callbackURL: '/',
    },
  })
})
