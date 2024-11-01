import { LuKeyRound, LuShieldCheck, LuUser } from 'react-icons/lu'
import type { IconType } from 'react-icons'

import type { TranslateKeys } from '~/libs/i18n'
import type { FileRouteTypes } from '~/route-tree.gen'

type NavigationGroup = {
  name: TranslateKeys
  items: NavigationGroupMenu[]
}

type NavigationGroupMenu = {
  name: TranslateKeys
  icon: IconType
  items: NavigationItem[]
}

type NavigationItem = {
  name: TranslateKeys
  link: FileRouteTypes['to']
}

export const navigation: NavigationGroup[] = [
  {
    name: 'navigation.playground',
    items: [
      {
        name: 'navigation.authentication',
        icon: LuKeyRound,
        items: [
          {
            name: 'navigation.sign-in',
            link: '/sign-in',
          },
          {
            name: 'navigation.sign-up',
            link: '/sign-up',
          },
        ],
      },
      {
        name: 'navigation.user',
        icon: LuUser,
        items: [
          {
            name: 'navigation.profile',
            link: '/user/profile',
          },
          {
            name: 'navigation.account-settings',
            link: '/user/account-settings',
          },
        ],
      },
      {
        name: 'navigation.admin',
        icon: LuShieldCheck,
        items: [
          {
            name: 'navigation.dashboard',
            link: '/admin/dashboard',
          },
          {
            name: 'navigation.user-management',
            link: '/admin/user-management',
          },
        ],
      },
    ],
  },
]
