import { getContext, setContext } from 'svelte'
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
        this._party = writable<boolean>(this.partied)

        this.#init()
    }

    get partied() {
        const hasPartied = JSON.parse(localStorage.getItem('party_shown'))
        if (hasPartied == null) {
            localStorage.setItem('party_shown', false)
            return false
        }
        return hasPartied
    }

    set partied(partied: boolean) {
        localStorage.setItem('party_shown', partied)
        this._party.set(partied)
    }

    get canParty() {
        return derived([this._party, this._today], () => {
            if (this.partied) return false

            const { logs = [], goal } = get(this._today) as Today
            if (!logs.length) return false 

            const total = logs.reduce((acc: number, curr: Log) => acc + Number(curr.amount), 0)
            return (total / Number(goal)) * 100 >= 100
        }) 
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ type, response }) => {
            if (type == 'get:today:response') {
                const data = response[this.#dateKey]
                this.#updateToday(data)
            }
        })
    }

    populate() {
        this._PORT?.postMessage({ type: 'get:today', data: get(this._today) })
    }

    syncWithSettings({ measurement, goal, intake }) {
        this.populate()

        const today = get(this._today) as Today
        const data = { ...today, measurement, goal, intake }
        this._today.set(data)
        this._PORT?.postMessage({ type: 'set:today', data })
    }

    #resetParty(data: Today) {
        const { logs, goal } = data
        const total = logs.reduce((acc: number, log: Log) => acc + Number(log.amount), 0)
        if (logs.length == 0 || total <= Number(goal)) {
            this.partied = false
        }
    }

    #updateToday(data: Today) {
        this._today.set(data)
        this.#resetParty(data)
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

    formatTime(timeString: string): string {
        const [hours, minutes] = timeString.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);

        const locales = navigator.languages as string[];
        return new Intl.DateTimeFormat(locales, {
            timeStyle: 'short'
        }).format(now);
    }

    convertTo24HourFormat(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        hours = parseInt(hours, 10) // remove zero-padding

        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        
        return `${hours}:${minutes}`;
    }

    convertToDate(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        
        return date;
    }

    findInsertionIndex(times: string[], newTime: string) {
        const newDateTime = this.convertToDate(newTime)

        for (let i = 0; i < times.length; i++) {
            if (newDateTime >= this.convertToDate(times[i])) {
                return i
            }
        }
        return times.length
    }

    logCustomIntake({ amount, time }: Log) {
        const { logs } = get(this._today)
        const formatedLogTimes = logs.map(({ time }: Log) => this.convertTo24HourFormat(time))
        const insertIndex = this.findInsertionIndex(formatedLogTimes, time)

        logs.splice(insertIndex, 0, { amount, time: this.formatTime(time) })

        this._today.update(previous => ({ ...previous, logs }))

        this.#updateStorage()
    }

    #updateStorage() {
        const data = get(this._today)
        this.#resetParty(data)
        this._PORT?.postMessage({ type: 'set:today', data  })
    }

    logIntake(add = true, index: number = undefined) {
        if (add) {
            const { intake: amount } = get(this._today)
            const log = { amount, time: this.#timeStamp } 
            this._today.update(previous => ({ ...previous, logs: [log, ...previous.logs] }))
        } else {
            if (index != undefined) {
                const { logs } = get(this._today)
                logs.splice(index, 1)
                this._today.update(previous => ({ ...previous, logs }))
            } else {
                this._today.update(previous => ({ ...previous, logs: [...previous.logs.slice(1)] }))
            }
        }

        this.#updateStorage()
    }

    get today() {
        return this._today
    }

    get party() {
        return this._party
    }

    get #derivedTotal() {
        return derived(this._today, () => {
            const { logs = [] } = get(this._today) as Today
            if (!logs.length) return 0

            return logs.reduce((acc: number, curr: Log) => acc + parseInt(curr.amount, 10), 0)
        })
    }

    get total() {
        return this.#derivedTotal
    }

    get waterLevel() {
        return derived(this._today, () => {
            const { logs = [], goal } = get(this._today) as Today
            if (!logs.length) return 0

            const total = logs.reduce((acc: number, curr: Log) => acc + Number(curr.amount), 0)
            return (total / Number(goal)) * 100
        })
    }
}

const STORE = 'today'

export function initToday(port) {
    setContext(STORE, new TodayStore(port))
}

export function getToday() {
    return getContext(STORE)
}
