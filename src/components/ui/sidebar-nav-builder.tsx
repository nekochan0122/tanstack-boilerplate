import { LuChevronRight } from 'react-icons/lu'
import { useTranslations } from 'use-intl'
import type { IconType } from 'react-icons'
import type { Simplify } from 'type-fest'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { Link } from '~/components/ui/link'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '~/components/ui/sidebar'
import type { ValidLink } from '~/components/ui/link'
import type { TranslateKeys } from '~/libs/i18n'

type NavItem = NavItemGroup | NavItemMenu | NavItemLink

type NavItemBase<
  Item extends { type: string },
> = Simplify<
  Item & {
    name: TranslateKeys
  }
>

type NavItemGroup = NavItemBase<{
  type: 'group'
  items: NavItem[]
}>

type NavItemMenu = NavItemBase<{
  type: 'menu'
  icon: IconType
  items: NavItem[]
}>

type NavItemLink = NavItemBase<{
  type: 'link'
  link: ValidLink
}>

type SidebarNavBuilderProps = {
  navigation: NavItem[]
}

function SidebarNavBuilder({ navigation }: SidebarNavBuilderProps) {
  const t = useTranslations()

  return (
    <>
      {navigation.map((item) => {
        switch (item.type) {
          case 'group':
            return (
              <SidebarGroup key={item.name}>
                <SidebarGroupLabel>
                  {t(item.name)}
                </SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarNavBuilder navigation={item.items} />
                </SidebarMenu>
              </SidebarGroup>
            )

          case 'menu':
            return (
              <Collapsible key={item.name} asChild defaultOpen className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{t(item.name)}</span>
                      <LuChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarNavBuilder navigation={item.items} />
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )

          case 'link':
            return (
              <SidebarMenuSubItem key={item.name}>
                <SidebarMenuSubButton asChild>
                  <Link to={item.link}>
                    {t(item.name)}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )

          default:
            // @ts-expect-error to show an error when the type is not handled
            throw new Error(`Unhandled navigation item type: ${item.type}`)
        }
      })}
    </>
  )
}

export { SidebarNavBuilder }
export type { NavItem }
