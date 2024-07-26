import { Messaging } from './type'

export default class ExtMessaging implements Messaging {
    private port: chrome.runtime.Port

    constructor(port: chrome.runtime.Port) {
        this.port = port
    }

    onMessage(listener: (message: any) => void): void {
        this.port.onMessage.addListener(listener)
    }

    postMessage(message: any): void {
        this.port.postMessage(message)
    }
}
