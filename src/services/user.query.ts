import { useMutation } from '@tanstack/react-query'

import { useAuthInvalidate } from '~/services/auth.query'
import { changePassword, updateUser } from '~/services/user.api'

export const useUpdateUserMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: invalidateAuth,
  })

  return updateUserMutation
}

export const useChangePasswordMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: invalidateAuth,
  })

  return changePasswordMutation
}
