import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { i18nQueryOptions } from '~/services/i18n.query'
import { getPreference, updatePreference } from '~/services/preference.api'

export const preferenceQueryOptions = () => queryOptions({
  queryKey: ['preference'],
  queryFn: () => getPreference(),
})

export const usePreferenceQuery = () => {
  return useSuspenseQuery(preferenceQueryOptions())
}

export const useUpdatePreferenceMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePreference,
    onSuccess: async () => {
      await queryClient.invalidateQueries(preferenceQueryOptions())
      await queryClient.invalidateQueries(i18nQueryOptions())
      await router.invalidate()
    },
  })
}
