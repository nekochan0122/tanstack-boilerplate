// https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398

import { forwardRef, useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import type { ComponentProps, ComponentRef } from 'react'
import type { IconType } from 'react-icons'
import type { Except } from 'type-fest'

import { PropsProvider } from '~/components/props-provider'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cx } from '~/libs/utils'

type InputPasswordProps = ComponentProps<typeof InputPassword>

const defaultProps: InputPasswordProps = {
  autoComplete: 'new-password',
}

const InputPassword = forwardRef<
  ComponentRef<typeof Input>,
  Except<ComponentProps<typeof Input>, 'type'>
>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className={cx('relative inline-block w-full', className)}>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className='pr-10'
          {...defaultProps}
          {...props}
        />
        <Button
          size='sm'
          variant='ghost'
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label='Toggle password visibility'
          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
        >
          <PropsProvider<IconType> aria-hidden className='size-4'>
            {showPassword && !props.disabled ? <LuEye /> : <LuEyeOff />}
          </PropsProvider>
        </Button>
      </div>
    )
  },
)
InputPassword.displayName = 'InputPassword'

export { InputPassword }
export type { InputPasswordProps }
