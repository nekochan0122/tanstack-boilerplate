/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Messages } from '~/libs/i18n'

declare global {
  interface IntlMessages extends Messages {}
}
