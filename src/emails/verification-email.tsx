import { Section, Text } from '@react-email/components'

import { EmailHeading, EmailLayout } from '~/emails/base'

type VerificationEmailProps = {
  code: string
}

export function VerificationEmail({ code }: VerificationEmailProps) {
  return (
    <EmailLayout>
      <Section className='text-center'>
        <EmailHeading>
          Verify your email
        </EmailHeading>
        <Text>
          {code}
        </Text>
      </Section>
    </EmailLayout>
  )
}

VerificationEmail.PreviewProps = {
  code: '123456',
} satisfies VerificationEmailProps

export default VerificationEmail
