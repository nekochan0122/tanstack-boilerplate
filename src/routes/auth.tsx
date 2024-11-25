import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { toast } from 'sonner'
import { z } from 'zod'

import { logger } from '~/libs/logger'

export const Route = createFileRoute('/auth')({
  validateSearch: zodValidator(
    z.object({
      callbackURL: z.string().default('/'),
    }),
  ),
  beforeLoad: ({ context, search, location, preload }) => {
    if (context.auth.isAuthenticated) {
      if (!preload) {
        logger.info('Already authenticated, redirecting to callback URL')
        toast.error(context.translator('auth.already-authenticated-redirecting'))
      }

      throw redirect({
        to: search.callbackURL,
      })
    }

    if (['/auth', '/auth/'].includes(location.pathname)) {
      throw redirect({
        to: '/auth/sign-in',
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
