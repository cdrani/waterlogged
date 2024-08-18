/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />

import { NavigationRoute, registerRoute } from 'workbox-routing'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', async (event) => {
    const type = event?.data?.type
    if (type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV) allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('/logs'),
    { allowlist },
))
