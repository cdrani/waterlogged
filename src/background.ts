import { setState, getState } from './utils/state'

let POPUP_PORT = null

function getDateKey() {
    return new Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'short'
    }).format(new Date())
}

chrome.runtime.onInstalled.addListener(async () => {
    try {
        await setState({ 
            key: 'defaults', 
            values: {
                total: 0,
                goal: 1800,
                intake: 100,
                enabled: true,
                measurement: 'ml',
            }
        })

        const dateKey = getDateKey()
        await setState({ 
            key: dateKey, 
            values: {
                logs: [],
                goal: 1800,
                intake: 100,
                measurement: 'ml',
            }
        })
    } catch (e) {
        console.error(`Error Setting default key: `, e)
    }
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    POPUP_PORT = port

    POPUP_PORT.onMessage.addListener(async ({ key, data }) => {
        let response
        if (key == 'get:defaults') {
            response = await getState(['defaults'])
        } else if (key == 'set:total') {
            const { defaults } = await getState(['defaults'])
            await setState({ key: 'defaults', values: { ...defaults, total: data } })
        } else if (key == 'get:today') {
            const dateKey = getDateKey()
            response = await getState([dateKey])
            if (!response && data) {
                await setState({ key: dateKey, values: data })
                response = { [dateKey]: data }
            }
        } else if (key == 'set:today') {
            const dateKey = getDateKey()
            const logData = await getState([dateKey])
            await setState({ key: dateKey, values: {...Object.values(logData), ...data }})
        }

        response && port.postMessage({ key: `${key}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
