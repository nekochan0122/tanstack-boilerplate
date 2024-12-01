import { Section } from '@react-email/components'

import { EmailButton, EmailHeading, EmailLayout } from '~/emails/base'

interface VerificationEmailProps {
  url: string
}

export function VerificationEmail({ url }: VerificationEmailProps) {
  return (
    <EmailLayout>
      <Section className='text-center'>
        <EmailHeading>
          Verify your email
        </EmailHeading>
        <EmailButton href={url}>
          Click here to verify
        </EmailButton>
      </Section>
    </EmailLayout>
  )
}

export default VerificationEmail
