import { setState, getState } from './utils/state'

let POPUP_PORT = null

chrome.runtime.onInstalled.addListener(async () => {
    try {
        await setState({ 
            key: 'defaults', 
            values: {
                total: 0,
                intake: 100,
                enabled: true,
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
            console.log({ defaults, data })
            await setState({ key: 'defaults', values: { ...defaults, total: data } })
        }

        response && port.postMessage({ key: `${key}:response`, response })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
