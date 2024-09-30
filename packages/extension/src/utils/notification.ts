import NotificationBase from 'common/notification'

const INITIAL_ALARM = 'initialAlarm'
const INTERVAL_ALARM = 'intervalAlarm'

class ExtensionNotification extends NotificationBase {
    protected async clearAlarms() {
        await chrome.alarms.clearAll()
    }

    protected setupAlarms(delay: number) {
        chrome.alarms.create(INITIAL_ALARM, { delayInMinutes: delay / 60_000, periodInMinutes: 1440 })

        chrome.alarms.create(INTERVAL_ALARM, {
            periodInMinutes: this.settings.interval,
            when: Date.now() + this.settings.interval * 60 * 1000,
        })
    }

    public async handleAlarm(alarm: chrome.alarms.Alarm) {
        if (![INITIAL_ALARM, INTERVAL_ALARM].includes(alarm.name)) return

        await this.getSettings()
        const { nowMS, startMS, endMS } = this.getTimeBoundaries()
        if (nowMS >= startMS && nowMS < endMS) await this.notifyAlert()
    }

    protected async createNotification({ id, title, message }: { id: string, title: string, message: string }) {
        const showButton = title.includes('Time to Hydrate!')
        chrome.notifications.clear(id)
        chrome.notifications.create(id, {
            title,
            message,
            type: 'basic',
            priority: 2,
            iconUrl: chrome.runtime.getURL("src/icons/icon48.png"),
            buttons: showButton ? [{ title: `Log ${this.settings.amount}ml` }] : []
        })

        chrome.notifications.onButtonClicked.addListener(async (id, btnIdx) => {
            const isHydrating = title.includes('Time to Hydrate!')
            if (!isHydrating || btnIdx !== 0) return

            await this.logAmount()
            chrome.notifications.clear(id)
        })

        chrome.notifications.onClicked.addListener(chrome.notifications.clear)
    }

    protected async playSound(sound: string) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) return
            
            chrome.tabs.sendMessage(tabs[0].id, { type: 'playSound', sound })
        })
    }
}

export const notificationManager = new ExtensionNotification()
