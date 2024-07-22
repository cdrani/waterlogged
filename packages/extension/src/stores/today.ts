import type { Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import { writable, get, derived } from 'svelte/store'

import type { LOG, INTAKE } from 'common/types'

import { createIntake } from 'common/stores/defaults'
import { convertToDate, convertTo24HourFormat, } from 'common/utils/date'

export default class TodayStore {
    _PORT: chrome.runtime.Port
    _today: Writable<LOG>
    _party: Writable<boolean>

    constructor(port: chrome.runtime.Port) {
        this._PORT = port
        this._today = writable<LOG>()
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

            const log = get(this._today)
            if (!log) return false

            const { intakes = [], goal } = log
            if (!intakes.length) return false 

            const total = intakes.reduce((acc: number, curr: INTAKE) => acc + Number(curr.amount), 0)
            return (total / Number(goal)) * 100 >= 100
        }) 
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ type, response }) => {
            if (type == 'get:today:response') {
                const data = response.log
                this.#updateToday(data)
            }
        })
    }

    populate() {
        this._PORT?.postMessage({ type: 'get:today', data: get(this._today) })
    }

    #resetParty(data: LOG) {
        const { intakes = [], goal } = data
        const total = intakes.reduce((acc: number, intake: INTAKE) => acc + Number(intake.amount), 0)
        if (intakes.length == 0 || total < Number(goal)) {
            this.partied = false
        }
    }

    #updateToday(data: LOG) {
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

    logCustomAmount({ amount, time }: INTAKE) {
        const { id: log_id, intakes } = get(this._today)
        const formatedLogTimes = intakes.map(({ time }: INTAKE) => convertTo24HourFormat(time))
        const insertIndex = this.findInsertionIndex(formatedLogTimes, time)

        intakes.splice(insertIndex, 0, createIntake({ log_id, amount, time }))

        this._today.update(previous => ({ ...previous, intakes }))

        this.#updateStorage()
    }

    #updateStorage() {
        const data = get(this._today)
        this.#resetParty(data)
        this._PORT?.postMessage({ type: 'set:today', data  })
    }

    logAmount(add = true, index: number = undefined) {
        if (add) {
            const { id: log_id, amount } = get(this._today)
            const intake = createIntake({ log_id, amount }) 
            this._today.update(previous => ({ ...previous, intakes: [intake, ...previous.intakes] }))
        } else {
            if (index != undefined) {
                const { intakes } = get(this._today)
                intakes.splice(index, 1)
                this._today.update(previous => ({ ...previous, intakes }))
            } else {
                this._today.update(previous => ({ ...previous, intakes: [...previous.intakes.slice(1)] }))
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

    #calculateTotal(intakes: INTAKE[]) {
        if (!intakes?.length) return 0

        return intakes.reduce((acc, curr) => acc + Number(curr.amount), 0)
    }

    get total() {
        return derived(this._today, () => {
            const log = get(this._today)
            if (!log) return 0

            return this.#calculateTotal(log.intakes)
        })
    }

    get waterLevel() {
        return derived(this._today, () => {
            const log = get(this._today)
            if (!log) return 0

            const { goal, intakes } = log
            const total = this.#calculateTotal(intakes)
            return total == 0 ? 0 : (total / Number(goal)) * 100
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
