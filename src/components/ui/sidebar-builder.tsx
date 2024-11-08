import type { IconType } from 'react-icons'
import type { Simplify } from 'type-fest'

import type { TranslateKeys } from '~/libs/i18n'
import type { FileRouteTypes } from '~/route-tree.gen'

type InternalLink = FileRouteTypes['to']

type ExternalLink = `http${'s' | ''}://${string}`

type SidebarItem = SidebarItemGroup | SidebarItemButton | SidebarItemLink

type SidebarItemBase<
  Item extends { type: string },
> = Simplify<
  Item & {
    name: TranslateKeys
    icon?: IconType
  }
>

type SidebarItemGroup = SidebarItemBase<{
  type: 'group'
  items: SidebarItem[]
}>

type SidebarItemButton = SidebarItemBase<{
  type: 'button'
  onClick: () => void
}>

type SidebarItemLink = SidebarItemBase<{
  type: 'link'
  link: InternalLink | ExternalLink
}>

// group(), button(), link()

// type SidebarBuilderProps = {
//   items: SidebarItem[]
// }

// function SidebarBuilder({ items }: SidebarBuilderProps) {
//   return items
// }

// export { SidebarBuilder }
