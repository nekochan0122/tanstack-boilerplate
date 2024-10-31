import { useMediaQuery } from '@mantine/hooks'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`)

  return !!isMobile
}
