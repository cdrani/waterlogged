
function getSource(sound: string) {
    const isExt = typeof chrome !== 'undefined' && chrome.runtime
    return isExt 
        ? chrome.runtime.getURL(`sounds/${sound}.mp3`)
        : `/sounds/${sound}.mp3`
}

export async function playAlarm(sound: string) {
    const source = getSource(sound)
    const audio = new Audio(source)
    await audio.play()
}
