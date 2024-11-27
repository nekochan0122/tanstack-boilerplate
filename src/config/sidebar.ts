import { LuKeyRound, LuLaptop, LuMoon, LuShieldCheck, LuSun, LuUser } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import type { Country } from 'react-phone-number-input'

import type { Theme } from '~/components/theme'
import type { NavItem } from '~/components/ui/sidebar-nav-builder'
import type { Locale } from '~/libs/i18n'

export type LanguageOption = {
  locale: Locale
  countryCode: Country
  label: string
}

export const languageOptions: readonly LanguageOption[] = [
  { locale: 'en', countryCode: 'US', label: 'English' },
  { locale: 'zh-tw', countryCode: 'TW', label: '繁體中文' },
]

export type ThemeOption = {
  value: Theme
  Icon: IconType
}

export const themeOptions: readonly ThemeOption[] = [
  { value: 'system', Icon: LuLaptop },
  { value: 'light', Icon: LuSun },
  { value: 'dark', Icon: LuMoon },
]

export const navigation: readonly NavItem[] = [
  {
    type: 'group',
    name: 'navigation.playground',
    items: [
      {
        type: 'menu',
        name: 'navigation.auth',
        icon: LuKeyRound,
        items: [
          {
            type: 'link',
            name: 'navigation.sign-in',
            link: '/auth/sign-in',
          },
          {
            type: 'link',
            name: 'navigation.sign-up',
            link: '/auth/sign-up',
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
            name: 'navigation.account-settings',
            link: '/user/account-settings',
          },
          {
            type: 'link',
            name: 'navigation.change-password',
            link: '/user/change-password',
          },
          {
            type: 'link',
            name: 'navigation.change-email',
            link: '/user/change-email',
          },
          {
            type: 'link',
            name: 'navigation.email-verification',
            link: '/user/email-verification',
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
