import { createFileRoute } from '@tanstack/react-router'
import { BsGithub } from 'react-icons/bs'

import { Button } from '~/components/ui/button'
import { Link } from '~/components/ui/link'
import { Typography } from '~/components/ui/typography'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <div className='flex size-full flex-col items-center justify-center space-y-6 pb-16'>
      <Typography.H1>
        {import.meta.env.VITE_APP_NAME}
      </Typography.H1>
      <Typography.P>
        A fully <strong>type-safe</strong> boilerplate with a focus on UX and DX, complete with multiple examples.
      </Typography.P>
      <Button asChild>
        <Link to='https://github.com/tanstack/boilerplate'>
          <BsGithub />
          View on GitHub
        </Link>
      </Button>
    </div>
  )
}
