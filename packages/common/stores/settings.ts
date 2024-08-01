import { getContext, setContext } from 'svelte'
import { writable, get, type Writable } from 'svelte/store'

import type { SETTINGS } from 'common/types/index.d'
import { type Messaging, ExtMessaging, WebMessaging } from 'common/messaging'
import { SettingsService } from 'common/data/services'


export class SettingsStore {
    private messaging: Messaging
    public settings: Writable<SETTINGS>

    constructor(messaging: Messaging) {
        this.messaging = messaging
        this.settings = writable<SETTINGS>()

        this.init()
    }

    private async init() {
        const settings = await SettingsService.load()
        this.updateDefaults(settings)

        this.messaging.onMessage(({ type, response }) => {
            if (type == 'get:settings:response') {
                const data = response.settings
                this.updateDefaults(data)
            }
        })
    }

    get data() {
        return this.settings
    }

    populate() {
        this.messaging.postMessage({ type: 'get:settings', data: get(this.settings) })
    }

    private updateDefaults(data: SETTINGS) {
        this.settings.set(data)
    }

    updateSetting({ key, value }) {
        this.settings.update(previous => ({ ...previous, [key]: value }))
        const settings = get(this.settings)
        this.messaging.postMessage({ type: 'set:settings', data: settings })
    }
}


const STORE = 'settings'

export function getSettings() {
    return getContext(STORE)
}

export function initSettings(port?: chrome.runtime.Port) {
    const messaging = port ? new ExtMessaging(port) : new WebMessaging()
    setContext(STORE, new SettingsStore(messaging))
}
