import { Messaging } from './type'

export default class WebMessaging implements Messaging {
    private eventTarget: EventTarget
    private listeners: Array<(message: any) => void> = []

    constructor() {
        this.eventTarget = new EventTarget()
    }

    onMessage(listener: (message: any) => void): void {
        this.listeners.push(listener)
        const eventListener = (event: Event) => {
            if (event instanceof CustomEvent) {
                listener(event.detail)
            }
        }

        this.eventTarget.addEventListener('message', eventListener)
    }

    postMessage(message: any): void {
        const event = new CustomEvent('message', { detail: { message }})
        this.eventTarget.dispatchEvent(event)
    }
}
