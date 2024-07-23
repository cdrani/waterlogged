import { getContext, setContext } from 'svelte'

import LogStore from 'common/stores/log'
import ExtMessaging from 'common/stores/messaging/ext'

const STORE = 'log'

export function getLog() {
    return getContext(STORE)
}

export function initLog(port: chrome.runtime.Port) {
    const messaging = new ExtMessaging(port)
    setContext(STORE, new LogStore(messaging))
}
