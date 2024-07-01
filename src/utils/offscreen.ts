import { sendMessage } from './messages'

let creating: Promise<void> | void | null

const OFFSCREEN_FILE_PATH = 'src/offscreen.html'

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
        creating = chrome.offscreen.createDocument({
            url: OFFSCREEN_FILE_PATH,
            reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
            justification: 'Play alarm sound to notify water break.'
        })

        await creating
        creating = null
    }
}

export async function sendOffscreenMessage(sound: string) {
    const message = { data: sound, type: 'alarm', target: 'offscreen' }
    return await sendMessage(message)
}
