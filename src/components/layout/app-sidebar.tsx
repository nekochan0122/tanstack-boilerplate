import { Link } from '@tanstack/react-router'
import { LuCheck, LuChevronRight, LuChevronsUpDown, LuCommand, LuLanguages, LuLaptop, LuLogOut, LuMoon, LuMoreHorizontal, LuPalette, LuSun, LuUser } from 'react-icons/lu'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import type { ComponentProps } from 'react'

import { useTheme } from '~/components/theme'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '~/components/ui/sidebar'
import { TwemojiFlag } from '~/components/ui/twemoji'
import { navigation } from '~/config/navigation'
import { useAuthQuery, useSignOutMutation } from '~/services/auth.query'
import { useI18nQuery, useSetLocaleMutation } from '~/services/i18n.query'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const t = useTranslations()

  const theme = useTheme()
  const sidebar = useSidebar()

  const authQuery = useAuthQuery()
  const i18nQuery = useI18nQuery()
  const signOutMutation = useSignOutMutation()
  const setLocaleMutation = useSetLocaleMutation()

  async function handleSignOut() {
    const signOutPromise = signOutMutation.mutateAsync(undefined)

    toast.promise(signOutPromise, {
      loading: t('auth.sign-out-loading'),
      success: t('auth.sign-out-success'),
      error: t('auth.sign-out-error'),
    })
  }

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <LuCommand />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{import.meta.env.VITE_APP_NAME}</span>
                  <span className='truncate text-xs'>By NekoChan</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>
              {t(group.name)}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((menu) => (
                <Collapsible key={menu.name} asChild defaultOpen className='group/collapsible'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <menu.icon />
                        <span>{t(menu.name)}</span>
                        <LuChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.items.map((item) => (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton asChild>
                              <Link to={item.link}>
                                {t((item.name))}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        {/* <SidebarMenu>
          {Array.from({ length: 50 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              {i + 1}
            </SidebarMenuItem>
          ))}
        </SidebarMenu> */}
        <SidebarGroup className='mt-auto'>
          <SidebarGroupLabel>
            {t('sidebar.appearance')}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <LuPalette />
                    {t('sidebar.theme')}
                    <LuMoreHorizontal className='ml-auto' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={sidebar.isMobile ? 'bottom' : 'right'}
                  align={sidebar.isMobile ? 'end' : 'start'}
                  className='min-w-56 rounded-lg'
                >
                  <DropdownMenuItem onClick={() => theme.set('system')}>
                    <LuLaptop />
                    {t('sidebar.system')}
                    {theme.value === 'system' && <LuCheck className='ml-auto' />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => theme.set('light')}>
                    <LuSun />
                    {t('sidebar.light')}
                    {theme.value === 'light' && <LuCheck className='ml-auto' />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => theme.set('dark')}>
                    <LuMoon />
                    {t('sidebar.dark')}
                    {theme.value === 'dark' && <LuCheck className='ml-auto' />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <LuLanguages />
                    {t('sidebar.language')}
                    <LuMoreHorizontal className='ml-auto' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={sidebar.isMobile ? 'bottom' : 'right'}
                  align={sidebar.isMobile ? 'end' : 'start'}
                  className='min-w-56 rounded-lg'
                >
                  <DropdownMenuItem onClick={() => setLocaleMutation.mutate('en')}>
                    <TwemojiFlag countryCode='US' />
                    English
                    {i18nQuery.data.locale === 'en' && <LuCheck className='ml-auto' />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocaleMutation.mutate('zh-tw')}>
                    <TwemojiFlag countryCode='TW' />
                    繁體中文
                    {i18nQuery.data.locale === 'zh-tw' && <LuCheck className='ml-auto' />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {authQuery.data.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                    <Avatar className='size-8 rounded-lg'>
                      <AvatarImage src={authQuery.data.user.image || undefined} alt={authQuery.data.user.name} />
                      <AvatarFallback className='rounded-lg'>{authQuery.data.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>{authQuery.data.user.name}</span>
                      <span className='truncate text-xs'>{authQuery.data.user.email}</span>
                    </div>
                    <LuChevronsUpDown className='ml-auto size-4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  side={sidebar.isMobile ? 'bottom' : 'right'}
                  sideOffset={4}
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                >
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LuLogOut />
                    {t('auth.sign-out')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size='lg' asChild>
                <Link to='/sign-in'>
                  <Avatar className='size-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      <LuUser />
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>{t('auth.sign-in')}</span>
                    <span className='truncate text-xs'>{t('sidebar.sign-in-to-your-account')}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
