import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

import { logger } from '~/libs/logger'
import { useAuthedQuery } from '~/services/auth.query'

export const Route = createFileRoute('/(authentication)/_authed/protected-admin')({
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== 'admin') {
      logger.info('Unauthorized access, redirecting to home page')

      toast.error(context.i18n.t('auth.unauthorized-access'))

      throw redirect({
        to: '/',
      })
    }
  },
  component: ProtectedAdminRoute,
})

function ProtectedAdminRoute() {
  const authedQuery = useAuthedQuery()

  return (
    <p>
      Hello {authedQuery.data.user.name}, This is protected admin route.
    </p>
  )
}
