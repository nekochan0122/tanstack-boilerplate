/* eslint-disable jsx-a11y/heading-has-content */

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'

import { cx } from '~/libs/utils'

const Heading1 = forwardRef<
  ComponentRef<'h1'>,
  ComponentPropsWithoutRef<'h1'>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cx(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      className,
    )}
    {...props}
  />
))
Heading1.displayName = 'Heading1'

const Heading2 = forwardRef<
  ComponentRef<'h2'>,
  ComponentPropsWithoutRef<'h2'>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cx(
      'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      className,
    )}
    {...props}
  />
))
Heading2.displayName = 'Heading2'

const Heading3 = forwardRef<
  ComponentRef<'h3'>,
  ComponentPropsWithoutRef<'h3'>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cx(
      'scroll-m-20 text-2xl font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
))
Heading3.displayName = 'Heading3'

const Heading4 = forwardRef<
  ComponentRef<'h4'>,
  ComponentPropsWithoutRef<'h4'>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cx(
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
))
Heading4.displayName = 'Heading4'

const Paragraph = forwardRef<
  ComponentRef<'p'>,
  ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cx('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...props}
  />
))
Paragraph.displayName = 'Paragraph'

const Blockquote = forwardRef<
  ComponentRef<'blockquote'>,
  ComponentPropsWithoutRef<'blockquote'>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cx('mt-6 border-l-2 pl-6 italic', className)}
    {...props}
  />
))
Blockquote.displayName = 'Blockquote'

const Typography = {
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  H4: Heading4,
  P: Paragraph,
  Blockquote,
}

export { Typography }
