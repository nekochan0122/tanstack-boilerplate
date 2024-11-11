import { createServerFn } from '@tanstack/start'
import type { z } from 'zod'

import { auth } from '~/libs/auth'
import { prisma } from '~/libs/db'
import { tryCatchAsync } from '~/libs/utils'
import { getAuth } from '~/services/auth.api'
import type { changePasswordSchema, setUserSchema } from '~/services/user.schema'

export const protectedUserProcedure = createServerFn('GET', async () => {
  const auth = await getAuth()

  if (!auth.isAuthenticated) {
    throw new Error('Unauthorized')
  }

  return {
    auth,
  }
})

export const setUser = createServerFn('POST', async (input: z.infer<ReturnType<typeof setUserSchema>>) => {
  const procedure = await protectedUserProcedure()

  const user = await prisma.user.update({
    where: {
      id: procedure.auth.user.id,
    },
    data: input,
  })

  return user
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
