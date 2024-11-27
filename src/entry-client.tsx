/// <reference types="vinxi/types/client" />

import { StartClient } from '@tanstack/start'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { scan } from 'react-scan'

import { createRouter } from '~/router'

const router = createRouter()

window.getRouter = () => router
window.getQueryClient = () => router.options.context.queryClient

scan({
  enabled: import.meta.dev,
  log: true,
})

hydrateRoot(document, (
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>
))
