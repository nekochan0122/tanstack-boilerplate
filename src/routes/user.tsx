import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// import { toast } from 'sonner'
// import { logger } from '~/libs/logger'
import { useAuthQuery } from '~/services/auth.query'

export const Route = createFileRoute('/user')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      // if (!preload) {
      //   logger.info('Authentication failed, redirecting to sign-in page')
      //   toast.error(context.translator('auth.authentication-failed'))
      // }

      throw redirect({
        to: '/auth/sign-in',
        search: {
          callbackURL: location.pathname,
        },
      })
    }

    if (['/user', '/user/'].includes(location.pathname)) {
      throw redirect({
        to: '/user/account-settings',
      })
    }
  },
  component: UserLayout,
})

function UserLayout() {
  const authQuery = useAuthQuery()

  return authQuery.data.isAuthenticated ? <Outlet /> : null
}
