export function stateResolver({ resolve, reject, result = null, values = null }) {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        return reject({ error: chrome.runtime.lastError })
    }

    if (values) return resolve(values)

    return resolve(result)
}

export function setState({ key, values }) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: values }, () =>
            stateResolver({ resolve, reject, values })
        )
    })
}

export function getState(keys: string[]) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => 
            stateResolver({ resolve, reject, result })
        )
    })
}
