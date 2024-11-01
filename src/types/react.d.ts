/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import 'react'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
