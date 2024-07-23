import { Messaging } from './type'

export default class WebMessaging implements Messaging {
    private listeners: Array<(message: any) => void> = []

    onMessage(listener: (message: any) => void): void {
        this.listeners.push(listener)
    }

    postMessage(message: any): void {
        // For example, use a custom event or any other mechanism to send messages
        this.listeners.forEach(listener => listener(message))
    }
}
