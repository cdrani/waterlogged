type NotificationType = 'install' | 'notify'

import { getState } from './state'

export default class Notification {
    constructor() {
        this._timer = null
    }

    async startTimer() {
        let iteration = 0

        this._timer = setInterval(async () => {
            const { settings } = await getState(['settings'])
            if (!settings) return
            const { enabled, sound, start_time, end_time, interval, alert_type } = settings

            if (!enabled || alert_type == 'none') return this.clearTimer()
            if (!this.checkWithinBoundary({ start_time, end_time })) return
            iteration++

            if (iteration >= Number(interval)) {
                this.notify()
                iteration = 0
            }
        }, 60_000)
    }

    checkWithinBoundary({ start_time, end_time }) {
        const now = (new Date()).getTime()
        const startMS = this.getDateMS(start_time)
        const endMS = this.getDateMS(end_time)
        const withinBoundary = (startMS <= now && now < endMS)
        return withinBoundary
    }

    getDateMS(timeStr) {
        const [hour, min] = timeStr.split(':')
        const date = new Date()
        date.setHours(Number(hour))
        date.setMinutes(Number(min))
        return date.getTime()
    }

    clearTimer() {
        if (this._timer) clearInterval(this._timer)
        this._timer = null
    }

    welcome() {
        this.create('install')
    }

    notify() {
        this.create('notify')
    }

    create(type: NotificationType) {
        const title = type == 'install' ? 'Welcome!' : 'Water Break Time!'
        const message = type == 'install' 
            ? 'Your journey to a well-hydrated future starts now!' 
            : 'Glug glug glug! Time to hydrate.'

        chrome.notifications.create({
            title,
            message,
            type: 'basic',
            iconUrl: chrome.runtime.getURL("src/icons/icon48.png")
        })
    }
}
