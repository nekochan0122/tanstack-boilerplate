import { render } from '@react-email/components'
import { createTransport } from 'nodemailer'
import type { JSX } from 'react'

import { logger } from '~/libs/logger'
import { tryCatchAsync } from '~/libs/utils'

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: import.meta.env.VITE_APP_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

type SendEmailOptions = {
  from?: string
  to: string
  subject: string
  react: JSX.Element
}

async function sendEmail({ from, to, subject, react }: SendEmailOptions) {
  const html = await render(react)

  const [error, result] = await tryCatchAsync(
    transporter.sendMail({
      from: from || `${import.meta.env.VITE_APP_NAME} <${import.meta.env.VITE_APP_EMAIL}>`,
      to,
      subject,
      html,
    }),
  )

  if (error) {
    logger.error(error.message)
    throw error
  }

  return result
}

export { sendEmail, transporter }
export type { SendEmailOptions }
