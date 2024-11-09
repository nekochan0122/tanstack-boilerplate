import { useMutation } from '@tanstack/react-query'

import { useAuthInvalidate } from '~/services/auth.query'
import { setUser } from '~/services/user.api'

export const useSetUserMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  const setUserMutation = useMutation({
    mutationFn: setUser,
    onSuccess: invalidateAuth,
  })

  return setUserMutation
}
