/// <reference types="vinxi/types/server" />

import { getRouterManifest } from '@tanstack/start/router-manifest'
import { createStartHandler, defaultStreamHandler } from '@tanstack/start/server'

import { parseEnv } from '~/libs/env'
import { createRouter } from '~/libs/router'

parseEnv()

export default createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler)
