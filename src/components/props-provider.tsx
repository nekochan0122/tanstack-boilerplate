import { Children, cloneElement, isValidElement } from 'react'
import type { ComponentProps, ComponentType, PropsWithChildren } from 'react'

type PropsProviderProps<ComponentOrProps> = PropsWithChildren<
  ComponentOrProps extends ComponentType
    ? ComponentProps<ComponentOrProps>
    : ComponentOrProps
>

function PropsProvider<ComponentOrProps>({ children, ...props }: PropsProviderProps<ComponentOrProps>) {
  const newChildren = Children.map(children, (child) => {
    return isValidElement(child)
      ? cloneElement(child, props)
      : child
  })

  return <>{newChildren}</>
}

export { PropsProvider }
