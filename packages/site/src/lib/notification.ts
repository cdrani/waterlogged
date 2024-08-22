import { playAlarm } from 'common/utils/alarm'
import { UserService } from 'common/data/services'
import { sendNotification } from '$lib/firebase/messaging'
import NotificationBase, { type Notification } from 'common/notification'

export default class WebNotification extends NotificationBase {
    protected isPWA() {
        return window?.matchMedia('(display-mode: standalone)').matches
    }

    protected async clearAlarms() {
        if (this.intervalId) clearInterval(this.intervalId)
        if (this.timeoutId) clearTimeout(this.timeoutId)
    }

    protected setupAlarms(delay: number) {
        const checkAndNotify = async () => {
            await this.getSettings()
            const { nowMS, startMS, endMS } = this.getTimeBoundaries()
            if (nowMS >= startMS && nowMS < endMS) await this.notifyAlert()
        }

        const interval = (this?.settings?.interval ?? 60) * 60 * 1000

        this.timeoutId = setTimeout(checkAndNotify, delay)
        this.intervalId = setInterval(checkAndNotify, interval)
    }

    protected async createNotification({ id, title, message }: Notification) {
        if (!('serviceWorker' in navigator && navigator.serviceWorker.controller)) {
            console.error('Service worker not found or not controlling the page')
            return
        } 

        // Send a message to the service worker to display the notification
        const showButton = title.includes('Time to Hydrate!')

        const notificationOptions = {
            body: message,
            data: { id },
            icon: 'favicon.png',
            requireInteraction: showButton,
            tag: 'hydration-time'
        }

        const token = await UserService.getToken()
        await sendNotification({ title, token, notificationOptions })

        // if (this.isPWA()) {
        //    console.log('isPWA') 
        // } else {
        //     navigator.serviceWorker.controller.postMessage({
        //         type: 'SHOW_NOTIFICATION',
        //         title,
        //         notificationOptions,
        //     })
        // }

        // const notification = new Notification(title, notificationOptions)
        // this.closeTimeout = setTimeout(() => notification.close(), 10_000)

        // if (!showButton) return

        // notification.onclose = () => { this.clearTimer() }

        // notification.onclick = async (event) => {
        //     event.preventDefault()
        //     await this.logAmount()
        //     notification.close()
        // }
    }

    protected async playSound(sound: string) {
        await playAlarm(sound)
    }
}
