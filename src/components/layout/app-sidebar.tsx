import { Link } from '@tanstack/react-router'
import { LuCheck, LuChevronsUpDown, LuCommand, LuKeyRound, LuLanguages, LuLaptop, LuLogOut, LuMoon, LuMoreHorizontal, LuPalette, LuShieldCheck, LuSun, LuUser } from 'react-icons/lu'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import type { ComponentProps } from 'react'
import type { IconType } from 'react-icons'
import type { Country } from 'react-phone-number-input'

import { useTheme } from '~/components/theme'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar'
import { SidebarNavBuilder } from '~/components/ui/sidebar-nav-builder'
import { TwemojiFlag } from '~/components/ui/twemoji'
import { useAuthQuery, useSignOutMutation } from '~/services/auth.query'
import { useI18nQuery, useSetLocaleMutation } from '~/services/i18n.query'
import type { Theme } from '~/components/theme'
import type { NavItem } from '~/components/ui/sidebar-nav-builder'
import type { SupportedLocales } from '~/libs/i18n'

type ThemeOption = { value: Theme; Icon: IconType }

type LanguageOption = { locale: SupportedLocales; countryCode: Country; label: string }

const themeOptions: ThemeOption[] = [
  { value: 'system', Icon: LuLaptop },
  { value: 'light', Icon: LuSun },
  { value: 'dark', Icon: LuMoon },
]

const languageOptions: LanguageOption[] = [
  { locale: 'en', countryCode: 'US', label: 'English' },
  { locale: 'zh-tw', countryCode: 'TW', label: '繁體中文' },
]

const navigation: NavItem[] = [
  {
    type: 'group',
    name: 'navigation.playground',
    items: [
      {
        type: 'menu',
        name: 'navigation.authentication',
        icon: LuKeyRound,
        items: [
          {
            type: 'link',
            name: 'navigation.sign-in',
            link: '/sign-in',
          },
          {
            type: 'link',
            name: 'navigation.sign-up',
            link: '/sign-up',
          },
        ],
      },
      {
        type: 'menu',
        name: 'navigation.user',
        icon: LuUser,
        items: [
          {
            type: 'link',
            name: 'navigation.profile',
            link: '/user/profile',
          },
          {
            type: 'link',
            name: 'navigation.account-settings',
            link: '/user/account-settings',
          },
        ],
      },
      {
        type: 'menu',
        name: 'navigation.admin',
        icon: LuShieldCheck,
        items: [
          {
            type: 'link',
            name: 'navigation.dashboard',
            link: '/admin/dashboard',
          },
          {
            type: 'link',
            name: 'navigation.user-management',
            link: '/admin/user-management',
          },
        ],
      },
    ],
  },
]

function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarNavBuilder {...{ navigation }} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarAppearance />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}

function SidebarLogo() {
  return (
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
  )
}

function SidebarAppearance() {
  const t = useTranslations()

  const theme = useTheme()
  const sidebar = useSidebar()

  const i18nQuery = useI18nQuery()
  const setLocaleMutation = useSetLocaleMutation()

  return (
    <SidebarGroup>
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
              {themeOptions.map(({ value, Icon }) => (
                <DropdownMenuItem key={value} onClick={() => theme.set(value)}>
                  <Icon />
                  {t(`sidebar.${value}`)}
                  {theme.value === value && <LuCheck className='ml-auto' />}
                </DropdownMenuItem>
              ))}
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
              {languageOptions.map(({ locale, countryCode, label }) => (
                <DropdownMenuItem key={locale} onClick={() => setLocaleMutation.mutate(locale)}>
                  <TwemojiFlag countryCode={countryCode} />
                  {label}
                  {i18nQuery.data.locale === locale && <LuCheck className='ml-auto' />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function SidebarUser() {
  const t = useTranslations()

  const sidebar = useSidebar()

  const authQuery = useAuthQuery()
  const signOutMutation = useSignOutMutation()

  async function handleSignOut() {
    const signOutPromise = signOutMutation.mutateAsync(undefined)

    toast.promise(signOutPromise, {
      loading: t('auth.sign-out-loading'),
      success: t('auth.sign-out-success'),
      error: t('auth.sign-out-error'),
    })
  }

  return (
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
  )
}

export { AppSidebar }
