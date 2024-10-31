/// <reference types="vinxi/types/client" />

import { StartClient } from '@tanstack/start'
import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { createRouter } from '~/libs/router'

const router = createRouter()

hydrateRoot(window.root, createElement(StartClient, { router }))
