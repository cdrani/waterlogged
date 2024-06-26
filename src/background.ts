import { getDateKey } from './utils/date'
import { setState, getState } from './utils/state'
import Notification from './utils/notifications'
import { SETTINGS_DEFAULT, TODAY_DEFAULT } from './utils/defaults'

import type { SETTINGS, TODAY, STORAGE_RESPONSE, TODAY_RESPONSE } from './utils/types.d'

const Notifier = new Notification()
let POPUP_PORT: chrome.runtime.Port | null = null

type MergeableObject = TODAY | SETTINGS
function mergeObjects(base: MergeableObject, other: Partial<MergeableObject>): MergeableObject {
    for (const key in other) {
        if (base.hasOwnProperty(key) && other[key] !== undefined) {
            base[key] = other[key]
        }
    }
    return base
}

chrome.runtime.onInstalled.addListener(async () => {
    await setState({ key: 'settings',  values: SETTINGS_DEFAULT })
    await setState({ key: 'today', values: TODAY_DEFAULT })

    Notifier.welcome()
    await Notifier.startTimer()
})

chrome.storage.onChanged.addListener(changes => {
    const settingsChanged = changes.hasOwnProperty('settings')
    if (!settingsChanged) return

    const { oldValue, newValue } = changes.settings
    const hasSettingChanged = ['enabled', 'alert_type', 'interval', 'start_time', 'end_time']
        .some(key => oldValue?.[key] !== newValue?.[key])

    hasSettingChanged && Notifier.startTimer()
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    POPUP_PORT = port

    POPUP_PORT.onMessage.addListener(async ({ type, data = null }) => {
        let response: STORAGE_RESPONSE = null

        if (type == 'get:settings') {
            response = await getState('settings')
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
                response = { [dateKey]: mergedData } as TODAY_RESPONSE
            } else {
                const mergedData = mergeObjects(data, stateData?.settings ?? {})
                await setState({ key: dateKey, values: mergedData })
                response = { [dateKey]: mergedData } as TODAY_RESPONSE
            }
        } else if (type == 'set:today') {
            const dateKey = getDateKey()
            await setState({ key: dateKey, values: data })
        }

        response && port.postMessage({ type: `${type}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
