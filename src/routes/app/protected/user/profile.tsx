import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected-user/user/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_protected-user/user/profile!'
}
