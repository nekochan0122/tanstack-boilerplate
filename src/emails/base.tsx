import { Body, Button, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components'
import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

type EmailLayoutProps = ComponentProps<typeof Container> & {
  preview?: string
}

export function EmailLayout({ preview, className, children, ...props }: EmailLayoutProps) {
  return (
    <Tailwind>
      <Html>
        {preview && <Preview>{preview}</Preview>}
        <Head />
        <Body className='m-auto bg-white px-2 font-sans'>
          <Container
            className={cx(
              'mx-auto my-[40px] max-w-[465px] rounded border border-solid border-zinc-200 p-[20px]',
              className,
            )}
            {...props}
          >
            {children}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

export function EmailHeading({ className, ...props }: ComponentProps<typeof Heading>) {
  return (
    <Heading
      className={cx(
        'mx-0 my-[30px] p-0 text-center text-[24px] font-semibold text-black',
        className,
      )}
      {...props}
    />
  )
}

export function EmailButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cx(
        'rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline',
        className,
      )}
      {...props}
    />
  )
}
