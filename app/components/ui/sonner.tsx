import { Toaster as Sonner } from 'sonner'
import type { ComponentPropsWithoutRef } from 'react'

import { useTheme } from '~/components/theme'

type ToasterProps = ComponentPropsWithoutRef<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useTheme()

  return (
    <Sonner
      theme={theme.value}
      style={{ zIndex: 999 }}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export type { ToasterProps }
