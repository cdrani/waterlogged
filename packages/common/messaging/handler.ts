import { db } from 'common/data/db'
import ExtMessaging from './ext'
import WebMessaging from './web'
import type { Messaging } from './type'
import type { LOG, SETTINGS, STORAGE_RESPONSE } from 'common/types'
import { SettingsService, LogsService } from 'common/data/services'

type Callback = (args: any) => Promise<void>

type MessageHandler = {
    type: string,
    callback: Callback
    messaging: Messaging,
    data: SETTINGS | LOG | null,
}
async function handleMessage({ type, data, messaging, callback }: MessageHandler) {
    let response: STORAGE_RESPONSE = null

    if (type === 'get:settings') {
        const settings = await SettingsService.load()
        response = { settings }
    } else if (type === 'set:settings') {
        const previous = await SettingsService.load()
        const current = await SettingsService.update(data as SETTINGS)
        if (callback) await callback({ previous, current })

        response = { settings: data as SETTINGS }
    } else if (type === 'get:log') {
        const log = await LogsService.load()
        response = { log }
    } else if (type === 'set:log') {
        await db.logs.put(data as LOG)
    }

    if (response) {
        messaging.postMessage({ type: `${type}:response`, response })
    }
}

type InitMessage = {
    callback?: Callback
    port?: chrome.runtime.Port
}

export function initMessageHandler({ port, callback }: InitMessage) {
    const messaging = port ? new ExtMessaging(port) : new WebMessaging()
    messaging.onMessage(({ type, data }) => { handleMessage({ type, data, messaging, callback }) })
    return messaging
}