import { setState, getState } from './utils/state'

let POPUP_PORT = null

function getDateKey() {
    return new Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'short'
    }).format(new Date())
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
            }
        } else if (type == 'set:settings') {
            await setState({ key: 'settings', values: data })
        } else if (type == 'get:today') {
            const dateKey = getDateKey()
            response = await getState([dateKey])
            if ((!response || !Object.keys(response).length) && data) {
                await setState({ key: dateKey, values: data })
                response = { [dateKey]: data }
            }
        } else if (type == 'set:today') {
            const dateKey = getDateKey()
            await setState({ key: dateKey, values: data })
        }

        response && port.postMessage({ type: `${type}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
