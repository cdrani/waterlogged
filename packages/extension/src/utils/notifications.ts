import { db } from 'common/data/db'
import type { LOG, SETTINGS } from 'common/types'
import { getDateMS } from 'common/utils/date'
import { getEncouragingMessage } from 'common/utils/encouragements'
import { createIntake } from 'common/data/defaults'
import { ensureOffscreenDocument, sendOffscreenMessage } from './offscreen'
import { LogsService, SettingsService } from 'common/data/services'

const FULL_DAY_MS = 60 * 60 * 24 * 1000

type Progress = { goal: number, left: number, percentage: number }

export default class Notification {
    private log: LOG | null
    private settings: SETTINGS | null

    constructor() {
        this.log = null
        this.settings = null
    }

    async welcome() {
        await this.createNotification({
            id: 'welcome',
            title: 'Welcome!',
            message: 'Your journey to a well-hydrated life starts now!',
        })
    }

    async startTimer() {
        const settings = await this.getSettings()
        if (!settings) return

        if (!this.settings.enabled || this.settings.alert_type == 'none') return (await this.clearAlarms())

        await this.clearAlarms()
        const { nowMS, startMS } = this.getTimeBoundaries()

        // Calculate initial delay until the start time
        let delay = startMS - nowMS

        // if startMS is already passed for the day, set delay to the next day
        if (delay < 0) { delay += FULL_DAY_MS }
        this.setupAlarms(delay)
    }

    private async createNotification({ id, title, message }: { id: string, title: string, message: string }) {
        const showButton = title.includes('Time to Hydrate!')
        chrome.notifications.clear(id)
        chrome.notifications.create(id, {
            title,
            message,
            type: 'basic',
            priority: 2,
            iconUrl: chrome.runtime.getURL("src/icons/icon48.png"),
            buttons: showButton ? [{ title: `Log ${this.settings.amount}ml` } ] : []
        })

        chrome.notifications.onButtonClicked.addListener(async (id, btnIdx) => {
            const isHydrating = title.includes('Time to Hydrate!')
            if (!isHydrating || btnIdx !== 0) return

            await this.logAmount()
            chrome.notifications.clear(id)
        })

        chrome.notifications.onClicked.addListener(chrome.notifications.clear)
    }

    private getTimeBoundaries() {
        const { start_time, end_time } = this.settings
        const nowMS = getDateMS()
        const startMS = getDateMS(start_time)
        let endMS = getDateMS(end_time)

        if (endMS <= startMS) { endMS += FULL_DAY_MS }

        return { nowMS, startMS, endMS }
    }

    private async getSettings() {
        const settings = await SettingsService.load()
        this.settings = settings
        return settings
    }

    private async clearAlarms() {
        await chrome.alarms.clearAll()
    }

    private setupAlarms(delay: number) {
        chrome.alarms.create('initialAlarm', { delayInMinutes: delay / 60_000, periodInMinutes: 1440 })

        chrome.alarms.create('intervalAlarm', {
            periodInMinutes: this.settings.interval,
            when: Date.now() +  this.settings.interval * 60 * 1000, 
        })

        chrome.alarms.onAlarm.addListener(async (alarm) => {
            if (!['initialAlarm', 'intervalAlarm'].includes(alarm.name)) return

            await this.getSettings()
            const { nowMS, startMS, endMS } = this.getTimeBoundaries()
            if (nowMS >= startMS && nowMS < endMS) await this.notifyAlert()
        })
    }

    private async notifyAlert() {
        const { sound, alert_type } = this.settings
        const progress = await this.getProgress()

        if (progress.percentage >= 100) return

        ;['alarm', 'both'].includes(alert_type) && await this.playSound(sound)
        ;['notify', 'both'].includes(alert_type) && await this.notifyProgress(progress)
    }

    private async playSound(sound: string) {
        await ensureOffscreenDocument()
        await sendOffscreenMessage(sound)
    }

    private async getLog() {
        const log = await LogsService.load(this.settings)
        this.log = log
        return log
    }

    private async getProgress() {
        const log =  await this.getLog()
        const current = log.intakes.reduce((acc, curr ) => acc + curr.amount, 0)
        const percentage = Math.round((current / log.goal) * 100)
        return  { goal: log.goal, left: log.goal - current, percentage }
    }

    private async logAmount() {
        const log = await this.getLog()

        const intake = createIntake({ log_id: log.id, amount: log.amount })
        const intakes = [intake, ...log.intakes]
        log.intakes = intakes

        await db.logs.put(log)
    }

    private async notifyProgress(progress: Progress) {
        const { left, percentage, goal } = progress
        const encouragement = getEncouragingMessage(percentage)

        const detail = percentage >= 100 
            ? `100%. ${goal} ml reached!`
            : `${percentage}% there. Only ${left}ml to reach goal.`

        await this.createNotification({ 
            id: 'progress',
            title: 'Water Break Time! Time to Hydrate!',
            message: `${encouragement} ${detail}`,
        })
    }
}
