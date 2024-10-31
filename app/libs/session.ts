/* eslint-disable react-hooks/rules-of-hooks */

import { useSession } from 'vinxi/http'
import type { Simplify } from 'type-fest'

import type { I18nSession } from '~/libs/i18n'

type VinxiSession = Simplify<Partial<I18nSession>>

export const getVinxiSessionHelper = async () => {
  return await useSession<VinxiSession>({
    name: 'vinxi-session',
    password: process.env.APP_SECRET,
  })
}
