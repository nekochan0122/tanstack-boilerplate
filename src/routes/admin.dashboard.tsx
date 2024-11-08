import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return 'Hello /_protected-admin/admin/dashboard!'
}
