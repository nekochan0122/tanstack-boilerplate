import { Link as RouterLink } from '@tanstack/react-router'
import type { ComponentProps } from 'react'

import type { FileRouteTypes } from '~/route-tree.gen'

type InternalLink = Exclude<FileRouteTypes['to'], ''>

type ExternalLink = `http${'s' | ''}://${string}`

type AnchorLink = `#${string}`

type ValidLink = InternalLink | ExternalLink | AnchorLink

type LinkProps<To extends ValidLink> = (
  To extends InternalLink
    ? ComponentProps<typeof RouterLink>
    : ComponentProps<'a'>
) & {
  to: To
}

function Link<To extends ValidLink>(props: LinkProps<To>) {
  switch (true) {
    case isInternalLink(props):
      return <RouterLink {...props} />

    case isExternalLink(props):
      return <a href={props.to} target='_blank' rel='noopener noreferrer' {...props} />

    case isAnchorLink(props):
      return <a href={props.to} {...props} />

    default:
      throw new Error(`Invalid link type: ${props.to}`)
  }
}

function isInternalLink(props: LinkProps<ValidLink>): props is LinkProps<InternalLink> {
  return typeof props.to === 'string' && props.to.startsWith('/')
}

function isExternalLink(props: LinkProps<ValidLink>): props is LinkProps<ExternalLink> {
  return typeof props.to === 'string' && props.to.startsWith('http')
}

function isAnchorLink(props: LinkProps<ValidLink>): props is LinkProps<AnchorLink> {
  return typeof props.to === 'string' && props.to.startsWith('#')
}

export { Link }
export type { AnchorLink, ExternalLink, InternalLink, ValidLink }
