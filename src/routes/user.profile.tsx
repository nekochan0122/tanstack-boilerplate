import { createFileRoute } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useAuthedQuery } from '~/services/auth.query'

export const Route = createFileRoute('/user/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const authedQuery = useAuthedQuery()

  return (
    <div className='flex flex-col items-center space-y-4'>
      <Avatar className='size-32 rounded-full'>
        <AvatarImage
          src={authedQuery.data.user.image || undefined}
          alt={authedQuery.data.user.name}
        />
        <AvatarFallback className='rounded-lg text-5xl'>
          {authedQuery.data.user.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className='space-y-2 text-center'>
        <h2 className='text-2xl'>{authedQuery.data.user.name}</h2>
        <p>Joined {new Date(authedQuery.data.user.createdAt).toDateString()}</p>
      </div>
    </div>
  )
}
