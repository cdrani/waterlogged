import { playAlarm } from 'common/utils/alarm'

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type == 'alarm') playAlarm(message.data)

    sendResponse({ status: true })
    return true
})
