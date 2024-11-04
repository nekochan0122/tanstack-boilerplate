// https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398

import { useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import type { ComponentProps } from 'react'
import type { IconType } from 'react-icons'
import type { Except } from 'type-fest'

import { PropsProvider } from '~/components/props-provider'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cx } from '~/libs/utils'

function InputPassword({ className, ...props }: Except<ComponentProps<typeof Input>, 'type'>) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cx('relative inline-block w-full', className)}>
      <Input
        type={showPassword ? 'text' : 'password'}
        autoComplete='new-password'
        className='pr-10'
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
}

export { InputPassword }
