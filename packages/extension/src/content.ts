let audioContext: AudioContext | null = null

export async function playSound(sound: string) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const response = await fetch(chrome.runtime.getURL(`sounds/${sound}.mp3`))
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start()
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === 'playSound') playSound(message.sound)
    sendResponse({ status: true })
    return true
})
