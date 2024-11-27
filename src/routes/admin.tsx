import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

import { logger } from '~/libs/logger'
import { useAuthQuery } from '~/services/auth.query'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context, location, preload }) => {
    if (!context.auth.isAuthenticated) {
      if (!preload) {
        logger.info('Authentication failed, redirecting to sign-in page')
        toast.error(context.translator('auth.authentication-failed'))
      }

      throw redirect({
        to: '/auth/sign-in',
        search: {
          callbackURL: location.pathname,
        },
      })
    }

    if (context.auth.user.role !== 'admin') {
      if (!preload) {
        logger.info('Unauthorized access, redirecting to home page')
        toast.error(context.translator('auth.unauthorized-access'))
      }

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
  const authQuery = useAuthQuery()

  return authQuery.data.isAuthenticated && authQuery.data.user.role === 'admin' ? <Outlet /> : null
}
