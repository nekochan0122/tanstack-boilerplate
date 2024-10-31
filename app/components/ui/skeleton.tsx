import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'

import { cx } from '~/libs/utils'

const Skeleton = forwardRef<
  ComponentRef<'div'>,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cx('animate-pulse rounded-md bg-muted', className)}
    {...props}
  />
))
Skeleton.displayName = 'Skeleton'

export { Skeleton }
