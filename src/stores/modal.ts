import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

const STORE = 'modal'

type View = 'add' | 'edit' | 'complete' | 'help' | null
type Modal = { visible: boolean; view: View }
type Context = Writable<Modal>

export const INIT_MODAL: Modal = { visible: false, view: null }

const modal = writable(INIT_MODAL)

export function initModal() {
    setContext(STORE, modal)
}

export function getModal() {
    return getContext<Context>(STORE)
}

export function openModal(view: View) {
    modal.update((prevState: Modal) => ({ ...prevState, visible: true, view }))
}

export function closeModal() {
    modal.update((prevState: Modal) => ({ ...prevState, view: null, visible: false }))
}
