import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

const STORE = 'party'

type Party = { celebrate: boolean }
type Context = Writable<Party>

export const INIT_PARTY: Party = { celebrate: false }

const party = writable(INIT_PARTY)
 
export function initParty() {
    setContext(STORE, party)
}

export function getParty() {
    return getContext<Context>(STORE)
}

export function startParty() {
    party.set({ celebrate: true })
}

export function endParty() {
    party.set({ celebrate: false })
}
