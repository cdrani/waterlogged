import { app } from '$lib/firebase/app'
import { 
    getToken as fcmGetToken,
    onMessage as fcmOnMessage,
    getMessaging,
    type MessagePayload,
    type Messaging,
    type NextFn,
    type Observer,
    type Unsubscribe,
} from 'firebase/messaging'
import { 
    getMessaging as getMessagingSW,
    onBackgroundMessage as fcmOnBackgroundMessage
} from 'firebase/messaging/sw'

export { isSupported } from 'firebase/messaging'

export async function messaging(): Promise<Messaging> {
    return getMessaging(app)
}

export async function messagingSW(): Promise<Messaging> {
    return getMessagingSW(app)
}

export async function onMessage(
    handler: NextFn<MessagePayload> | Observer<MessagePayload>
): Promise<Unsubscribe> {
    return fcmOnMessage(await messaging(), handler)
}

export async function onBackgroundMessage(
    handler: NextFn<MessagePayload> | Observer<MessagePayload>
): Promise<Unsubscribe> {
    const messaging = getMessagingSW(app)
    return fcmOnBackgroundMessage(messaging, handler)
}

export async function getToken(
    serviceWorkerRegistration?: ServiceWorkerRegistration
): Promise<string> {
    return fcmGetToken(await messaging(), {
        vapidKey: import.meta.env.VITE_FB_VAPID_KEY,
        serviceWorkerRegistration
    })
}


export function getNotificationOptions(data: any): NotificationOptions {
    const options = {} as Record<string, string>
    Object.keys(data).forEach(key => {
        if (!['title', 'link', 'requireInteraction'].includes(key)) options[key] = data[key]
    })

    return options
}

export async function sendNotification(data) {
    try {
        const url = '/api/notify'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.status !==  200) {
            throw new Error(
                ((await response.json()) as { message: string })?.message ||
                "Failed to send notification.",
            )
        }

        const respJSON =  await response.json()
        return respJSON
    } catch (error) {
        console.error('Send Notification Error: ', error)
    }
}
