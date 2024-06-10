import { writable, get, derived } from 'svelte/store'

type Log = {
    time: string,
    amount: number,
}

type Today = {
    intake: number,
    logs: Log[],
    goal: number,
    measurement: 'ml' | 'cup',
}

const defaultToday: Today = {
    intake: 100,
    logs: [],
    goal: 1800,
    measurement: 'ml'
}

export default class TodayStore {
    constructor(port) {
        this._PORT = port
        this._today = writable<Today>(defaultToday)

        this.#init()
        this.#populate()
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ key, response }) => {
            if (key == 'get:today:response') {
                const data = response[this.#dateKey]
                this.#updateToday(data)
            }
        })

        this.#populate()
    }

    #populate() {
        this._PORT?.postMessage({ key: 'get:today', data: defaultToday })
    }

    #updateToday(data: Today) {
        this._today.set(data)
    }

    get #dateKey() {
        return new Intl.DateTimeFormat('sv-SE', {
            dateStyle: 'short'
        }).format(new Date())
    }

    get #timeStamp() {
        const locales = navigator.languages as string[]
        return new Intl.DateTimeFormat(locales, {
            timeStyle: 'short'
        }).format(new Date())
    }

    logIntake(add = true) {
        if (add) {
            const { intake: amount } = get(this._today)
            const log = { amount, time: this.#timeStamp } 
            this._today.update(previous => ({ ...previous, logs: [log, ...previous.logs] }))
        } else {
            this._today.update(previous => ({ ...previous, logs: [...previous.logs.slice(1)] }))
        }

        this._PORT?.postMessage({ key: 'set:today', data: get(this._today) })
    }

    get today() {
        return this._today
    }

    get total() {
        return derived(this._today, () => {
            const { logs = [] } = get(this._today) as Today
            if (!logs.length) return 0

            return logs.reduce((acc: number, curr: Log) => acc + curr.amount, 0)
        })
    }

    get waterLevel() {
        return derived(this._today, () => {
            const { logs = [], goal } = get(this._today) as Today
            if (!logs.length) return 0

            const total = logs.reduce((acc: number, curr: Log) => acc + curr.amount, 0)
            return (total / goal) * 100
        })
    }

    disconnect() {
        this._PORT.onDisconnect.addListener(() => (this._PORT = null))
    }
}
