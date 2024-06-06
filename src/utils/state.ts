export function stateResolver({ resolve, reject, result, key, values }) {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        return reject({ error: chrome.runtime.lastError })
    }

    if (key) return resolve(result?.[key])
    if (values) return resolve(values)

    return resolve(result)
}

export function setState({ key, values }) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: values }, (result) =>
            stateResolver({ resolve, reject, result, values })
        )
    })
}

export function getState(key: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => stateResolver({ key, resolve, reject, result }))
    })
}

export function removeState(key: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, (result) =>
            stateResolver({ key, resolve, reject, result })
        )
    })
}
