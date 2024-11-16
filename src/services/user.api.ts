import { createServerFn } from '@tanstack/start'
import { getWebRequest } from 'vinxi/http'

import { auth } from '~/libs/auth'
import { prisma } from '~/libs/db'
import { tryCatchAsync } from '~/libs/utils'
import { getAuth } from '~/services/auth.api'
import { changeEmailSchema, changePasswordSchema, updateUserSchema } from '~/services/user.schema'

// TODO: use createMiddleware
export const protectedUserProcedure = createServerFn({ method: 'GET' })
  .handler(async () => {
    const auth = await getAuth()

    if (!auth.isAuthenticated) {
      throw new Error('Unauthorized')
    }

    return {
      auth,
    }
  })

export const updateUser = createServerFn({ method: 'POST' })
  .validator(updateUserSchema())
  .handler(async ({ data }) => {
    await protectedUserProcedure()

    const request = getWebRequest()

    await auth.api.updateUser({
      headers: request.headers,
      body: data,
    })
  })

export const changeEmail = createServerFn({ method: 'POST' })
  .validator(changeEmailSchema())
  .handler(async ({ data }) => {
    const procedure = await protectedUserProcedure()

    if (data.newEmail === procedure.auth.user.email) {
    // TODO: i18n
      throw new Error('New email is the same as the current email')
    }

    const isEmailExists = await prisma.user.findUnique({
      where: {
        email: data.newEmail,
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

    const request = getWebRequest()

    await auth.api.changeEmail({
      headers: request.headers,
      body: data,
    })

    await auth.api.sendVerificationEmail({
      headers: request.headers,
      body: {
        email: data.newEmail,
        callbackURL: '/',
      },
    })
  })

export const changePassword = createServerFn({ method: 'POST' })
  .validator(changePasswordSchema())
  .handler(async ({ data }) => {
    await protectedUserProcedure()

    const request = getWebRequest()

    const [changePasswordError, changePasswordResult] = await tryCatchAsync(
      auth.api.changePassword({
        headers: request.headers,
        body: data,
      }),
    )

    if (changePasswordError) {
      throw new Error('TODO: error handling')
    }

    return {
      result: changePasswordResult,
      revokeOtherSessions: Boolean(data.revokeOtherSessions),
    }
  })

export const sendVerificationEmail = createServerFn({ method: 'POST' })
  .handler(async () => {
    const procedure = await protectedUserProcedure()

    const request = getWebRequest()

    await auth.api.sendVerificationEmail({
      headers: request.headers,
      body: {
        email: procedure.auth.user.email,
        callbackURL: '/',
      },
    })
  })
