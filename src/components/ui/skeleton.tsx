import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

const Skeleton = (
  { className, ...props }: ComponentProps<'div'>,
) => (
  <div
    className={cx('animate-pulse rounded-md bg-muted', className)}
    {...props}
  />
)

export { Skeleton }
