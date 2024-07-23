export function playAlarm(sound: string) {
    const source = chrome.runtime.getURL(`sounds/${sound}.mp3`)
    const audio = new Audio(source)
    audio.play()
}
