import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

import { logger } from '~/libs/logger'

export const Route = createFileRoute('/user')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      logger.info('Authentication failed, redirecting to sign-in page')

      toast.error(context.i18n.translator('auth.authentication-failed'))

      throw redirect({
        to: '/sign-in',
        search: {
          callbackURL: location.pathname,
        },
      })
    }

    if (['/user', '/user/'].includes(location.pathname)) {
      throw redirect({
        to: '/user/profile',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
