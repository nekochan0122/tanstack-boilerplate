import { useMutation } from '@tanstack/react-query'

import { useAuthInvalidate } from '~/services/auth.query'
import { changeEmail, changePassword, resendEmailVerif, updateUser, verifyEmail } from '~/services/user.api'

export const useUpdateUserMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: invalidateAuth(),
  })
}

export const useChangeEmailMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: changeEmail,
    onSuccess: invalidateAuth(),
  })
}

export const useChangePasswordMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: changePassword,
    onSuccess: invalidateAuth(),
  })
}

export const useVerifyEmailMutation = () => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: invalidateAuth(),
  })
}

export const useResendEmailVerifMutation = () => {
  return useMutation({
    mutationFn: resendEmailVerif,
  })
}
