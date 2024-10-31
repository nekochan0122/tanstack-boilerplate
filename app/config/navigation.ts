import { LuKeyRound } from 'react-icons/lu'
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
          {
            name: 'navigation.protected',
            link: '/protected',
          },
          {
            name: 'navigation.protected-admin',
            link: '/protected-admin',
          },
        ],
      },
    ],
  },
]
