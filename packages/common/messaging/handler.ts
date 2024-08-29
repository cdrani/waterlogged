import ExtMessaging from './ext'
import WebMessaging from './web'
import { type SETTINGS } from 'common/types'
import { setBadgeInfo } from 'common/utils/badge'
import { SettingsService } from 'common/data/services'
import type NotificationBase from 'common/notification'

type CallbackParams = { current: SETTINGS, previous: SETTINGS }

type Callback = (args: CallbackParams) => Promise<void>

type MessageHandler = {
    type: string,
    callback?: Callback,
    data: {key: string, value: string | number}
}

async function handleMessage({ type, data, callback }: MessageHandler) {
    if (type === 'set:settings') {
        const previous = await SettingsService.load()
        const current = await SettingsService.updateKeyValue(data as any)
        if (callback) await callback({ previous, current })
    }
}

async function messageCallback(
    { previous, current }: CallbackParams,
    notificationManager?: NotificationBase
) {
    const restart = ['enabled', 'alert_type', 'interval', 'start_time', 'end_time']
        .some(key => previous?.[key] !== current?.[key])

    if (previous?.enabled !== current?.enabled) setBadgeInfo(current.enabled)

    restart && await notificationManager?.startTimer()
}

type InitMessage = {
    port?: chrome.runtime.Port,
    notificationManager?: NotificationBase
} | undefined

export function initMessageHandler(params?: InitMessage) {
    const { port, notificationManager } = params || {}
    const messaging = port ? new ExtMessaging(port) : new WebMessaging()
    const callback = (args: CallbackParams) => messageCallback(args, notificationManager)
    messaging.onMessage(({ type, data }) => handleMessage({ type, data, callback }))
    return messaging
}
