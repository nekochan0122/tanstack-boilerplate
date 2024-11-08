import { LuKeyRound, LuShieldCheck, LuUser } from 'react-icons/lu'

import type { NavItem } from '~/components/ui/sidebar-nav-builder'

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

export { navigation }
