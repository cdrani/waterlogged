import { getState } from './state'
import { getDateKey, getDateMS } from './date'
import { ENCOURAGEMENTS } from './encouragements'
import type { DAILY_RESPONSE, SETTINGS, TODAY } from './types.d'
import { ensureOffscreenDocument, sendOffscreenMessage } from './offscreen'

const FULL_DAY_MS = 60 * 60 * 24 * 1000

type Progress = { goal: number, left: number, percentage: number }

export default class Notification {
    _timer: Timer | null
    _today: TODAY | null
    _settings: SETTINGS | null
    _initialTimeout: Timer | null

    constructor() {
        this._timer = null
        this._settings = null
        this._today = null
        this._initialTimeout = null
    }

    welcome() {
        this.#createWelcome()
    }

    #getTimeBoundaries() {
        const { start_time, end_time } = this._settings
        const nowMS = getDateMS()
        const startMS = getDateMS(start_time)
        let endMS = getDateMS(end_time)

        if (endMS <= startMS) { endMS += FULL_DAY_MS }

        return { nowMS, startMS, endMS }
    }

    async #getSettings() {
        const { settings } = await getState('settings')
        if (settings) (this._settings = settings)
        return settings
    }

    #clearTimers() {
        if (this._timer) clearInterval(this._timer)
        if (this._initialTimeout) clearTimeout(this._initialTimeout)

        this._timer = null
        this._initialTimeout = null
    }

    async startTimer() {
        const settings = await this.#getSettings()
        if (!settings) return

        if (!this._settings.enabled || this._settings.alert_type == 'none') return this.#clearTimers()

        const { nowMS, startMS, endMS } = this.#getTimeBoundaries()
        this.#clearTimers()

        // Calculate initial delay until the start time
        let delay = startMS - nowMS

        // if start time is already passed for the day, set it to the next day
        if (delay < 0) { delay += FULL_DAY_MS }
        this.#setupTimers({ startMS, endMS, delay })
    }

    #setupTimers({ startMS, endMS, delay }) {
        this._initialTimeout = setTimeout(async () => await this.#notifyAlert(), delay)

        this._timer = setInterval(async () => {
            const nowMS = getDateMS()
            nowMS >= startMS && nowMS < endMS ? (await this.#notifyAlert()) : this.#clearTimers()
        }, this._settings.interval * 60 * 1000)
    }

    async #notifyAlert() {
        const { sound, alert_type } = this._settings
        const progress = await this.#getProgress()

        if (progress.percentage > 100) return

        ;['notify', 'both'].includes(alert_type) && this.#notifyProgress(progress)
        ;['alarm', 'both'].includes(alert_type) && this.#playSound(sound)
    }

    async #playSound(sound: string) {
        await ensureOffscreenDocument()
        await sendOffscreenMessage(sound)
    }

    async #getProgress() {
        const key = getDateKey()
        const response = await getState(key) as DAILY_RESPONSE
        const data = response[key]
        const current = data.logs.reduce((acc, curr ) => acc + curr.amount, 0)
        const percentage = Math.round((current / data.goal) * 100)
        return  { goal: data.goal, left: data.goal - current, percentage }
    }

    #createNotification({ title, message }: { title: string, message: string }) {
        chrome.notifications.create({
            title,
            message,
            type: 'basic',
            iconUrl: chrome.runtime.getURL("src/icons/icon48.png")
        })
    }

    #getEncouragingMessage(percentage: number): string {
        // Calculate the start and end of the range based on percentage
        const start = percentage - (percentage % 15)
        const end = Math.min(start + 15, 100)

        // Determine the category based on the start and end values
        const category: string =  percentage >= 100 ? '100' : `${start}-${end}`;
        return ENCOURAGEMENTS[category][Math.floor(Math.random() * ENCOURAGEMENTS[category].length)];
    }

    async #notifyProgress(progress: Progress) {
        const { left, percentage, goal } = progress
        const encouragement = this.#getEncouragingMessage(percentage)
        const detail = percentage >= 100 ? `100%. ${goal} ml reached!` : `${percentage}% there. Only ${left}ml to reach goal.`

        this.#createNotification({ 
            title: 'Water Break Time! Time to Hydrate!',
            message: `${encouragement} ${detail}`,
        })
    }

    #createWelcome() {
        this.#createNotification({ 
            title: 'Welcome!',
            message: 'Your journey to a well-hydrated life starts now!',
        })
    }
}
