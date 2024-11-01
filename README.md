# TanStack Boilerplate (WIP)

A fully **type-safe** boilerplate with a focus on UX and DX, complete with multiple examples.

## Features

- SSR - TanStack Start
- Form - TanStack Form
- Routing - TanStack Router
- Data Fetching - TanStack Query
- Authentication - Better Auth
- Localization - use-intl (core library of next-intl)
- Validation - Zod
- ORM - Prisma
- UI - Shadcn UI
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
- Custom Scaffolding
  - https://github.com/TanStack/router/pull/2394
- Server functions can't serialize error objects
  - https://github.com/TanStack/router/issues/2535
- Environment Variables Not Loaded in Production
  - https://github.com/nksaraf/vinxi/issues/277
  - https://github.com/unjs/nitro/issues/1492
  - `node --env-file=.env .\.output\server\index.mjs`