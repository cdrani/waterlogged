import { playAlarm } from 'common/utils/alarm'
import NotificationBase, { type Notification } from 'common/notification'

export default class WebNotification extends NotificationBase {
    protected async clearAlarms() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
    }

    protected setupAlarms(delay: number) {
        this.timeoutId = setTimeout(async () => {
            await this.getSettings()
            const { nowMS, startMS, endMS } = this.getTimeBoundaries()
            if (nowMS >= startMS && nowMS < endMS) await this.notifyAlert()
        }, delay)

        this.intervalId = setInterval(async () => {
            await this.getSettings()
            const { nowMS, startMS, endMS } = this.getTimeBoundaries()
            if (nowMS >= startMS && nowMS < endMS) await this.notifyAlert()
        }, (this?.settings?.interval ?? 60) * 60 * 1000)
    }

    protected async createNotification({ id, title, message }: Notification) {
        const showButton = title.includes('Time to Hydrate!')
        const notificationOptions = {
            body: message,
            data: { id },
            icon: 'favicon.png',
        }

        const notification = new Notification(title, notificationOptions)

        notification.onclick = async () => {
            const isHydrating = title.includes('Time to Hydrate!')
            if (isHydrating) {
                await this.logAmount()
            }
            notification.close()
        }

        if (showButton) {
            notification.addEventListener('show', () => {
                setTimeout(() => {
                    if (notification.data.id === 'progress') {
                        this.logAmount()
                        notification.close()
                    }
                }, 5000)
            })
        }
    }

    protected async playSound(sound: string) {
        await playAlarm(sound)
    }
}
