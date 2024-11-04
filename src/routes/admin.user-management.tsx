import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_protected-admin/user-management!'
}
