import { exec } from 'node:child_process'
import { join } from 'node:path'

import { index, layout, rootRoute, route } from '@tanstack/react-router-virtual-file-routes'
import { defineConfig } from '@tanstack/start/config'
import tsconfigPathsPlugin from 'vite-plugin-tsconfig-paths'
import type { App } from 'vinxi'

const routes = rootRoute('root.tsx', [
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

const config = {
  appDirectory: 'src',
  autoOpenBrowser: false,
}

const app = defineConfig({
  server: {
    preset: 'node-server',
  },
  routers: {
    api: {
      entry: join(config.appDirectory, 'entry-api.ts'),
    },
    ssr: {
      entry: join(config.appDirectory, 'entry-server.ts'),
    },
    client: {
      entry: join(config.appDirectory, 'entry-client.ts'),
    },
  },
  tsr: {
    virtualRouteConfig: routes,
    appDirectory: config.appDirectory,
    generatedRouteTree: join(config.appDirectory, 'route-tree.gen.ts'),
    quoteStyle: 'single',
    semicolons: false,
    customScaffolding: {
      routeTemplate: [
        '%%tsrImports%%\n\n',
        '%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n',
        'function RouteComponent() { return "Hello %%tsrPath%%!" }\n',
      ].join(''),
      apiTemplate: [
        'import { json } from "@tanstack/start";\n',
        '%%tsrImports%%\n\n',
        '%%tsrExportStart%%{ GET: ({ request, params }) => { return json({ message:\'Hello "%%tsrPath%%"!\' }) }}%%tsrExportEnd%%\n',
      ].join(''),
    },
  },
  vite: {
    plugins: [
      tsconfigPathsPlugin({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})

// https://github.com/nksaraf/vinxi/issues/34#issuecomment-1871437097
// https://github.com/nksaraf/vinxi/blob/b0ccb64d3c37488050eb9411be4290ea466c3eba/packages/vinxi/lib/dev-server.js#L225
app.hooks.hook('app:dev:server:listener:created', ({ listener }) => {
  if (!config.autoOpenBrowser) return
  exec(`start ${listener.url}`)
})

// https://discord.com/channels/719702312431386674/1238170697650405547/1300589573080092723
function withMiddleware(app: App) {
  return {
    ...app,
    config: {
      ...app.config,
      routers: app.config.routers.map((router) => ({
        ...router,
        middleware: router.target !== 'server' ? undefined : join(config.appDirectory, 'middleware.ts'),
      })),
    },
  }
}

export default withMiddleware(app)
