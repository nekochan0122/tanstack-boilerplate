import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

import { logger } from '~/libs/logger'

export const Route = createFileRoute('/admin')({
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

    if (context.auth.user.role !== 'admin') {
      logger.info('Unauthorized access, redirecting to home page')

      toast.error(context.i18n.translator('auth.unauthorized-access'))

      throw redirect({
        to: '/',
      })
    }

    if (['/admin', '/admin/'].includes(location.pathname)) {
      throw redirect({
        to: '/admin/dashboard',
      })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
