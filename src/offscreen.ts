import { playAlarm } from "./utils/alarm"

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    playAlarm(message.data)
    sendResponse({ status: true })
    return true
})
