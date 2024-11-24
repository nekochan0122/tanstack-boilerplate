import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { getI18n } from '~/services/i18n.api'

export const i18nQueryOptions = () => queryOptions({
  queryKey: ['i18n'],
  queryFn: () => getI18n(),
})

export const useI18nQuery = () => {
  return useSuspenseQuery(i18nQueryOptions())
}
