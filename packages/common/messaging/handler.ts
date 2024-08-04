import ExtMessaging from './ext'
import WebMessaging from './web'
import type { LOG } from 'common/types'
import { SettingsService } from 'common/data/services'

type Callback = (args: any) => Promise<void>

type MessageHandler = {
    type: string,
    callback?: Callback,
    data: {key: string, value: string | number} | LOG | null,
}

async function handleMessage({ type, data, callback }: MessageHandler) {
    if (type === 'set:settings') {
        const previous = await SettingsService.load()
        const current = await SettingsService.updateKeyValue(data as any)
        if (callback) await callback({ previous, current })
    }
}

type InitMessage = {
    callback?: Callback,
    port?: chrome.runtime.Port
} | undefined

export function initMessageHandler(params: InitMessage = undefined) {
    const messaging = params?.port ? new ExtMessaging(params.port) : new WebMessaging()
    messaging.onMessage(({ type, data }) => {
        handleMessage({ type, data, callback: params?.callback })
    })
    return messaging
}
