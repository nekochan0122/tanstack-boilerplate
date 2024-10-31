import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { getI18n, setLocale } from '~/services/i18n.api'

export const getI18nQueryOptions = () => queryOptions({
  queryKey: ['i18n'],
  queryFn: () => getI18n(),
})

export const useI18nQuery = () => {
  return useSuspenseQuery(getI18nQueryOptions())
}

export const useSetLocaleMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setLocale,
    onSuccess: async () => {
      await queryClient.invalidateQueries(getI18nQueryOptions())
      await router.invalidate()
    },
  })
}
