> [!WARNING]
> This boilerplate is still a work in progress and **should not be used in production**.

# TanStack Boilerplate

A fully **type-safe** boilerplate with a focus on UX and DX, complete with multiple examples.

## Features

- SSR - [TanStack Start](https://tanstack.com/start/latest)
- Form - [TanStack Form](https://tanstack.com/form/latest)
- Routing - [TanStack Router](https://tanstack.com/router/latest)
- Data Fetching - [TanStack Query](https://tanstack.com/query/latest)
- Authentication - [Better Auth](https://www.better-auth.com/)
- Localization - [use-intl](https://github.com/amannn/next-intl/blob/main/packages/use-intl/README.md) (core library of next-intl)
- Validation - [Zod](https://zod.dev/)
- ORM - [Prisma](https://www.prisma.io/)
- UI - [Shadcn UI](https://ui.shadcn.com/)
- Additional Features:
  - File Upload (TODO)
  - Form Builder
  - Custom Logger
  - Theme Switcher
  - Environment Variable Validation with Type Inference

## Issues or Pull Requests Tracking List

- HMR
  - https://github.com/TanStack/router/pull/2316
- Chained Server Fn Syntax, ServerFn Middleware
  - https://github.com/TanStack/router/pull/2513
- Server functions can't serialize error objects
  - https://github.com/TanStack/router/issues/2535
- Environment variables not loaded in production
  - https://github.com/nksaraf/vinxi/issues/277
  - https://github.com/unjs/nitro/issues/1492
  - `node --env-file=.env .\.output\server\index.mjs`
- Auto reload dev server when `.env` changes
  - https://github.com/nksaraf/vinxi/issues/345
- No valid compatibility date is specified
  - https://github.com/solidjs/solid-start/issues/1670
  - https://github.com/nitrojs/nitro/pull/2511
  - https://github.com/unjs/compatx/blob/main/RFC.md
