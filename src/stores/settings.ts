import { writable, get } from "svelte/store"

type Alert = 'notification' | 'alarm' | 'both'

type Settings = {
    goal: number,
    intake: number,
    enabled: boolean,
    interval: number,
    end_time: string,
    start_time: string,
    measurement: string,
    alert_type: Alert
}

const defaultSettings = {
    goal: 1800,
    intake: 100,
    interval: 60, // minutes
    enabled: true,
    measurement: 'ml',
    end_time: '08:00',
    start_time: '18:00',
    alert_type: 'notification'
}

export default class SettingsStore {
    constructor(port) {
        this._PORT = port
        this._settings = writable<Settings>(defaultSettings)

        this.#init()
        this.#populate()
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ type, response }) => {
            if (type == 'get:settings:response') {
                const data = response.settings
                this.#updateDefaults(data)
            }
        })
    }

    #populate() {
        this._PORT?.postMessage({ type: 'get:settings', data: get(this._settings) })
    }

    #updateDefaults(data: Settings) {
        this._settings.set(data)
    }

    updateSetting({ key, value }) {
        this._settings.update(previous => ({ ...previous, [key]: value }))
        const settings = get(this._settings)
        this._PORT?.postMessage({ type: 'set:settings', data: settings })
    }

    disconnect() {
        this._PORT.onDisconnect.addListener(() => (this._PORT = null))
    }
}
