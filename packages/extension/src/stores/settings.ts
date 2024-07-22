import { writable, get } from "svelte/store"
import type { Writable } from "svelte/store"
import { getContext, setContext } from 'svelte'

import type TodayStore from "./today"
import type { SETTINGS } from "common/types/index.d"

export default class SettingsStore {
    _PORT: chrome.runtime.Port
    _observer: TodayStore
    _settings: Writable<SETTINGS>

    constructor(port: chrome.runtime.Port) {
        this._PORT = port
        this._settings = writable<SETTINGS>()

        this.#init()
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ type, response }) => {
            if (type == 'get:settings:response') {
                const data = response.settings
                this.#updateDefaults(data)
            }
        })
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
    }
}

const STORE = 'settings'

export function initSettings(port: chrome.runtime.Port) {
    setContext(STORE, new SettingsStore(port))
}

export function getSettings() {
    return getContext(STORE)
}
