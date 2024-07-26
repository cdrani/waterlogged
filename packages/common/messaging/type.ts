export interface Messaging {
    onMessage(listener: (message: any) => void): void;
    postMessage(message: any): void;
}
