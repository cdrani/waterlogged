import type { LOG, SETTINGS } from 'common/types'
import { getEncouragingMessage } from 'common/utils/encouragements'
import { LogsService, SettingsService } from 'common/data/services'
import { sendNotification } from '@tauri-apps/plugin-notification'

export type Progress = { goal: number, left: number, percentage: number }

export default class AppNotification {
    private log?: LOG
    private settings?: SETTINGS

    public async notify() {
        const { alert_type = "notify" } = this.settings ?? {}
        const progress = await this.getProgress()

        if (progress.percentage >= 100) return

        // if (['alarm', 'both'].includes(alert_type)) await this.playSound(sound)
        if (['notify', 'both'].includes(alert_type)) await this.notifyProgress(progress)
    }

    private async getSettings() {
        const settings = await SettingsService.load()
        this.settings = settings
        return settings
    }

    private async getLog() {
        if (!this.settings) await this.getSettings()
        const log = await LogsService.load(this!.settings)
        this.log = log
        return log
    }

    private async getProgress() {
        const log = await this.getLog()
        const percentage = Math.round((log.total / log.goal) * 100)
        return { goal: log.goal, left: Math.max(log.goal - log.total, 0), percentage }
    }

    // TODO: requires notification click action (not supported?)
    public async logAmount() {
        await this.getLog()
        await LogsService.addLogIntake()
    }

    private async notifyProgress(progress: Progress) {
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
