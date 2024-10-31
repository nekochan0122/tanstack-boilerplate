import themeScript from '~/scripts/theme?raw'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Script } from '~/components/script'
import { createContextFactory } from '~/libs/utils'

type Theme = 'dark' | 'light' | 'system'

type ResolvedTheme = Exclude<Theme, 'system'>

type Context = {
  value: Theme
  resolved: ResolvedTheme
  set: (theme: Theme) => void
  toggle: () => void
}
const [ThemeContextProvider, useTheme] = createContextFactory<Context>(
  null,
  'useTheme must be used within a ThemeProvider',
)

type ThemeProviderProps = {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>('system')
  const [resolvedTheme, _setResolvedTheme] = useState<ResolvedTheme>(getResolvedTheme(theme))

  const setTheme = (theme: Theme) => {
    _setTheme(theme)
    localStorage.setItem('theme', theme)

    const resolvedTheme = getResolvedTheme(theme)
    _setResolvedTheme(resolvedTheme)
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const context: Context = {
    value: theme,
    resolved: resolvedTheme,
    set: setTheme,
    toggle: toggleTheme,
  }

  useEffect(() => {
    setTheme(getLocalTheme())
  }, [])

  return (
    <ThemeContextProvider value={context}>
      <Script content={themeScript} />
      {children}
    </ThemeContextProvider>
  )
}

function getLocalTheme(): Theme {
  if (typeof localStorage === 'undefined') {
    return 'system'
  }

  const localTheme = localStorage.getItem('theme')
  if (localTheme === null) throw new Error('Can\'t find theme in localStorage. Make sure you wrap the app with ThemeProvider.')

  return localTheme as Theme
}

function getPreferTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getResolvedTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getPreferTheme() : theme
}

export { ThemeProvider, useTheme }
export type { ResolvedTheme, Theme }
