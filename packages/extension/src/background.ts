import { db } from 'common/stores/db'
import { getDateKey } from 'common/utils/date'
import { sendMessage } from './utils/messages'
import Notification from './utils/notifications'
import type { SETTINGS, STORAGE_RESPONSE } from 'common/types'
import { createDailyLog } from 'common/stores/defaults'
import { ensureOffscreenDocument } from './utils/offscreen'

const Notifier = new Notification()
let keepAliveTimer: Timer | null = null
let POPUP_PORT: chrome.runtime.Port | null = null

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

async function ensureDailyLog(settingsData?: SETTINGS) {
    const dateKey = getDateKey()

    let log = await db.logs.get({ date_id: dateKey }) 

    if (!log) {
        const settings = settingsData ?? await db.settings.toArray()[0]
        console.log({ settingsData, settings })
        const newLog = createDailyLog(settings)
        log = await db.logs.add(newLog)
    }

    return log
}

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    POPUP_PORT = port

    await ensureDailyLog()

    POPUP_PORT.onMessage.addListener(async ({ type, data = null }) => {
        let response: STORAGE_RESPONSE = null
        const dateKey = getDateKey()

        if (type == 'get:settings') {
            const settings = await db.settings.toArray()
            response = { settings: settings?.length ? settings[0] : data }
            if (!settings.length && data) await db.settings.add(data)
        } else if (type == 'set:settings') {
            const log = await ensureDailyLog(data)
            log.amount = data.amount
            log.goal = data.goal
            log.measurement = data.measurement
            
            await db.logs.put(log)

            const previous = await db.settings.toArray()[0]
            await db.settings.put(data)
            await onSettingsUpate({ previous, current: data })

            response = { settings: data }
        } else if (type == 'get:today') {
            let log = await db.logs.get({ date_id: dateKey })
            if (!log) {
                const settings = await db.settings.toArray()[0]
                if (!settings) return

                log = createDailyLog(settings)
                await db.logs.add(log)
            }

            response = { log }
        } else if (type == 'set:today') {
            await db.logs.put(data)
        }

        response && POPUP_PORT?.postMessage({ type: `${type}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
