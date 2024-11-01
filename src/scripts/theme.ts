function initTheme() {
  const localTheme = localStorage.getItem('theme')
  const preferTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const resolvedTheme = localTheme === null || localTheme === 'system' ? preferTheme : localTheme

  if (localTheme === null) {
    localStorage.setItem('theme', 'system')
  }

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
}

initTheme()
