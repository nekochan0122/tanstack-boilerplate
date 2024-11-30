import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { LuCheck } from 'react-icons/lu'
import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cx(
        'peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cx('flex items-center justify-center text-current')}
      >
        <LuCheck className='size-3.5' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
