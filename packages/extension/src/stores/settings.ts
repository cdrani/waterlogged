import { writable, get } from "svelte/store"
import type { Writable } from "svelte/store"
import { getContext, setContext } from 'svelte'

import type TodayStore from "./today"
import type { SETTINGS } from "common/types/index.d"

type SettingsStoreParams = { port: chrome.runtime.Port, observer: TodayStore }

export default class SettingsStore {
    _PORT: chrome.runtime.Port
    _observer: TodayStore
    _settings: Writable<SETTINGS>

    constructor({ port , observer }: SettingsStoreParams) {
        this._PORT = port
        this._observer = observer
        this._settings = writable<SETTINGS>()

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

    #notifyObserver(data: SETTINGS) {
        // this._observer.syncWithSettings(data)
    }

    get settings() {
        return this._settings
    }

    populate() {
        this._PORT?.postMessage({ type: 'get:settings', data: get(this._settings) })
    }

    #updateDefaults(data: SETTINGS) {
        this._settings.set(data)
    }

    updateSetting({ key, value }) {
        this._settings.update(previous => ({ ...previous, [key]: value }))
        const settings = get(this._settings)
        this._PORT?.postMessage({ type: 'set:settings', data: settings })
        this.#notifyObserver(settings)
    }
}

const STORE = 'settings'

export function initSettings({ port, observer }) {
    setContext(STORE, new SettingsStore({ port, observer }))
}

export function getSettings() {
    return getContext(STORE)
}
