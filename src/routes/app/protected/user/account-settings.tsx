import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected-user/user/account-settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_protected-user/account-settings!'
}
