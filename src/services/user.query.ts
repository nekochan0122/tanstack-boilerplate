import { useMutation } from '@tanstack/react-query'

import { useAuthInvalidate } from '~/services/auth.query'
import { changeEmail, changePassword, sendVerificationEmail, updateUser } from '~/services/user.api'

export const useUpdateUserMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: invalidateAuth,
  })
}

export const useChangeEmailMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: changeEmail,
    onSuccess: invalidateAuth,
  })
}

export const useChangePasswordMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: changePassword,
    onSuccess: invalidateAuth,
  })
}

export const useSendVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: sendVerificationEmail,
  })
}
