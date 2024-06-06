import { writable, get } from "svelte/store"

type Intake = number | undefined
type Measurement = 'ml' | 'cup' | undefined

export default class DataStore {
    constructor(port) {
        this._port = port
        this._intake = writable<Intake>(100) 
        this._measurement = writable<Measurement>('ml')
        this._total = writable<number>(0)
    }

    populate() {
        this._port?.postMessage('hello from store')
    }

    incrementAmount() {
        const amount = get(this._intake)
        this._total.update(previousAmount => previousAmount + amount)
    }

    decrementAmount() {
        const amount = get(this._intake)
        this._total.update(previousAmount => Math.max(0, previousAmount - amount))
    }

    get total() {
        return this._total
    }

    get measurement() {
        return this._measurement
    }

    get intake() {
        return this._intake
    }
}
