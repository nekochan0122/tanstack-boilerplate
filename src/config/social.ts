import { BsDiscord, BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'
import type { IconBaseProps, IconType } from 'react-icons'

import type { SocialProvider } from '~/server/social'

export type SocialProviderTheme = {
  id: SocialProvider
  name: string
  icon: IconType
  size: IconBaseProps['size']
  logoColor: IconBaseProps['color']
  textColor: IconBaseProps['color']
  backgroundColor: IconBaseProps['color']
}

export const socialProviderThemes: readonly SocialProviderTheme[] = [
  {
    id: 'google',
    name: 'Google',
    icon: FcGoogle,
    size: 20,
    logoColor: undefined,
    textColor: '#000',
    backgroundColor: '#fff',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: BsDiscord,
    size: 20,
    logoColor: '#fff',
    textColor: '#fff',
    backgroundColor: '#5865f2',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: BsGithub,
    size: 20,
    logoColor: '#fff',
    textColor: '#fff',
    backgroundColor: '#333',
  },
]
