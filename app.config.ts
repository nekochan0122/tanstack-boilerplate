import { defineConfig } from '@tanstack/start/config'
import tsconfigPathsPlugin from 'vite-plugin-tsconfig-paths'
import type { App } from 'vinxi'

const app = defineConfig({
  server: {
    preset: 'node-server',
  },
  routers: {
    api: {
      entry: './app/entry-api.ts',
    },
    ssr: {
      entry: './app/entry-server.ts',
    },
    client: {
      entry: './app/entry-client.ts',
    },
  },
  tsr: {
    appDirectory: 'app',
    generatedRouteTree: 'app/route-tree.gen.ts',
    quoteStyle: 'single',
    semicolons: false,
  },
  vite: {
    plugins: [
      tsconfigPathsPlugin({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})

function withMiddleware(app: App) {
  return {
    ...app,
    config: {
      ...app.config,
      routers: app.config.routers.map((router) => ({
        ...router,
        middleware: router.target === 'server' ? './app/middleware.ts' : undefined,
      })),
    },
  }
}

export default withMiddleware(app)
