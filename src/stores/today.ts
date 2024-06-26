import { getContext, setContext } from 'svelte'
import { writable, get, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'

import type { LOG, TODAY } from '../utils/types'
import { TODAY_DEFAULT } from '../utils/defaults'

import { getDateKey, getTimeStamp, convertToDate, convertTo24HourFormat, formatTime } from '../utils/date'

export default class TodayStore {
    _PORT: chrome.runtime.Port
    _today: Writable<TODAY>
    _party: Writable<boolean>

    constructor(port: chrome.runtime.Port) {
        this._PORT = port
        this._today = writable<TODAY>(TODAY_DEFAULT)
        this._party = writable<boolean>(this.partied)

        this.#init()
    }

    get partied() {
        const hasPartied = JSON.parse(localStorage.getItem('party_shown'))
        if (hasPartied == null) {
            localStorage.setItem('party_shown', `${false}`)
            return false
        }
        return hasPartied
    }

    set partied(partied: boolean) {
        localStorage.setItem('party_shown', `${partied}`)
        this._party.set(partied)
    }

    get canParty() {
        return derived([this._party, this._today], () => {
            if (this.partied) return false

            const { logs = [], goal } = get(this._today) as TODAY
            if (!logs.length) return false 

            const total = logs.reduce((acc: number, curr: LOG) => acc + Number(curr.amount), 0)
            return (total / Number(goal)) * 100 >= 100
        }) 
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ type, response }) => {
            if (type == 'get:today:response') {
                const data = response[getDateKey()]
                this.#updateToday(data)
            }
        })
    }

    populate() {
        this._PORT?.postMessage({ type: 'get:today', data: get(this._today) })
    }

    syncWithSettings({ measurement, goal, amount }) {
        this.populate()

        const today = get(this._today) as TODAY
        const data = { ...today, measurement, goal, amount }
        this._today.set(data)
        this._PORT?.postMessage({ type: 'set:today', data })
    }

    #resetParty(data: TODAY) {
        const { logs, goal } = data
        const total = logs.reduce((acc: number, log: LOG) => acc + Number(log.amount), 0)
        if (logs.length == 0 || total < Number(goal)) {
            this.partied = false
        }
    }

    #updateToday(data: TODAY) {
        this._today.set(data)
        this.#resetParty(data)
    }

    findInsertionIndex(times: string[], newTime: string) {
        const newDateTime = convertToDate(newTime)

        for (let i = 0; i < times.length; i++) {
            if (newDateTime >= convertToDate(times[i])) {
                return i
            }
        }
        return times.length
    }

    logCustomAmount({ amount, time }: LOG) {
        const { logs } = get(this._today)
        const formatedLogTimes = logs.map(({ time }: LOG) => convertTo24HourFormat(time))
        const insertIndex = this.findInsertionIndex(formatedLogTimes, time)

        logs.splice(insertIndex, 0, { amount, time: formatTime(time) })

        this._today.update(previous => ({ ...previous, logs }))

        this.#updateStorage()
    }

    #updateStorage() {
        const data = get(this._today)
        this.#resetParty(data)
        this._PORT?.postMessage({ type: 'set:today', data  })
    }

    logAmount(add = true, index: number = undefined) {
        if (add) {
            const { amount } = get(this._today)
            const log = { amount, time: getTimeStamp() } 
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
            const { logs = [] } = get(this._today) as TODAY
            if (!logs.length) return 0

            return logs.reduce((acc: number, curr: LOG) => acc + curr.amount, 0)
        })
    }

    get total() {
        return this.#derivedTotal
    }

    get waterLevel() {
        return derived(this._today, () => {
            const { logs = [], goal } = get(this._today) as TODAY
            if (!logs.length) return 0

            const total = logs.reduce((acc: number, curr: LOG) => acc + curr.amount, 0)
            return (total / Number(goal)) * 100
        })
    }
}

const STORE = 'today'

export function initToday(port: chrome.runtime.Port) {
    setContext(STORE, new TodayStore(port))
}

export function getToday() {
    return getContext(STORE)
}
