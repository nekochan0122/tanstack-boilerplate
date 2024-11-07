import twemoji from '@twemoji/api'
import type { ComponentProps } from 'react'
import type { Country } from 'react-phone-number-input'

import { cx } from '~/libs/utils'

const BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest'

type TwemojiProps = ComponentProps<'img'> & {
  emoji: string
  format?: 'svg' | 'png'
}

function Twemoji({ emoji, format = 'svg', className, ...props }: TwemojiProps) {
  const decodedEmoji = decodeUnicodeEscapes(emoji)
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

type TwemojiFlagProps = ComponentProps<'img'> & {
  countryCode: Country
  format?: 'svg' | 'png'
}

function TwemojiFlag ({ countryCode, format = 'svg', className, ...props }: TwemojiFlagProps) {
  const emoji = countryCodeToEmoji(countryCode)

  return (
    <Twemoji
      emoji={emoji}
      format={format}
      className={className}
      {...props}
    />
  )
}

function decodeUnicodeEscapes(inputStr: string) {
  return inputStr.replaceAll(/\\u([\da-f]{4})/gi, (_, grp) =>
    String.fromCharCode(parseInt(grp, 16)),
  )
}

function countryCodeToEmoji(countryCode: Country): string {
  if (countryCode.length !== 2) return countryCode

  const codePoints = [...countryCode.toUpperCase()].map((char) =>
    0x1_F1_E6 + char.charCodeAt(0) - 65,
  )

  return String.fromCodePoint(...codePoints)
}

export { Twemoji, TwemojiFlag }
