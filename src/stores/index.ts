import { writable, get, derived } from "svelte/store"

type Intake = number | undefined
type Measurement = 'ml' | 'cup' | undefined

export default class DataStore {
    constructor(port) {
        this._PORT = port

        this._intake = writable<Intake>() 
        this._measurement = writable<Measurement>()
        this._enabled = writable<boolean | undefined>()
        this._total = writable<number | undefined>()
        this._goal = writable<number | undefined>()

        this.#init()
        this.#populate()
    }

    #init() {
        this._PORT?.onMessage.addListener(async ({ key, response }) => {
            if (key == 'get:defaults:response') {
                this.#updateDefaults(response.defaults)
            }
        })
    }

    disconnect() {
        this._PORT.onDisconnect.addListener(() => (this._PORT = null))
    }

    #updateDefaults(data) {
        const { enabled, intake, measurement, total, goal } = data
        this.goal = goal
        this.total = total
        this.enabled = enabled
        this.intake = intake
        this.measurement = measurement
    }

    #populate() {
        this._PORT?.postMessage({ key: 'get:defaults', data: null })
    }

    incrementAmount() {
        const amount = get(this._intake)
        this._total.update(previousAmount => previousAmount + amount)
        this._PORT?.postMessage({ key: 'set:total', data: get(this._total) })
    }

    decrementAmount() {
        const amount = get(this._intake)
        this._total.update(previousAmount => Math.max(0, previousAmount - amount))
        this._PORT?.postMessage({ key: 'set:total', data: get(this._total) })
    }

    set goal(goal) {
        this._goal.set(goal)
    }

    set total(total) {
        this._total.set(total)
    }

    set intake(intake) {
        this._intake.set(intake)
    }

    set measurement(measurement) {
        this._measurement.set(measurement)
    }

    set enabled(enabled) {
        this._enabled.set(enabled)
    }

    get waterLevel() {
        return derived([this._goal, this._total], () => {
            const goal = (get(this?.goal) ?? 0) as number
            const total = (get(this.total) ?? 0) as number

            if (!total || total == 0 || !goal) return 0
            if (total == 0 || goal == 0) return 0
            return (total / goal) * 100
        })
    }

    get goal() {
        return this._goal
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
