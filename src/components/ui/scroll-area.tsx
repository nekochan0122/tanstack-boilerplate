import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

function ScrollArea({ children, ...props }: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaRoot {...props}>
      <ScrollViewport>
        {children}
      </ScrollViewport>
      <ScrollBar />
      <ScrollCorner />
    </ScrollAreaRoot>
  )
}

function ScrollAreaRoot({ className, ...props }: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      className={cx('relative overflow-hidden', className)}
      {...props}
    />
  )
}

function ScrollViewport({ className, ...props }: ComponentProps<typeof ScrollAreaPrimitive.Viewport>) {
  return (
    <ScrollAreaPrimitive.Viewport
      className={cx('size-full rounded-[inherit]', className)}
      {...props}
    />
  )
}

function ScrollBar({ orientation = 'vertical', className, ...props }: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cx(
        'flex touch-none select-none',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-border' />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

const ScrollCorner = ScrollAreaPrimitive.Corner

export { ScrollArea, ScrollAreaRoot, ScrollBar, ScrollCorner, ScrollViewport }
