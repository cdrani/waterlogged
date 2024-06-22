import { setState, getState } from './utils/state'
import Notification from './utils/notifications'

let POPUP_PORT = null

function getDateKey() {
    return new Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'short'
    }).format(new Date())
}

function mergeObjects(base, other) {
    for (const key in other) {
        if (base.hasOwnProperty(key) && other[key] !== undefined) {
            base[key] = other[key]
        }
    }
    return base
}

const Notifier = new Notification()

chrome.runtime.onInstalled.addListener(async () => {
    await setState({ 
        key: 'settings', 
        values: {
            goal: 1800,
            amount: 250,
            interval: 60, // minutes
            enabled: true,
            sound: 'bubble1',
            measurement: 'ml',
            end_time: '18:00',
            alert_type: 'both',
            start_time: '08:00',
        }
    })

    await setState({ 
        key: 'today', 
        values: {
            logs: [],
            goal: 1800,
            amount: 250,
            measurement: 'ml'
        }
    })

    // Notifier.welcome()
    await Notifier.startTimer()
})

chrome.storage.onChanged.addListener(async (changes) => {
    const isSettings = Object.keys(changes)?.at(0) == 'settings'
    if (!isSettings) return

    const { oldValue, newValue } = changes.settings

    const enabledChanged = oldValue?.enabled !== newValue?.enabled
    const alertChanged = oldValue?.alert_type !== newValue?.alert_type

    if (enabledChanged || alertChanged) {
        newValue?.enabled && newValue?.alert_type !== 'none' ? Notifier.startTimer() : Notifier.clearTimer()
    }
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    POPUP_PORT = port

    POPUP_PORT.onMessage.addListener(async ({ type, data = null }) => {
        let response
        if (type == 'get:settings') {
            response = await getState(['settings'])
            if ((!response || !Object.keys(response).length) && data) {
                await setState({ key: 'settings', values: data })
                response = { settings: data }
            }
        } else if (type == 'set:settings') {
            await setState({ key: 'settings', values: data })
            response = { settings: data }
        } else if (type == 'get:today') {
            const dateKey = getDateKey()
            const stateData = await getState([dateKey, 'settings'])
            if (stateData?.settings && stateData?.[dateKey]) {
                const mergedData = mergeObjects(stateData[dateKey], stateData.settings)
                response = { [dateKey]: mergedData }
            } else {
                const mergedData = mergeObjects(data, stateData?.settings ?? {})
                await setState({ key: dateKey, values: mergedData })
                response = { [dateKey]: mergedData }
            }
        } else if (type == 'set:today') {
            const dateKey = getDateKey()
            await setState({ key: dateKey, values: data })
        }

        response && port.postMessage({ type: `${type}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
