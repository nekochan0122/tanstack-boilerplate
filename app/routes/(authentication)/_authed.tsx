import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

import { logger } from '~/libs/logger'

export const Route = createFileRoute('/(authentication)/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      logger.info('Authentication failed, redirecting to sign-in page')

      toast.error(context.i18n.t('auth.authentication-failed'))

      throw redirect({
        to: '/sign-in',
        search: {
          callbackURL: location.pathname,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}