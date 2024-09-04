import type { LOG, SETTINGS } from 'common/types'
import { getEncouragingMessage } from 'common/utils/encouragements'
import { LogsService, SettingsService } from 'common/data/services'
import { sendNotification } from '@tauri-apps/plugin-notification'

export type Progress = { goal: number, left: number, percentage: number }

export default class AppNotification {
    protected log?: LOG
    protected settings?: SETTINGS

    protected async notify() {
        const { alert_type = "notify" } = this.settings ?? {}
        const progress = await this.getProgress()

        if (progress.percentage >= 100) return

        // if (['alarm', 'both'].includes(alert_type)) await this.playSound(sound)
        if (['notify', 'both'].includes(alert_type)) await this.notifyProgress(progress)
    }

    protected async getSettings() {
        const settings = await SettingsService.load()
        this.settings = settings
        return settings
    }

    protected async getLog() {
        if (!this.settings) await this.getSettings()
        const log = await LogsService.load(this!.settings)
        this.log = log
        return log
    }

    protected async getProgress() {
        const log = await this.getLog()
        const percentage = Math.round((log.total / log.goal) * 100)
        return { goal: log.goal, left: Math.max(log.goal - log.total, 0), percentage }
    }

    protected async logAmount() {
        await this.getLog()
        await LogsService.addLogIntake()
    }

    protected async notifyProgress(progress: Progress) {
        const { left, percentage, goal } = progress
        const encouragement = getEncouragingMessage(percentage)

        const detail = percentage >= 100
            ? `100%. ${goal} ml reached!`
            : `${percentage}% there. Only ${left}ml to reach goal.`

        sendNotification({
            title: 'Water Break Time! Time to Hydrate!',
            body: `${encouragement} ${detail}`,
        })
    }
}
