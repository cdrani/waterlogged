import type { SETTINGS, TODAY, ERROR_REASON, STORAGE_DATA, STATE_RESOLVER } from './types.d'

function handleRuntimeError(reject: (reason?: ERROR_REASON) => void) {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        reject({ error: chrome.runtime.lastError })
        return true
    }

    return false
}

export function stateResolver({ resolve, reject, result = null, values = null }: STATE_RESOLVER) {
    if (handleRuntimeError(reject)) return
    return resolve(values ?? result)
}

export function setState({ key, values }: { key: string, values: TODAY | SETTINGS }): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: values }, () =>
            stateResolver({ resolve, reject, values:  { [key]: values } as Partial<STORAGE_DATA> })
        )
    })
}

export function getState(keys: string | string[]): Promise<STORAGE_DATA> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => 
            stateResolver({ resolve, reject, result: result as STORAGE_DATA })
        )
    })
}
