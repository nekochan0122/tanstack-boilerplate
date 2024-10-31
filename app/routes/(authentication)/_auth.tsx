import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/react-router-zod-adapter'
import { toast } from 'sonner'
import { z } from 'zod'

import { logger } from '~/libs/logger'

export const Route = createFileRoute('/(authentication)/_auth')({
  validateSearch: zodSearchValidator(
    z.object({
      callbackURL: z.string().default('/'),
    }),
  ),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      logger.info('Already authenticated, redirecting to callback URL')

      console.log(context.auth.user.email)

      toast.error(context.i18n.t('auth.already-authenticated'))

      throw redirect({
        to: search.callbackURL,
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}
