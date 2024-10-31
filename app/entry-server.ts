/// <reference types="vinxi/types/server" />

import '~/libs/env'

import { getRouterManifest } from '@tanstack/start/router-manifest'
import { createStartHandler, defaultStreamHandler } from '@tanstack/start/server'

import { createRouter } from '~/libs/router'

export default createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler)
