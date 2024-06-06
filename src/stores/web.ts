function sendBackgroundMessage(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) return reject({ error: chrome.runtime.lastError })
            return resolve(response)
        })
    })
}

export const getKey = async (key: string) => {
    const response = await sendBackgroundMessage(key)
    console.log({ response })
}

export const getKeys = async (keys: string[]) => {
    // const response = await sendBackgroundMessage(key)
    // console.log({ response })
    return await chrome.storage.local.get(keys)
}
