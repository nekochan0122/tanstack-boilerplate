import type { ComponentProps, HTMLInputTypeAttribute } from 'react'

import { cx } from '~/libs/utils'

// https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/
const defaultInputModes: Partial<Record<HTMLInputTypeAttribute, ComponentProps<'input'>['inputMode']>> = {
  url: 'url',
  tel: 'tel',
  text: 'text',
  email: 'email',
  number: 'numeric',
}

function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type='text'
      spellCheck={false}
      autoComplete='off'
      onWheel={(e) => e.currentTarget.blur()}
      inputMode={defaultInputModes[props.type ?? 'text']}
      className={cx(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
