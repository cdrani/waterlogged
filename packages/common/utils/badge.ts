// TODO: need something similar for web.
// Perhpas updating the favicon to reflect on/off state
export function setBadgeInfo(enabled = true) {
    if (typeof chrome == 'undefined' || !chrome?.action) return

    chrome.action.setBadgeText({ text: enabled ? 'on' : 'off' })
    chrome.action.setBadgeTextColor({ color: 'white' })
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#22d3ee' : 'gray' })
}
