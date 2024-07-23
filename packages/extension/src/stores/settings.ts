import { getContext, setContext } from 'svelte'
import SettingsStore from 'common/stores/settings'
import ExtMessaging from 'common/stores/messaging/ext'

const STORE = 'settings'

export function getSettings() {
    return getContext(STORE)
}

export function initSettings(port: chrome.runtime.Port) {
    const messaging = new ExtMessaging(port)
    setContext(STORE, new SettingsStore(messaging))
}
