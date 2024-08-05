import { db } from 'common/data/db'
import { getDateMS } from 'common/utils/date'
import type { LOG, SETTINGS } from 'common/types'
import { createIntake } from 'common/data/defaults'
import { getEncouragingMessage } from 'common/utils/encouragements'
import { LogsService, SettingsService } from 'common/data/services'

const FULL_DAY_MS = 60 * 60 * 24 * 1000

export type Progress = { goal: number, left: number, percentage: number }
export type Notification = {  id: string, title: string, message: string }

export default abstract class NotificationBase {
    protected log: LOG | null
    protected settings: SETTINGS | null
    protected intervalId: Timer | null = null
    protected timeoutId: Timer | null = null

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
        console.log({ settings })
        if (!settings) return

        if (!this.settings.enabled || this.settings.alert_type === 'none') return await this.clearAlarms()

        await this.clearAlarms()
        const { nowMS, startMS } = this.getTimeBoundaries()

        // Calculate initial delay until the start time
        let delay = startMS - nowMS

        // if startMS is already passed for the day, set delay to the next day
        if (delay < 0) { delay += FULL_DAY_MS }
        this.setupAlarms(delay)
    }

    protected getTimeBoundaries() {
        const { start_time, end_time } = this.settings
        const nowMS = getDateMS()
        const startMS = getDateMS(start_time)
        let endMS = getDateMS(end_time)

        if (endMS <= startMS) { endMS += FULL_DAY_MS }

        return { nowMS, startMS, endMS }
    }

    protected async getSettings() {
        const settings = await SettingsService.load()
        this.settings = settings
        return settings
    }

    protected abstract clearAlarms(): Promise<void>
    protected abstract setupAlarms(delay: number): void
    protected abstract createNotification({ id, title, message }: { id: string, title: string, message: string }): Promise<void>

    protected async notifyAlert() {
        const { sound, alert_type } = this.settings
        const progress = await this.getProgress()

        console.log({ sound, alert_type, progress })
        if (progress.percentage >= 100) return

        if (['alarm', 'both'].includes(alert_type)) await this.playSound(sound)
        if (['notify', 'both'].includes(alert_type)) await this.notifyProgress(progress)
    }

    protected abstract playSound(sound: string): Promise<void>

    protected async getLog() {
        const log = await LogsService.load(this.settings)
        this.log = log
        return log
    }

    protected async getProgress() {
        const log = await this.getLog()
        const percentage = Math.round((log.total / log.goal) * 100)
        return { goal: log.goal, left: Math.max(log.goal - log.total, 0), percentage }
    }

    protected async logAmount() {
        const log = await this.getLog()

        const intake = createIntake({ log_id: log.id, amount: log.amount })
        const intakes = [intake, ...log.intakes]
        log.intakes = intakes

        await db.logs.put(log)
    }

    protected async notifyProgress(progress: Progress) {
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
