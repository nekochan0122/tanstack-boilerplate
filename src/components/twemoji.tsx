import twemoji from '@twemoji/api'
import type { ComponentProps } from 'react'

import { cx } from '~/libs/utils'

const BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest'

export type TwemojiProps = ComponentProps<'img'> & {
  emoji: string
  format?: 'svg' | 'png'
}

export function Twemoji({ emoji, format = 'svg', className, ...props }: TwemojiProps) {
  const decodedEmoji = decodeUnicodeEscapes(emoji)
  console.log({ emoji, decodedEmoji })
  const codePoint = twemoji.convert.toCodePoint(decodedEmoji)
  const folder = format === 'svg' ? 'svg' : '72x72'
  const url = `${BASE}/assets/${folder}/${codePoint}.${format}`

  return (
    <img
      src={url}
      alt={decodedEmoji}
      className={cx('inline-block size-[1.2em] align-text-bottom', className)}
      {...props}
    />
  )
}

function decodeUnicodeEscapes(inputStr: string) {
  return inputStr.replaceAll(/\\u([\da-f]{4})/gi, (_, grp) =>
    String.fromCharCode(parseInt(grp, 16)),
  )
}
