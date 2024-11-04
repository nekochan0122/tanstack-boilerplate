import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

function Heading1({ className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1
      className={cx(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className,
      )}
      {...props}
    />
  )
}

function Heading2({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cx(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  )
}

function Heading3({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      className={cx(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function Heading4({ className, ...props }: ComponentProps<'h4'>) {
  return (
    <h4
      className={cx(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function Paragraph({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cx('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  )
}

function Blockquote({ className, ...props }: ComponentProps<'blockquote'>) {
  return (
    <blockquote
      className={cx('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  )
}

const Typography = {
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  H4: Heading4,
  P: Paragraph,
  Blockquote,
}

export { Typography }
