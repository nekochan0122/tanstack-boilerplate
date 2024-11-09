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
    case isInternalLinkProps(props):
      return <RouterLink {...props} />

    case isExternalLinkProps(props):
      return <a href={props.to} target='_blank' rel='noopener noreferrer' {...props} />

    case isAnchorLinkProps(props):
      return <a href={props.to} {...props} />

    default:
      throw new Error(`Invalid link type: ${props.to}`)
  }
}

function isInternalLink(link: string): link is InternalLink {
  return typeof link === 'string' && link.startsWith('/')
}

function isExternalLink(link: string): link is ExternalLink {
  return typeof link === 'string' && link.startsWith('http')
}

function isAnchorLink(link: string): link is AnchorLink {
  return typeof link === 'string' && link.startsWith('#')
}

function isInternalLinkProps(props: LinkProps<ValidLink>): props is LinkProps<InternalLink> {
  return isInternalLink(props.to)
}

function isExternalLinkProps(props: LinkProps<ValidLink>): props is LinkProps<ExternalLink> {
  return isExternalLink(props.to)
}

function isAnchorLinkProps(props: LinkProps<ValidLink>): props is LinkProps<AnchorLink> {
  return isAnchorLink(props.to)
}

export { Link }
export { isAnchorLink, isExternalLink, isInternalLink }
export type { AnchorLink, ExternalLink, InternalLink, ValidLink }
