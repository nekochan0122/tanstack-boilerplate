/// <reference types="vinxi/types/server" />

import { getRouterManifest } from '@tanstack/start/router-manifest'
import { createStartHandler, defaultStreamHandler } from '@tanstack/start/server'

import { createRouter } from '~/router'
import { parseEnv } from '~/server/env'

parseEnv()

export default createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler)
