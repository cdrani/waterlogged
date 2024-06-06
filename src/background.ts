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

    POPUP_PORT.onMessage.addListener(async (message) => {
        console.log('background: ', { message }) 
        // port.postMessage({ type: 'controls', data: { key: message.key, result } })
    })

    POPUP_PORT.onDisconnect.addListener(() => (POPUP_PORT = null))
})
