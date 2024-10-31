import { forwardRef } from 'react'
import type { ComponentProps, ComponentPropsWithoutRef, ComponentRef, HTMLInputTypeAttribute } from 'react'
import type { SetRequired } from 'type-fest'

import { cx } from '~/libs/utils'

type InputProps = ComponentProps<typeof Input>

const defaultProps: SetRequired<InputProps, 'type'> = {
  type: 'text',
  spellCheck: false,
  autoComplete: 'off',
}

// https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/
const defaultInputModes: Partial<Record<HTMLInputTypeAttribute, InputProps['inputMode']>> = {
  url: 'url',
  tel: 'tel',
  text: 'text',
  email: 'email',
  number: 'numeric',
}

const Input = forwardRef<
  ComponentRef<'input'>,
  ComponentPropsWithoutRef<'input'>
>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        onWheel={(e) => e.currentTarget.blur()}
        inputMode={defaultInputModes[props.type ?? defaultProps.type]}
        className={cx(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...defaultProps}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
export type { InputProps }
