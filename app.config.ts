import { exec } from 'node:child_process'
import { join } from 'node:path'

import { defineConfig } from '@tanstack/start/config'
import tsconfigPathsPlugin from 'vite-plugin-tsconfig-paths'
import type { App } from 'vinxi'

const config = {
  appDirectory: 'src',
  autoOpenBrowser: false,
}

const app = defineConfig({
  server: {
    preset: 'node-server',
    compatibilityDate: '2024-11-16',
  },
  routers: {
    api: {
      entry: join(config.appDirectory, 'entry-api.ts'),
    },
    ssr: {
      entry: join(config.appDirectory, 'entry-server.ts'),
    },
    client: {
      entry: join(config.appDirectory, 'entry-client.tsx'),
    },
  },
  tsr: {
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
    ssr: {
      external: [
        '@node-rs/argon2-wasm32-wasi',
      ],
    },
    resolve: {
      alias: {
        // https://github.com/prisma/prisma/issues/12504#issuecomment-2094394268
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
    plugins: [
      tsconfigPathsPlugin({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
  react: {
    babel: {
      plugins: [
        [
          'babel-plugin-react-compiler',
          {
            target: '19',
          },
        ],
      ],
    },
  },
})

// https://github.com/nksaraf/vinxi/issues/34#issuecomment-1871437097
// https://github.com/nksaraf/vinxi/blob/b0ccb64d3c37488050eb9411be4290ea466c3eba/packages/vinxi/lib/dev-server.js#L225
app.hooks.hook('app:dev:server:listener:created', ({ listener }) => {
  if (!config.autoOpenBrowser) return
  exec(`start ${listener.url}`)
})

// https://discord.com/channels/719702312431386674/1238170697650405547/1300589573080092723
function withGlobalMiddleware(app: App) {
  return {
    ...app,
    config: {
      ...app.config,
      routers: app.config.routers.map((router) => ({
        ...router,
        middleware: router.target === 'server' ? join(config.appDirectory, 'global-middleware.ts') : undefined,
      })),
    },
  }
}

export default withGlobalMiddleware(app)
