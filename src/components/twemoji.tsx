import twemoji from '@twemoji/api'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'

import { cx } from '~/libs/utils'

const BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest'

type TwemojiProps = {
  emoji: string
  format?: 'svg' | 'png'
}

const Twemoji = forwardRef<
  ComponentRef<'img'>,
  ComponentPropsWithoutRef<'img'> & TwemojiProps
>(({ emoji, format = 'svg', className, ...props }, ref) => {
  const codePoint = twemoji.convert.toCodePoint(emoji)
  const folder = format === 'svg' ? 'svg' : '72x72'
  const url = `${BASE}/assets/${folder}/${codePoint}.${format}`

  return (
    <img
      ref={ref}
      src={url}
      alt={emoji}
      className={cx('inline-block size-[1.2em] align-text-bottom', className)}
      {...props}
    />
  )
})
Twemoji.displayName = 'Twemoji'

export { Twemoji }
