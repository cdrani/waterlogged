/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />

import { LogsService } from 'common/data/services'
import { type MessagePayload } from 'firebase/messaging'
import { getNotificationOptions, onBackgroundMessage } from './lib/firebase/messaging'

import { NavigationRoute, registerRoute } from 'workbox-routing'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', async (event) => {
    const type = event?.data?.type
    if (type === 'SKIP_WAITING') self.skipWaiting()

    // if (type == 'SHOW_NOTIFICATION') {
    //     const { title, notificationOptions } = event.data
    //     self.registration.showNotification(title, notificationOptions)
    // }
})

self.addEventListener('notificationclick', async event => {
    await LogsService.addLogIntake()
    event.notification.close()
})

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

onBackgroundMessage(payload => {
    const { data } = payload as MessagePayload
    const notificationOptions = getNotificationOptions(data) as NotificationOptions
    return self.registration.showNotification(data!.title, notificationOptions)
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
