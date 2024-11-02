// FIXME: dev server is not restart when this file is changed

import { index, layout, rootRoute, route } from '@tanstack/react-router-virtual-file-routes'

export const appRoutes = rootRoute('root.tsx', [
  index('app/_index.tsx'),

  layout('auth', 'app/auth/_layout.tsx', [
    route('/sign-in', 'app/auth/sign-in.tsx'),
    route('/sign-up', 'app/auth/sign-up.tsx'),
  ]),

  layout('protected-user', 'app/protected/user/_layout.tsx', [
    route('/user/profile', 'app/protected/user/profile.tsx'),
    route('/user/account-settings', 'app/protected/user/account-settings.tsx'),
  ]),

  layout('protected-admin', 'app/protected/admin/_layout.tsx', [
    route('/admin/dashboard', 'app/protected/admin/dashboard.tsx'),
    route('/admin/user-management', 'app/protected/admin/user-management.tsx'),
  ]),
])
