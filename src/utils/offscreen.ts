const OFFSCREEN_FILE_PATH = 'src/offscreen.html'

let creating: Promise<void> | void | null

export async function ensureOffscreenDocument() {
    const filePath = chrome.runtime.getURL(OFFSCREEN_FILE_PATH)
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [filePath],
    })

    if (existingContexts?.length > 0) return

    if (creating) {
        await creating 
    } else {
        creating = await chrome.offscreen.createDocument({
            url: OFFSCREEN_FILE_PATH,
            reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
            justification: 'Play alarm sound to notify water break.'
        })

        creating = null
    }
}

export async function sendOffscreenMessage(sound: string) {
    return new Promise((resolve, reject) => {
        const message = { data: sound, type: 'alarm', target: 'offscreen'} 
        chrome.runtime.sendMessage(message, response => {
            if (chrome.runtime.lastError) return reject({ error: chrome.runtime.lastError })
            return resolve(response)
        })
    })
}
