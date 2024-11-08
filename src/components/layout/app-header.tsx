import { useLocation } from '@tanstack/react-router'
import { Fragment } from 'react'
import { useTranslations } from 'use-intl'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { Link } from '~/components/ui/link'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import type { InternalLink } from '~/components/ui/link'
import type { TranslateKeys } from '~/libs/i18n'

export function AppHeader() {
  const t = useTranslations()

  const location = useLocation()

  const paths = location.pathname.split('/').filter(Boolean)

  return (
    <header className='flex h-16 shrink-0 items-center gap-2'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to='/'>
                  <BreadcrumbPage>
                    {t('navigation.home')}
                  </BreadcrumbPage>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {paths.length > 0 && <BreadcrumbSeparator />}

            {paths.map((path, idx) => {
              const isLast = idx === paths.length - 1
              const hasNext = idx + 1 < paths.length

              const key = `navigation.${path}` as TranslateKeys
              const name = t.has(key) ? t(key) : path
              const lnik = `/${path}` as InternalLink

              return (
                <Fragment key={path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        {name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={lnik} >
                          {name}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {hasNext && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
