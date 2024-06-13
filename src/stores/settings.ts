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

const defaultSettings: Settings = {
    goal: 1800,
    intake: 100,
    interval: 60, // minutes
    enabled: true,
    measurement: 'ml',
    end_time: '18:00',
    start_time: '08:00',
    alert_type: 'notification'
}

export default class SettingsStore {
    constructor(port, observer) {
        this._PORT = port
        this._observer = observer
        this._settings = writable<Settings>(defaultSettings)

        this.#init()
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ type, response }) => {
            if (type == 'get:settings:response') {
                const data = response.settings
                this.#updateDefaults(data)
                this.#notifyObserver(data)
            }
        })
    }

    #notifyObserver(data) {
        this._observer.syncWithSettings(data)
    }

    get settings() {
        return this._settings
    }

    populate() {
        this._PORT?.postMessage({ type: 'get:settings', data: get(this._settings) })
    }

    #updateDefaults(data: Settings) {
        this._settings.set(data)
    }

    updateSetting({ key, value }) {
        this._settings.update(previous => ({ ...previous, [key]: value }))
        const settings = get(this._settings)
        this._PORT?.postMessage({ type: 'set:settings', data: settings })
        this.#notifyObserver(settings)
    }

    disconnect() {
        // this._PORT.onDisconnect.addListener(() => (this._PORT = null))
    }
}
