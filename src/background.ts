import { setState, getState } from './utils/state'

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
