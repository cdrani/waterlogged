import { playAlarm } from 'common/utils/alarm'
import NotificationBase, { type Notification } from 'common/notification'

export default class WebNotification extends NotificationBase {
    private closeTimeout: Timer | null = null

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

    private clearTimer() {
        if (this.closeTimeout) clearTimeout(this.closeTimeout)
    }

    protected async createNotification({ id, title, message }: Notification) {
        const showButton = title.includes('Time to Hydrate!')
        const notificationOptions = {
            body: message,
            data: { id },
            icon: 'favicon.png',
            requireInteraction: showButton
        }

        const notification = new Notification(title, notificationOptions)
        this.closeTimeout = setTimeout(() => notification.close(), 10_000)

        if (!showButton) return

        notification.onclose = () => { this.clearTimer() }

        notification.onclick = async (event) => {
            event.preventDefault()
            await this.logAmount()
            notification.close()
        }
    }

    protected async playSound(sound: string) {
        await playAlarm(sound)
    }
}
