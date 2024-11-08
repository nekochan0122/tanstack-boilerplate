import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/user-management')({
  component: UserManagementRoute,
})

function UserManagementRoute() {
  return 'Hello /_protected-admin/user-management!'
}
