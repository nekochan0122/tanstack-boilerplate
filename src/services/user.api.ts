import { createServerFn } from '@tanstack/start'
import type { z } from 'zod'

import { prisma } from '~/libs/db'
import { getAuth } from '~/services/auth.api'
import type { setUserSchema } from '~/services/user.schema'

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
