import { getDateKey } from './utils/date'
import { sendMessage } from './utils/messages'
import Notification from './utils/notifications'
import { setState, getState } from './utils/state'
import { mergeObjects } from './utils/merge-objects'
import { ensureOffscreenDocument } from './utils/offscreen'
import { SETTINGS_DEFAULT, TODAY_DEFAULT } from './utils/defaults'
import type { STORAGE_RESPONSE, TODAY_RESPONSE } from './utils/types.d'

let keepAliveTimer: Timer
const Notifier = new Notification()
let POPUP_PORT: chrome.runtime.Port | null = null

function keepAlive() {
    if (keepAliveTimer) return

    keepAliveTimer = setInterval(async () => {
        const message = { data: null, type: 'keepalive', target: 'offscreen' }
        await ensureOffscreenDocument()
        await sendMessage(message)
    }, 25_000)
}

function setBadgeInfo(enabled = true) {
    chrome.action.setBadgeText({ text: enabled ? 'on' : 'off' })
    chrome.action.setBadgeTextColor({ color: 'white' })
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#22d3ee' : 'gray' })
}

chrome.runtime.onInstalled.addListener(async () => {
    await setState({ key: 'settings',  values: SETTINGS_DEFAULT })
    await setState({ key: 'today', values: TODAY_DEFAULT })

    setBadgeInfo(true)
    Notifier.welcome()
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

chrome.storage.onChanged.addListener(async changes => {
    const settingsChanged = changes.hasOwnProperty('settings')
    if (!settingsChanged) return

    const { oldValue, newValue } = changes.settings
    const hasSettingChanged = ['enabled', 'alert_type', 'interval', 'start_time', 'end_time']
        .some(key => oldValue?.[key] !== newValue?.[key])

    if (oldValue.enabled !== newValue.enabled) {
        setBadgeInfo(newValue.enabled)
    }

    hasSettingChanged && await Notifier.startTimer()
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    POPUP_PORT = port

    POPUP_PORT.onMessage.addListener(async ({ type, data = null }) => {
        let response: STORAGE_RESPONSE = null

        const dateKey = getDateKey()
        if (type == 'get:settings') {
            response = await getState('settings')
            if ((!response || !Object.keys(response).length) && data) {
                await setState({ key: 'settings', values: data })
                response = { settings: data }
            }
        } else if (type == 'set:settings') {
            const todayState = await getState([dateKey, 'today'])
            await setState({ key: 'settings', values: data })
            const syncedTodayWithSettings = mergeObjects(todayState.today, data)
            await setState({ key: 'today', values: syncedTodayWithSettings })

            if (todayState[dateKey]) {
                const syncedDateKeyWithSettings = mergeObjects(todayState.today, data)
                await setState({ key: dateKey, values: syncedDateKeyWithSettings })
            }

            response = { settings: data }
        } else if (type == 'get:today') {
            const stateData = await getState([dateKey, 'settings'])
            if (stateData?.settings && stateData?.[dateKey]) {
                const mergedData = mergeObjects(stateData[dateKey], stateData.settings)
                response = { [dateKey]: mergedData } as TODAY_RESPONSE
            } else {
                const mergedData = mergeObjects(data, stateData?.settings ?? {})
                await setState({ key: dateKey, values: mergedData })
                response = { [dateKey]: mergedData } as TODAY_RESPONSE
            }
        } else if (type == 'set:today') {
            await setState({ key: dateKey, values: data })
        }

        response && POPUP_PORT?.postMessage({ type: `${type}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
