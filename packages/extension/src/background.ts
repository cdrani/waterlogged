import { db } from 'common/data/db'
import { sendMessage } from './utils/messages'
import Notification from './utils/notifications'
import { LogsService } from 'common/data/services'
import { ensureOffscreenDocument } from './utils/offscreen'
import { type Messaging, initMessageHandler } from 'common/messaging'

const Notifier = new Notification()
let keepAliveTimer: Timer | null = null

function keepAlive() {
    if (keepAliveTimer) return

    keepAliveTimer = setInterval(async () => {
        const message = { data: null, type: 'keepalive', target: 'offscreen' }
        await ensureOffscreenDocument()
        await sendMessage(message)
    }, 29_500)
}

keepAlive()

function setBadgeInfo(enabled = true) {
    chrome.action.setBadgeText({ text: enabled ? 'on' : 'off' })
    chrome.action.setBadgeTextColor({ color: 'white' })
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#22d3ee' : 'gray' })
}

chrome.runtime.onInstalled.addListener(async (details) => {
    const isOpen = db.isOpen()

    if (!isOpen) await db.open()

    if (details.reason == 'install') {
        setBadgeInfo(true)
        await Notifier.welcome()
    } else {
        const settings = await db.settings.toArray()[0]
        setBadgeInfo(settings?.enabled ?? true)
    }

    await Notifier.startTimer()
    keepAlive()
})

chrome.runtime.onStartup.addListener(keepAlive)
chrome.tabs.onActivated.addListener(keepAlive)
chrome.tabs.onUpdated.addListener(keepAlive)

chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
    sendResponse({ status: true })
    return true
})

async function onSettingsUpate({ previous, current }) {
    const hasSettingChanged = ['enabled', 'alert_type', 'interval', 'start_time', 'end_time']
        .some(key => previous?.[key] !== current?.[key])

    if (previous?.enabled !== current?.enabled) {
        setBadgeInfo(current.enabled)
    }

    hasSettingChanged && await Notifier.startTimer()
}

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    const messaging: Messaging = initMessageHandler({ port, callback: onSettingsUpate })
    LogsService.load().then(log => {
        messaging.postMessage({ type: `get:log:response`, response: { log } })
    })
})
