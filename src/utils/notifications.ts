import { getState, setState } from './state'
import { ENCOURAGEMENTS } from './encouragements'
import { getDateKey, getDateMS, getTimeStamp } from './date'
import type { DAILY_RESPONSE, SETTINGS, TODAY } from './types.d'
import { ensureOffscreenDocument, sendOffscreenMessage } from './offscreen'

const FULL_DAY_MS = 60 * 60 * 24 * 1000

type Progress = { goal: number, left: number, percentage: number }

export default class Notification {
    _today: TODAY | null
    _settings: SETTINGS | null

    constructor() {
        this._settings = null
        this._today = null
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

    async #clearAlarms() {
        await chrome.alarms.clearAll()
    }

    async startTimer() {
        const settings = await this.#getSettings()
        if (!settings) return

        if (!this._settings.enabled || this._settings.alert_type == 'none') return (await this.#clearAlarms())

        await this.#clearAlarms()
        const { nowMS, startMS } = this.#getTimeBoundaries()

        // Calculate initial delay until the start time
        let delay = startMS - nowMS

        // if startMS is already passed for the day, set delay to the next day
        if (delay < 0) { delay += FULL_DAY_MS }
        this.#setupAlarms(delay)
    }

    #setupAlarms(delay: number) {
        chrome.alarms.create('initialAlarm', { delayInMinutes: delay / 60_000, periodInMinutes: 1440 })

        chrome.alarms.create('intervalAlarm', {
            periodInMinutes: this._settings.interval,
            when: Date.now() +  this._settings.interval * 60 * 1000, 
        })

        chrome.alarms.onAlarm.addListener(async (alarm) => {
            if (!['initialAlarm', 'intervalAlarm'].includes(alarm.name)) return

            await this.#getSettings()
            const { nowMS, startMS, endMS } = this.#getTimeBoundaries()
            if (nowMS >= startMS && nowMS < endMS) await this.#notifyAlert()
        })
    }

    async #notifyAlert() {
        const { sound, alert_type } = this._settings
        const progress = await this.#getProgress()

        if (progress.percentage >= 100) return

        ;['alarm', 'both'].includes(alert_type) && this.#playSound(sound)
        ;['notify', 'both'].includes(alert_type) && this.#notifyProgress(progress)
    }

    async #playSound(sound: string) {
        await ensureOffscreenDocument()
        await sendOffscreenMessage(sound)
    }

    async #getToday() {
        const key = getDateKey()
        const response = await getState(key) as DAILY_RESPONSE
        const data = response[key]
        this._today = data
        return data
    }

    async #getProgress() {
        const data =  await this.#getToday()
        const current = data.logs.reduce((acc, curr ) => acc + curr.amount, 0)
        const percentage = Math.round((current / data.goal) * 100)
        return  { goal: data.goal, left: data.goal - current, percentage }
    }

    async #logAmount() {
        const data = await this.#getToday()
        const logs = [{ amount: data.amount, time: getTimeStamp() }, ...data.logs]
        const key = getDateKey() 
        await setState({ key, values: { ...data, logs } })
    }

    #createNotification({ title, message }: { title: string, message: string }) {
        const showButton = title.includes('Time to Hydrate!')
        chrome.notifications.clear(title)
        chrome.notifications.create(title, {
            title,
            message,
            type: 'basic',
            priority: 2,
            iconUrl: chrome.runtime.getURL("src/icons/icon48.png"),
            buttons: showButton ? [{ title: `Log ${this._settings.amount}ml` } ] : []
        })

        chrome.notifications.onButtonClicked.addListener(async (_, btnIdx) => {
            const isHydrating = title.includes('Time to Hydrate!')
            if (!isHydrating || btnIdx !== 0) return

            await this.#logAmount()
        })
    }

    #getEncouragingMessage(percentage: number): string {
        // Calculate the start and end of the range based on percentage
        const start = percentage - (percentage % 15)
        const end = Math.min(start + 15, 100)

        // Determine the category based on the start and end values
        const category: string =  percentage >= 100 ? '100' : `${start}-${end}`
        return ENCOURAGEMENTS[category][Math.floor(Math.random() * ENCOURAGEMENTS[category].length)]
    }

    async #notifyProgress(progress: Progress) {
        const { left, percentage, goal } = progress
        const encouragement = this.#getEncouragingMessage(percentage)
        const detail = percentage >= 100 
            ? `100%. ${goal} ml reached!`
            : `${percentage}% there. Only ${left}ml to reach goal.`

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
