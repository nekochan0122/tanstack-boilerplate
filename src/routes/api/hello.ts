import { createAPIFileRoute } from '@tanstack/start/api'

import { VerificationEmail } from '~/emails/verification-email'
import { sendEmail } from '~/libs/email'

export const Route = createAPIFileRoute('/api/hello')({
  GET: async ({ request }) => {
    await sendEmail({
      from: 'John Doe <TanStack@example.com>',
      to: 'aaron74327@gmail.com',
      subject: 'Hello, World!',
      react: VerificationEmail({ url: 'https://google.com' }),
    })

    return new Response('Hello, World! from ' + request.url)
  },
})
