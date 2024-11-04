import { Slot } from '@radix-ui/react-slot'
import { LuChevronRight, LuMoreHorizontal } from 'react-icons/lu'
import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

function Breadcrumb(props: ComponentProps<'nav'>) {
  return (
    <nav aria-label='breadcrumb' {...props}>
      {props.children}
    </nav>
  )
}

function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cx(
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={cx('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  )
}

function BreadcrumbLink({ asChild, className, ...props }: ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      className={cx('hover:text-foreground', className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cx('font-normal text-foreground', className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      role='presentation'
      aria-hidden='true'
      className={cx('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <LuChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      role='presentation'
      aria-hidden='true'
      className={cx('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <LuMoreHorizontal className='size-4' />
      <span className='sr-only'>More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
