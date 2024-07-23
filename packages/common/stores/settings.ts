import { writable, get, type Writable } from 'svelte/store'

import type { Messaging } from './messaging/type'
import type { SETTINGS } from "common/types/index.d"

export default class SettingsStore {
    private messaging: Messaging
    public settings: Writable<SETTINGS>

    constructor(messaging: Messaging) {
        this.messaging = messaging
        this.settings = writable<SETTINGS>()

        this.init()
    }

    private init() {
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
