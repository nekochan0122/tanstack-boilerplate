import { createFileRoute } from '@tanstack/react-router'

import { useAuthedQuery } from '~/services/auth.query'

export const Route = createFileRoute('/(authentication)/_authed/protected')({
  component: ProtectedRoute,
})

function ProtectedRoute() {
  const authedQuery = useAuthedQuery()

  return (
    <p>
      Hello {authedQuery.data.user.name}, This is protected route.
    </p>
  )
}
