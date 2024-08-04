import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

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

    canParty(complete: boolean) {
        if (!complete) {
            this.partied = false
            return false
        }

        if (this.partied) return false

        return true
    }
}

const STORE = 'party'

export function getParty() {
    return getContext(STORE)
}

export function initParty() {
    setContext(STORE, new PartyStore())
}
