/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />

import { LogsService } from 'common/data/services'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { getEncouragingMessage } from 'common/utils/encouragements'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV) allowlist = [/^\/$/]

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('/'),
    { allowlist },
))

// clean old assets
cleanupOutdatedCaches()

self.addEventListener('message', event => {
    const type = event?.data?.type
    if (type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('notificationclick', async event => {
    await LogsService.addLogIntake()
    event.notification.close()
})

type Notify = { title: string, options: NotificationOptions }

async function registerNotification(): Promise<Notify | undefined> {
    const progress = await getProgress()
    if (!progress) return
    const { id, body, title } = await notifyProgress(progress)
    const options = {
        body,
        data: { id },
        icon: 'favicon.png',
        tag: 'hydration-time',
        requireInteraction: true,
    }

    return { title, options }
}

self.addEventListener('push', async event => {
    const data = await registerNotification()
    if (!data) return
    return event.waitUntil(self.registration.showNotification(data.title, data.options))
})

async function getProgress() {
    const log = await LogsService.load()
    if (!log) return

    const percentage = Math.round((log.total / log.goal) * 100)
    return { goal: log.goal, left: Math.max(log.goal - log.total, 0), percentage }
}

type Progress = { goal: number, left: number, percentage: number }

async function notifyProgress(progress: Progress) {
    const { left, percentage, goal } = progress
    const encouragement = getEncouragingMessage(percentage)

    const detail = percentage >= 100
        ? `${percentage}%. ${goal} ml reached!`
        : `${percentage}% there. Only ${left}ml to reach goal.`

    return {
        id: 'progress',
        title: 'Water Break Time! Time to Hydrate!',
        body: `${encouragement} ${detail}`,
    }
}
