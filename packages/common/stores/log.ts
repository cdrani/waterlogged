import type { Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import { writable, get, derived } from 'svelte/store'

import type { LOG, INTAKE } from 'common/types'
import { createIntake } from 'common/data/defaults'
import { convertToDate, convertTo24HourFormat, } from 'common/utils/date'
import { type Messaging, ExtMessaging, WebMessaging } from 'common/stores/messaging'

export class LogStore {
    private log: Writable<LOG>
    private messaging: Messaging
    private party: Writable<boolean>

    constructor(messaging: Messaging) {
        this.log = writable<LOG>()
        this.messaging = messaging
        this.party = writable<boolean>(this.partied)

        this.init()
    }

    private init() {
        this.messaging.onMessage(({ type, response }) => {
            if (type == 'get:log:response') {
                const data = response.log
                this.updateLog(data)
            }
        })
    }

    get partied() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const hasPartied = JSON.parse(localStorage.getItem('party_shown') || 'false')
            if (hasPartied == null) {
                localStorage.setItem('party_shown', 'false')
                return false
            }
            return hasPartied
        }

        return false // Default value if localStorage is not available
    }

    set partied(partied: boolean) {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('party_shown', JSON.stringify(partied))
        }
        this.party.set(partied)
    }

    get canParty() {
        return derived([this.party, this.log], () => {
            if (this.partied) return false

            const log = get(this.log)
            if (!log) return false

            const { intakes = [], goal } = log
            if (!intakes.length) return false 

            const total = intakes.reduce((acc: number, curr: INTAKE) => acc + Number(curr.amount), 0)
            return (total / Number(goal)) * 100 >= 100
        }) 
    }

    populate() {
        this.messaging.postMessage({ type: 'get:log', data: get(this.log) })
    }

    private resetParty(log: LOG) {
        const { intakes = [], goal } = log
        const total = intakes.reduce((acc: number, intake: INTAKE) => acc + Number(intake.amount), 0)
        if (intakes.length == 0 || total < Number(goal)) {
            this.partied = false
        }
    }

    private updateLog(log: LOG) {
        this.log.set(log)
        this.resetParty(log)
    }

    private findInsertionIndex(times: string[], newTime: string) {
        const newDateTime = convertToDate(newTime)

        for (let i = 0; i < times.length; i++) {
            if (newDateTime >= convertToDate(times[i])) {
                return i
            }
        }
        return times.length
    }

    logCustomAmount({ amount, time }: INTAKE) {
        const { id: log_id, intakes } = get(this.log)

        const formatedLogTimes = intakes.map(({ time }: INTAKE) => convertTo24HourFormat(time))
        const insertIndex = this.findInsertionIndex(formatedLogTimes, time)
        intakes.splice(insertIndex, 0, createIntake({ log_id, amount, time }))

        this.log.update(previous => ({ ...previous, intakes }))
        this.updateStorage()
    }

    private updateStorage() {
        const log = get(this.log)
        this.resetParty(log)
        this.messaging.postMessage({ type: 'set:log', data: log  })
    }

    removeLog(intakeId: string) {
        let { intakes } = get(this.log)
        intakes = intakes.filter(({ id }) => id !== intakeId)
        this.log.update(previous => ({ ...previous, intakes }))
        this.updateStorage()
    }

    logAmount() {
        const { id: log_id, amount } = get(this.log)
        const intake = createIntake({ log_id, amount }) 
        this.log.update(previous => ({ ...previous, intakes: [intake, ...previous.intakes] }))
        this.updateStorage()
    }

    get data() {
        return this.log
    }

    private calculateTotal(intakes: INTAKE[]) {
        if (!intakes?.length) return 0

        return intakes.reduce((acc, curr) => acc + Number(curr.amount), 0)
    }

    get total() {
        return derived(this.log, () => {
            const log = get(this.log)
            if (!log) return 0

            return this.calculateTotal(log.intakes)
        })
    }

    get waterLevel() {
        return derived(this.log, () => {
            const log = get(this.log)
            if (!log) return 0

            const { goal, intakes } = log
            const total = this.calculateTotal(intakes)
            return total == 0 ? 0 : (total / Number(goal)) * 100
        })
    }
}

const STORE = 'log'

export function getLog() {
    return getContext(STORE)
}

export function initLog(port?: chrome.runtime.Port) {
    const messaging = port ? new ExtMessaging(port) : new WebMessaging()
    setContext(STORE, new LogStore(messaging))
}