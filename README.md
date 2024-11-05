> [!WARNING]
> This boilerplate is still a work in progress and **should not be used in production**.

# TanStack Boilerplate

A fully **type-safe** boilerplate with a focus on UX and DX, complete with multiple examples.

## Tech Stack

- [React 19](https://19.react.dev/)
- [React Compiler](https://19.react.dev/learn/react-compiler)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Form](https://tanstack.com/form/latest)
- [Better Auth](https://www.better-auth.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [next-intl core library](https://next-intl-docs.vercel.app/docs/environments/core-library)

## Utilities

- File Upload *(TODO)* - Supports file uploads to any object storage service with a S3-compatible API.
- Form Builder *(WIP)* - A type-safe form builder powered by TanStack Form.
- Custom Logger - A visually appealing logger compatible with both browser and Node environments.
- Theme Switcher - A `next-themes`-like API that integrates seamlessly with TanStack Start.
- Environment Variable Validation - Type-safe, runtime validation of environment variables for a more secure configuration.

## Issues or Pull Requests Tracking List

- Start
  - HMR
    - https://github.com/TanStack/router/pull/2316
  - Chained Server Fn Syntax, ServerFn Middleware
    - https://github.com/TanStack/router/pull/2513
  - Server functions can't serialize error objects
    - https://github.com/TanStack/router/issues/2535
  - Flash of Unstyled Content for quickstart plus a CSS file
    - https://github.com/TanStack/router/issues/2700
- Router
  - Router optional params for i18n
    - https://github.com/TanStack/router/discussions/146#discussioncomment-10917959
- Virtual
  - Compatibility with the React compiler
    - https://github.com/TanStack/virtual/issues/736
    - https://github.com/TanStack/virtual/pull/851
- Vinxi
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
- ESLint
  - Tailwindcss Plugin
    - no-multiple-whitespace rule
      - https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/370
