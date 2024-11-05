import { useMutation } from '@tanstack/react-query'

import { useInvalidateAuth } from '~/services/auth.query'
import { setUser } from '~/services/user.api'

export const useSetUserMutation = () => {
  const invalidateAuth = useInvalidateAuth()

  const setUserMutation = useMutation({
    mutationFn: setUser,
    onSuccess: invalidateAuth,
  })

  return setUserMutation
}
