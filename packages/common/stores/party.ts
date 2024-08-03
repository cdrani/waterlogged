import type { Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import { writable, derived } from 'svelte/store'

import type { LOG } from 'common/types'

export class PartyStore {
    private party: Writable<boolean>

    constructor() {
        this.party = writable<boolean>(this.partied)
    }

    get partied() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const hasPartied = JSON.parse(localStorage.getItem('confetti_shown') || 'false')
            if (hasPartied == null) {
                localStorage.setItem('confetti_shown', 'false')
                return false
            }
            return hasPartied
        }

        return false // Default value if localStorage is not available
    }

    set partied(partied: boolean) {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('confetti_shown', JSON.stringify(partied))
        }

        this.party.set(partied)
    }

    canParty({ goal, total }: Pick<LOG, 'goal' | 'total'>) {
        return derived(this.party, () => {
            if (this.partied) return false
            return (total / Number(goal)) * 100 >= 100
        }) 
    }

    resetParty({ goal, total }: Pick<LOG, 'goal' | 'total'>) {
        if (total == 0 || total < goal) {
            this.partied = false
        }
    }
}

const STORE = 'party'

export function getParty() {
    return getContext(STORE)
}

export function initParty() {
    setContext(STORE, new PartyStore())
}
